package ritualplanner.repository

import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import ritualplanner.model.DeleteNote
import ritualplanner.model.ListNote
import ritualplanner.model.Note
import java.sql.Time
import java.sql.Timestamp
import java.time.Instant

@Repository
class NoteRepository(private val jdbcTemplate: JdbcTemplate) {

    private val rowMapper = RowMapper { rs, _ ->
        Note (
            id = rs.getString("id"),
            title = rs.getString("title"),
            description = rs.getString("description"),
            reminder_date = rs.getTimestamp("reminder_date").toInstant().epochSecond,
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
        )
    }

    fun createNote(note: Note, user_id: String?): Note {
        return try {
            val sql = """
            INSERT INTO "Note" (id, user_id, title, description, reminder_date, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
            jdbcTemplate.update(
                sql,
                note.id,
                user_id,
                note.title,
                note.description,
                note.reminder_date?.let { Timestamp.from(Instant.ofEpochMilli(it)) },
                Timestamp.from(Instant.ofEpochMilli(note.createdAt)),
                Timestamp.from(Instant.ofEpochMilli(note.updatedAt))
            )
            note
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to create note: ${e.message}")
        }
    }

    fun updateNote(note: Note): Note {
        return try {
            val sql = """
            UPDATE "Note" 
            SET title = ?, description = ?, reminder_date = ?, updated_at = ?
            WHERE id = ?
        """

            val rowsAffected = jdbcTemplate.update(
                sql,
                note.title,
                note.description,
                // Convert Long to Timestamp for reminder_date
                note.reminder_date?.let { Timestamp.from(Instant.ofEpochMilli(it)) },
                Timestamp.from(Instant.ofEpochMilli(note.updatedAt)),
                note.id
            )

            if (rowsAffected == 0) {
                throw Exception("Note with ID ${note.id} not found")
            }

            note
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to update note: ${e.message}")
        }
    }

    fun deleteNote(deleteNote: DeleteNote, user_id: String?): String {
        return try {
            val sql = """DELETE FROM "Note" WHERE id = ? AND user_id = ?"""
            val rowAffected = jdbcTemplate.update(
                sql,
                deleteNote.id,
                user_id
            )

            if(rowAffected > 0) {
                "Note deleted successfully"
            } else {
                "Failed to delete note"
            }
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to delete note: ${e.message}")
        }
    }

    fun getNoteById(id: String, user_id: String?): Note? {
        return try {
            val sql = """SELECT * FROM "Note" WHERE id = ? AND user_id = ?"""
            jdbcTemplate.queryForObject(sql, rowMapper, id, user_id)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    fun listNotes(listNote: ListNote, user_id: String?): List<Note> {
        return try {
            val sqlBuilder = StringBuilder("""SELECT * FROM "Note" WHERE user_id = ? AND 1=1""")
            val params = mutableListOf<Any>(user_id!!)

            listNote.search?.takeIf { it.isNotBlank() }?.let {
                sqlBuilder.append(" AND (title ILIKE ? OR description ILIKE ?)")
                params.add("%$it%")
                params.add("%$it%")
            }

            listNote.startDate?.let {
                sqlBuilder.append(" AND reminder_date >= to_timestamp(?)")
                params.add(it / 1000)
            }

            listNote.endDate?.let {
                sqlBuilder.append(" AND reminder_date <= to_timestamp(?)")
                params.add(it / 1000)
            }

            val page = (listNote.page ?: 1).coerceAtLeast(1)
            val size = (listNote.size ?: 10).coerceIn(1, 100)

            sqlBuilder.append(" ORDER BY created_at ASC")
            sqlBuilder.append(" LIMIT ? OFFSET ?")
            params.add(size)
            params.add((page - 1) * size)

            jdbcTemplate.query(sqlBuilder.toString(), rowMapper, *params.toTypedArray())
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to list notes: ${e.message}")
        }
    }

}