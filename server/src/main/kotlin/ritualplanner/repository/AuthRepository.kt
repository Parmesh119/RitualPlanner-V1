package ritualplanner.repository

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import ritualplanner.model.RegisterRequest
import ritualplanner.model.User
import ritualplanner.model.UserAuth
import java.sql.ResultSet
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID

@Repository
class AuthRepository(
    private val jdbcTemplate: JdbcTemplate
) {
    private val rowMapper = RowMapper {
        rs: ResultSet, _: Int ->
        RegisterRequest(
            name = rs.getString("name"),
            email = rs.getString("email"),
            phone = rs.getString("phone"),
            password = rs.getString("password")
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
                    INSERT INTO "Auth" (id, user_id, username, password, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
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
                        Timestamp.from(Instant.ofEpochMilli(updatedAt))
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
}