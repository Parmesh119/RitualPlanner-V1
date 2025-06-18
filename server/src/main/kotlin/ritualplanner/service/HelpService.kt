package ritualplanner.service

import org.springframework.stereotype.Service
import ritualplanner.config.JwtUtil
import ritualplanner.model.Help
import ritualplanner.repository.AuthRepository

@Service
class HelpService(
    private val emailService: EmailService,
    private val jwtUtil: JwtUtil,
    private val authRepository: AuthRepository
) {
    fun sendMessage(help: Help, authorization: String): Boolean {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        if(user_id != null) {
            emailService.contactUsEmail(help.email, "New Feedback or Question Form Submission - RitualPlanner",  help.name, help.email, help.phone, help.subject, help.message)
            return true
        }
        throw Exception("User with email $email not found")
    }
}