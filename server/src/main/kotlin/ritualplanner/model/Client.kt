package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class Client (
    val id: String? = UUID.randomUUID().toString(),
    val name: String,
    val description: String? = null,
    val email: String? = null,
    val phone: String,
    val city: String,
    val state: String,
    val zipcode: String? = null,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli(),
)

data class ListClient (
    val search: String? = null,
    val page: Int? = 1,
    val size: Int? = 10
)