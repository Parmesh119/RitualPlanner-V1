package ritualplanner.service

import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RequestHeader
import ritualplanner.config.JwtUtil
import ritualplanner.model.CoWorker
import ritualplanner.model.OtpData
import ritualplanner.model.User
import ritualplanner.repository.AuthRepository
import ritualplanner.repository.UserRepository
import java.time.Instant
import kotlin.collections.set

@Service
class UserService(
    private val userRepository: UserRepository,
    private val jwtUtil: JwtUtil,
    private val authRepository: AuthRepository,
    private val emailService: EmailService
) {
    private val otpStorage = mutableMapOf<String, OtpData>()

    fun getAccountDetails(@RequestHeader("Authorization") authorization: String): User {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)

        return userRepository.getAccountDetails(email)
    }

    fun deleteAccount(authorization: String): String {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val userId = authRepository.getUserDetailsByEmail(email).id
        val authDetails = authRepository.checkAuthTypeByEmail(email)
        return userRepository.deleteAccount(email, userId!!, authDetails)
    }

    fun changePassword(email: String, subject: String): String {
        return try {
            val name = authRepository.getUserDetailsByEmail(email).name
            val otpCode = (100000..999999).random().toString()
            val expirationTime = Instant.now().plusMillis(300000) // 5 minutes from now

            // Store OTP with expiration
            otpStorage[email] = OtpData(otpCode, expirationTime, email)

            emailService.sendOTPForChangePassword(email, subject, name, otpCode)
            "OTP has been sent successfully"
        } catch (e: Exception) {
            throw Exception("Failed to send OTP", e)
        }
    }

    fun verifyOtp(otp: String, email: String, authorization: String): Boolean {
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

    fun updateAccount(authorization: String, user: User): User {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val userId = authRepository.getUserDetailsByEmail(email).id
        if (user.id != userId) {
            throw Exception("User does not exist")
        }
        return userRepository.updateAccount(user)
    }

    fun sendInvite(coWorker: CoWorker, authorization: String): Boolean {
        return try {
            val token = authorization.substringAfter("Bearer")
            val user_id = jwtUtil.getUserIdFromToken(token)
            val user = authRepository.findUserById(user_id)

            if(coWorker.email === null) {
                throw Exception("Email is required to send an invite")
            } else {
                emailService.sendInviteMail(coWorker.email, "You're invited to join RitualPlanner", coWorker.name, user.name, user.phone, user.email)
                true
            }
        } catch (e: Exception) {
            throw Exception("Failed to send invite", e)
        }
    }
}