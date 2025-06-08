package ritualplanner.repository

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class TaskRepository(
    private val jdbcTemplate: JdbcTemplate
) {
}