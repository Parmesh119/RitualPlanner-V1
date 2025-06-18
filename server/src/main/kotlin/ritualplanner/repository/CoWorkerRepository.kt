package ritualplanner.repository

import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import ritualplanner.model.CoWorker
import ritualplanner.model.ListCoWorker
import java.sql.Timestamp
import java.time.Instant

@Repository
class CoWorkerRepository(
    private val jdbcTemplate: JdbcTemplate
) {
    private val rowMapper = RowMapper { rs, _ ->
        CoWorker(
            id = rs.getString("id"),
            name = rs.getString("name"),
            email = rs.getString("email"),
            phone = rs.getString("phone"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond,
        )
    }

    @Transactional
    fun createCoWorker(coWorker: CoWorker, userId: String?): CoWorker {
        return try {
            val sql = """INSERT INTO "CoWorker" (id, name, email, phone, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"""

            val insertResult = jdbcTemplate.update(sql, coWorker.id, coWorker.name, coWorker.email, coWorker.phone, userId,  Timestamp.from(Instant.ofEpochMilli(coWorker.createdAt)),  Timestamp.from(Instant.ofEpochMilli(coWorker.updatedAt)))

            if(insertResult != 0) coWorker
            else throw Exception("Failed to insert coWorker into database")
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to create or link co-worker", e)
        }
    }

    @Transactional
    fun updateCoWorker(coWorker: CoWorker): CoWorker {
        return try {
            val updateSql = """
            UPDATE "CoWorker" 
            SET name = ?, email = ?, phone = ?, updated_at = ?
            WHERE id = ?
        """

            val updatedResult = jdbcTemplate.update(
                updateSql,
                coWorker.name,
                coWorker.email,
                coWorker.phone,
                Timestamp.from(Instant.ofEpochMilli(coWorker.updatedAt)),
                coWorker.id
            )

            if(updatedResult != 0) coWorker
            else throw Exception("Failed to update or link co-worker into database")
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to update co-worker: ${e.message}")
        }
    }

    fun listCoWorker(userId: String, listCoWorker: ListCoWorker): List<CoWorker> {
        return try {
            val sqlBuilder = StringBuilder("""SELECT * FROM "CoWorker" WHERE user_id = ? AND 1=1""")
            val params = mutableListOf<Any>(userId)

            listCoWorker.search?.takeIf { it.isNotBlank() }?.let {
                sqlBuilder.append(" AND (name ILIKE ? )")
                params.add("%$it%")
            }

            val page = (listCoWorker.page ?: 1).coerceAtLeast(1)
            val size = (listCoWorker.size ?: 10).coerceIn(1, 100)

            sqlBuilder.append(" ORDER BY created_at ASC")
            sqlBuilder.append(" LIMIT ? OFFSET ?")
            params.add(size)
            params.add((page - 1) * size)

            jdbcTemplate.query(sqlBuilder.toString(), rowMapper, *params.toTypedArray())
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to list co-worker: ${e.message}")
        }
    }

    fun getCoWorkerById(id: String, userId: String): CoWorker {
        return try {
            val sql = """SELECT * FROM "CoWorker" WHERE id = ? AND user_id = ?"""

            jdbcTemplate.queryForObject(sql, arrayOf(id, userId)) { rs, _ ->
                CoWorker(
                    id = rs.getString("id"),
                    name = rs.getString("name"),
                    email = rs.getString("email"),
                    phone = rs.getString("phone"),
                    createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
                    updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
                )
            } ?: throw Exception("Co-Worker not found")
        } catch (e: Exception) {
            throw Exception("Failed to get Co-Worker By Id: ${e.message}")
        }
    }

    @Transactional
    fun deleteCoWorker(userId: String, id: String): Boolean {
        return try {
            val sql = """DELETE FROM "CoWorker" WHERE id = ? AND user_id = ?"""
            val rowsAffected = jdbcTemplate.update(sql, id, userId)
            rowsAffected > 0
        } catch (e: Exception) {
            throw Exception("Failed to delete Co-Worker: ${e.message}")
        }
    }
}