package ritualplanner.model

import java.time.Duration
import java.time.Instant
import java.util.UUID

data class Note (
    val id: String? = UUID.randomUUID().toString(),
    val title: String,
    val body: String,
    val reminderDate: Instant? = Instant.now().plus(Duration.ofDays(7)),
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)