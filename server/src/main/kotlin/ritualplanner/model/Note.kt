package ritualplanner.model

import java.time.Duration
import java.time.Instant
import java.util.UUID

data class Note (
    val id: String? = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val reminder_date: Long? = Instant.now().plus(Duration.ofDays(7)).toEpochMilli(),
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class ListNote (
    val search: String? = null,
    val page: Int? = 1,
    val size: Int? = 10,
    val startDate: Long? = null,
    val endDate: Long? = null,
)