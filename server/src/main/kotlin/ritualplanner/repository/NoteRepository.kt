package ritualplanner.repository

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class NoteRepository(private val jdbcTemplate: JdbcTemplate) {
}