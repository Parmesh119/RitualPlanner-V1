package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class User (
    var id: String? = UUID.randomUUID().toString(),
    var name: String,
    var email: String,
    var phone: String,
    var state: String,
    var country: String? = "India",
    var createdAt: Long = Instant.now().toEpochMilli(),
    var updatedAt: Long = Instant.now().toEpochMilli()
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