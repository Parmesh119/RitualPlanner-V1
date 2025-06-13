package ritualplanner.repository

import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import ritualplanner.config.JwtUtil
import ritualplanner.model.LoginResponse
import ritualplanner.model.RegisterRequest
import ritualplanner.model.User
import ritualplanner.model.UserAuth
import java.sql.ResultSet
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID
import kotlin.math.sign

@Repository
class AuthRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val jwtUtil: JwtUtil,
    private val refreshTokenRepository: RefreshTokenRepository
) {
    private val rowMapper = RowMapper {
        rs: ResultSet, _: Int ->
        User(
            id = rs.getString("id"),
            name = rs.getString("name"),
            email = rs.getString("email"),
            phone = rs.getString("phone"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
        )
    }

    fun register(registerRequest: RegisterRequest, username: String, hashPassword: String, userId: String, createdAt: Long, updatedAt: Long): Boolean {
        val sql = """
            INSERT INTO "User" (id, name, email, phone, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?)
        """

        try {
            val rowsAffected = jdbcTemplate.update(
                sql,
                userId,
                registerRequest.name,
                registerRequest.email,
                registerRequest.phone,
                Timestamp.from(Instant.ofEpochMilli(createdAt)),
                Timestamp.from(Instant.ofEpochMilli(updatedAt))
            )

            if (rowsAffected > 0) {
                val sql = """
                    INSERT INTO "Auth" (id, user_id, username, password, created_at, updated_at, signin)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """

                val id = UUID.randomUUID().toString()
                try {
                    val record = jdbcTemplate.update(
                        sql,
                        id,
                        userId,
                        username,
                        hashPassword,
                        Timestamp.from(Instant.ofEpochMilli(createdAt)),
                        Timestamp.from(Instant.ofEpochMilli(updatedAt)),
                        registerRequest.signin
                    )

                    if(record > 0) {
                        return true
                    } else {
                        throw Exception("Failed to register User")
                    }

                } catch (e: Exception) {
                    throw Exception("Failed Registration with an error", e)
                }
            } else {
                throw Exception("Register failed")
            }
        } catch (e: Exception) {
            throw Exception("Register failed", e)
        }
    }

    fun findUserAuthByUsername(username: String): UserAuth? {
        val sql = """SELECT * FROM "Auth" WHERE username = ?"""
        return try {
            jdbcTemplate.query(sql, arrayOf(username)) { rs, _ ->
                UserAuth(
                    id = rs.getString("id"),
                    userId = rs.getString("user_id"),
                    username = rs.getString("username"),
                    hashPassword = rs.getString("password"),
                    signin = rs.getString("signin"),
                    createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
                    updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
                )
            }.firstOrNull()
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("User not found")
        }
    }

    fun findUserById(userId: String): User {
        val sql = """SELECT * FROM "User" WHERE id = ?"""
        return try {
            jdbcTemplate.queryForObject(sql, arrayOf(userId)) { rs, _ ->
                User(
                    id = rs.getString("id"),
                    name = rs.getString("name"),
                    email = rs.getString("email"),
                    phone = rs.getString("phone"),
                    createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
                    updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
                )
            }!!
        } catch(e: Exception) {
            throw Exception("Failed to find the User with Id: $userId")
        }
    }

    fun loadUserDetails(username: String): org.springframework.security.core.userdetails.User {
        val userAuth = findUserAuthByUsername(username) ?: throw RuntimeException("User not found")
        return org.springframework.security.core.userdetails.User(
            userAuth.username, userAuth.hashPassword, listOf()
        )
    }

    fun refreshToken(refreshToken: String): LoginResponse {
        try {
            // Validate the refresh token
            val username = jwtUtil.extractSubject(refreshToken)
            val user = getUserDetails(username!!)
            // Generate a new access token
            val newAccessToken = jwtUtil.generateAccessToken(user, loadUserDetails(username))
            val newRefreshToken = jwtUtil.generateRefreshToken(username)

            // Store the new refresh token in the database
            val getRefreshTokenId = refreshTokenRepository.getRefreshToken(refreshToken)
            refreshTokenRepository.updateRefreshToken(newRefreshToken, getRefreshTokenId?.id!!)

            return LoginResponse(accessToken = newAccessToken, refreshToken = newRefreshToken)
        } catch (e: Exception) {
            throw Exception("Failed to refresh token")
        }
    }

    fun getUserDetails(username: String): User {
        try {
            val sql = """SELECT user_id from "Auth" WHERE username = ?"""

            val userId = jdbcTemplate.queryForObject(sql, arrayOf(username)) { rs, _ ->
                sql
                rs.getString("user_id")
            }
            return jdbcTemplate.queryForObject(
                """SELECT * FROM "User" WHERE id = ?""",
                rowMapper,
                userId
            ) ?: throw Exception("User not found")
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to get user details")
        }
    }

    fun getUserDetailsByEmail(email: String): User {
        val sql = """SELECT * from "User" WHERE email = ?"""

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, email) ?: throw Exception("User not found")
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to get user details")
        }
    }

    fun checkAuthTypeByEmail(email: String): String {
        return try {
            val userId = getUserDetailsByEmail(email).id

            val sql = """SELECT signin FROM "Auth" WHERE user_id = ? """
            val signIn = jdbcTemplate.queryForObject(sql, String::class.java, userId)
            signIn ?: throw Exception("User not found")
        } catch (e: EmptyResultDataAccessException) {
            e.printStackTrace()
            throw Exception("Email not found")
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to check auth type: ${e.message}")
        }
    }

    fun getEmailFromUserId(userId: String): User {
        val sql = """SELECT * FROM "User" WHERE email = ?"""

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, userId) ?: throw Exception("Email not found")
        } catch (e: Exception) {
            throw Exception("Error while fetching email")
        }
    }

    fun resetPassword(email: String, hashPassword: String): Boolean {
        return try {
            val sql = """SELECT id from "User" WHERE email = ?"""
            val userId = jdbcTemplate.queryForObject(sql, String::class.java, email)

            val updateSql = """UPDATE "Auth" SET password = ? WHERE user_id = ?"""
            val result = jdbcTemplate.update(updateSql, hashPassword, userId)
            if(result <= 0) {
                throw Exception("Failed to update password")
            }
            true
        } catch (e: Exception) {
            throw Exception("Failed to update password")
        }
    }
}