package ritualplanner.service

import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ritualplanner.config.JwtUtil
import ritualplanner.model.LoginRequest
import ritualplanner.model.LoginResponse
import ritualplanner.model.OtpData
import ritualplanner.model.RegisterRequest
import ritualplanner.model.RegisterResponse
import ritualplanner.model.User
import ritualplanner.repository.AuthRepository
import ritualplanner.repository.RefreshTokenRepository
import ritualplanner.util.UtilFunctions
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.UUID

@Service
class AuthService(
    private val authRepository: AuthRepository,
    private val utilFunctions: UtilFunctions,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val jwtUtil: JwtUtil,
    private val refreshTokenRepository: RefreshTokenRepository,
    private val emailService: EmailService
) {

    private val otpStorage = mutableMapOf<String, OtpData>()

    fun register(registerRequest: RegisterRequest): RegisterResponse {

        // generating random username
        val id = UUID.randomUUID().toString()
        val username = utilFunctions.generateRandomUsername(registerRequest.name.split(" ")[0])
        val hashPassword = passwordEncoder.encode(registerRequest.password)
        val createdAt = System.currentTimeMillis()
        val updatedAt = System.currentTimeMillis()

        val registerResponse = authRepository.register(registerRequest, username, hashPassword, id, createdAt, updatedAt)

        if(registerResponse) {
            emailService.sendRegistrationEmail(registerRequest.email, "Welcome to RitualPlanner: Start Organizing Rituals Seamlessly", username, registerRequest.password, registerRequest.name)

            return RegisterResponse(
                username = username,
                password = registerRequest.password
            )
        } else {
            throw Exception("Failed to register user!!")
        }
    }

    fun login(request: LoginRequest): LoginResponse {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.username, request.password)
        )

        val authUserDetails = authRepository.findUserAuthByUsername(request.username)
        val user = authRepository.findUserById(authUserDetails?.userId ?: throw RuntimeException("User not found!"))

        val accessToken = jwtUtil.generateAccessToken(user, authRepository.loadUserDetails(request.username))
        val refreshToken = jwtUtil.generateRefreshToken(request.username)

        val refreshTokenId = UUID.randomUUID().toString()
        val expiresAt = LocalDateTime.now().plusDays(7).atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
        val updatedAt = System.currentTimeMillis()

        refreshTokenRepository.saveRefreshToken(refreshTokenId, user.id!!, refreshToken, expiresAt, updatedAt)

        return LoginResponse(
            accessToken,
            refreshToken
        )
    }

    fun refreshToken(refreshToken: String): LoginResponse {
        return authRepository.refreshToken(refreshToken)
    }

    fun getUserDetails(authorization: String): User {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)

        return authRepository.getUserDetailsByEmail(email)
    }

    fun checkAuthTypeByEmail(authorization: String): String {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        return authRepository.checkAuthTypeByEmail(email)
    }

    fun forgotPassword(email: String, subject: String): String {
        return try {
            val name = authRepository.getUserDetailsByEmail(email).name
            val otpCode = (100000..999999).random().toString()
            val expirationTime = Instant.now().plusMillis(300000) // 5 minutes from now

            // Store OTP with expiration
            otpStorage[email] = OtpData(otpCode, expirationTime, email)

            emailService.sendOtp(email, subject, name, otpCode)
            "OTP has been sent successfully"
        } catch (e: Exception) {
            throw Exception("Failed to send OTP", e)
        }
    }

    fun verifyOtp(otp: String, email: String): Boolean {
        return try {
            if (otp.length != 6) {
                throw Exception("Invalid OTP format")
            }

            val storedOtpData = otpStorage[email]
                ?: throw Exception("No OTP found for this email")

            // Check if OTP has expired
            if (Instant.now().isAfter(storedOtpData.expirationTime)) {
                otpStorage.remove(email) // Clean up expired OTP
                throw Exception("OTP has expired")
            }

            // Verify OTP
            if (storedOtpData.otpCode == otp) {
                otpStorage.remove(email) // Clean up used OTP
                true
            } else {
                false
            }
        } catch (e: Exception) {
            throw Exception("Failed to verify OTP: ${e.message}", e)
        }
    }

    fun resetPassword(email: String, password: String, confirmPassword: String): Boolean {
        if(password != confirmPassword) {
            throw Exception("Passwords do not match")
        }
        val hashPassword = passwordEncoder.encode(password)
        val updatedAt = System.currentTimeMillis()
        return authRepository.resetPassword(email, hashPassword, updatedAt)
    }
}