package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class User (
    val id: String? = UUID.randomUUID().toString(),
    val name: String,
    val email: String,
    val phone: String,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class UserAuth (
    val id: String? = UUID.randomUUID().toString(),
    val userId: String,
    val username: String,
    val hashPassword: String,
    val signin: String,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)