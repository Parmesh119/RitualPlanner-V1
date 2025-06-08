package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class Task (
    val id: String? = UUID.randomUUID().toString(),
    val userId: String,
    val name: String,
    val date: Long = Instant.now().toEpochMilli(),
    val self: Boolean,
    val place: String,
    val taskOwner: String,
    val money: Int,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)