package ritualplanner.repository

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import ritualplanner.model.RefreshToken
import java.sql.Timestamp
import java.time.Instant
import java.time.LocalDateTime

@Repository
class RefreshTokenRepository(
    private val jdbcTemplate: JdbcTemplate
) {
    fun saveRefreshToken(id: String, userId: String, token: String, expiresAt: Long, updatedAt: Long): Boolean {
        try {
            val sql = """INSERT INTO "RefreshToken" (id, user_id, token, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"""
            val record = jdbcTemplate.update(sql, id, userId, token, Timestamp.from(Instant.ofEpochMilli(expiresAt)),
                Timestamp.from(Instant.ofEpochMilli(updatedAt)))

            return record > 0
        } catch (e: Exception) {
            throw Exception("Error saving refresh token", e)
        }
    }

    fun getRefreshToken(token: String): RefreshToken? {
        try {
            return jdbcTemplate.queryForObject(
                """SELECT * FROM "RefreshToken" WHERE token = ?""",
                { rs, _ ->
                    RefreshToken(
                        id = rs.getString("id"),
                        userId = rs.getString("user_id"),
                        token = rs.getString("token"),
                        createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
                        updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
                    )
                },
                token
            )
        } catch (e: Exception) {
            throw Exception("Failed to fetch refresh token from the database")
        }
    }

    fun updateRefreshToken(token: String, Id: String) {
        try {
            jdbcTemplate.update(
                """UPDATE "RefreshToken" SET token = ? WHERE id = ?""",
                token,
                Id
            )
        } catch (e: Exception) {
            throw Exception("Failed to update refresh token")
        }
    }

    fun deleteRefreshToken(token: String) {
        try {
            jdbcTemplate.update(
                "DELETE FROM refresh_tokens WHERE token = ?",
                token
            )
        } catch (e: Exception) {
            throw Exception("Failed to delete refresh token")
        }
    }
}