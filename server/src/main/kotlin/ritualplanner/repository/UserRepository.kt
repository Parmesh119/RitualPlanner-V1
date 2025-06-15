package ritualplanner.repository

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import ritualplanner.model.User
import java.sql.ResultSet

@Repository
class UserRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val authRepository: AuthRepository
) {

    private val rowMapper = RowMapper {
            rs: ResultSet, _: Int ->
        User(
            id = rs.getString("id"),
            name = rs.getString("name"),
            email = rs.getString("email"),
            phone = rs.getString("phone"),
            state = rs.getString("state"),
            country = rs.getString("country"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
        )
    }

    fun getAccountDetails(email: String): User {
        return try {
            authRepository.getUserDetailsByEmail(email)
        } catch (e: Exception) {
            throw Exception("User not found!")
        }
    }

    @Transactional
    fun deleteAccount(email: String, user_id: String, authDetails: String): String {
        return try {
            val refreshTokenDeleteSql = """DELETE FROM "RefreshToken" WHERE user_id = ?"""
            val authDeleteSql = """DELETE FROM "Auth" WHERE user_id = ?"""
            val userDeleteSql = """DELETE FROM "User" WHERE email = ?"""
            val refreshTokenRowsDeleted = jdbcTemplate.update(refreshTokenDeleteSql, user_id)

            if (authDetails == "normal") {
                if(refreshTokenRowsDeleted > 0) {
                    val authRowsDeleted = jdbcTemplate.update(authDeleteSql, user_id)
                    if(authRowsDeleted > 0) {
                        val userRowsDeleted = jdbcTemplate.update(userDeleteSql, email)
                        if (userRowsDeleted > 0) {
                            "Account deleted successfully"
                        } else {
                            throw Exception("User not found")
                        }
                    } else {
                        throw Exception("User not found")
                    }
                } else {
                    throw Exception("User not found")
                }
            } else {
                val authRowsDeleted = jdbcTemplate.update(authDeleteSql, user_id)
                if(authRowsDeleted > 0) {
                    val userRowsDeleted = jdbcTemplate.update(userDeleteSql, email)
                    if (userRowsDeleted > 0) {
                        "Account deleted successfully"
                    } else {
                        throw Exception("User not found")
                    }
                } else {
                    throw Exception("User not found")
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("User not found!")
        }
    }

    @Transactional
    fun updateAccount(user: User): User {
        return try {
            val sql = """UPDATE "User" SET name = ?, email = ?, phone = ?, state = ? WHERE id = ?"""
            val updatedRows = jdbcTemplate.update(sql, user.name, user.email, user.phone, user.state, user.id)

            if(updatedRows > 0) {
                authRepository.findUserById(user.id!!)
            } else {
                throw Exception("User not found")
            }
        } catch (e: Exception) {
            throw Exception("Failed to update the user information")
        }
    }
}