package ritualplanner.repository

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.Timestamp
import java.time.Instant
import java.time.LocalDateTime

@Repository
class RefreshTokenRepository(
    private val jdbcTemplate: JdbcTemplate
) {
    fun saveRefreshToken(id: String, userId: String, token: String, expiresAt: Long, updatedAt: Long) {
        try {
            val sql = """INSERT INTO "RefreshToken" (id, user_id, token, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"""
            jdbcTemplate.update(sql, id, userId, token, Timestamp.from(Instant.ofEpochMilli(expiresAt)),
                Timestamp.from(Instant.ofEpochMilli(updatedAt)))
        } catch (e: Exception) {
            throw Exception("Error saving refresh token", e)
        }
    }
}