package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class RegisterRequest (
    val name: String,
    val email: String,
    val phone: String,
    val password: String,
    val signin: String,
)

data class RegisterResponse (
    val username: String,
    val password: String
)

data class LoginRequest (
    val username: String,
    val password: String
)

data class LoginResponse(
    val accessToken: String,
    val refreshToken: String
)

data class RefreshToken (
    val id: String? = UUID.randomUUID().toString(),
    val userId: String,
    val token: String,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class RefreshTokenRequest (
    val refreshToken: String
)