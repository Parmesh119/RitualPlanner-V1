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

data class ForgotPasswordRequest (
    val email: String,
)

data class VerifyOTP (
    val otp: String,
    val email: String
//    val expirationTime: Instant = Instant.now().plusMillis(300000)
)

data class OtpData(
    val otpCode: String,
    val expirationTime: Instant,
    val email: String
)

data class ResetPasswordRequest (
    val email: String? = null,
    val password: String,
    val confirmPassword: String
)