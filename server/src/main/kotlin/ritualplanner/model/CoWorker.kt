package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class CoWorker (
    val id: String? = UUID.randomUUID().toString(),
    val name: String,
    val email: String? = "abc@yopmail.com",
    val phone: String,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class ListCoWorker (
    val search: String? = null,
    val page: Int? = 1,
    val size: Int? = 10,
)