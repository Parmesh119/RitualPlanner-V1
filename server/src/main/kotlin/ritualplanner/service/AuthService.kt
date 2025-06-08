package ritualplanner.service

import org.springframework.mail.javamail.JavaMailSender
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ritualplanner.config.JwtUtil
import ritualplanner.model.LoginRequest
import ritualplanner.model.LoginResponse
import ritualplanner.model.RegisterRequest
import ritualplanner.model.RegisterResponse
import ritualplanner.model.User
import ritualplanner.model.VerifyOTP
import ritualplanner.repository.AuthRepository
import ritualplanner.repository.RefreshTokenRepository
import ritualplanner.util.UtilFunctions
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
    private val javaMailSender: JavaMailSender,
    private val emailService: EmailService
) {
    var otpCode: String = ""
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
        val token = authorization.substring(7)

        val username = jwtUtil.extractSubject(token)

        if(username == null) {
            val email = jwtUtil.getEmailFromToken(token)
            return authRepository.getUserDetailsByEmail(email)
        }

        return authRepository.getUserDetails(username)
    }

    fun checkAuthTypeByEmail(authorization: String): String {
        val token = authorization.substring(7)
        val email = jwtUtil.getEmailFromToken(token)
        return authRepository.checkAuthTypeByEmail(email)
    }

    fun forgotPassword(email: String): String {
        try {
            val name = authRepository.getUserDetailsByEmail(email).name
            otpCode = (100000..999999).random().toString()

            emailService.sendOtp(email, "Security Code for Password Reset - RitualPlanner", name, otpCode)
            return "OTP has been sent successfully"
        } catch (e: Exception) {
            throw Exception("Failed to send OTP", e)
        }
    }

    fun verifyOtp(otp: String): Boolean {
        return try {
            if(otp.length < 6) {
                throw Exception("Invalid OTP")
            }
            if(otpCode == otp) {
                true
            }
            false
        } catch (e: Exception) {
            throw Exception("Failed to verify OTP", e)
        }
    }
}