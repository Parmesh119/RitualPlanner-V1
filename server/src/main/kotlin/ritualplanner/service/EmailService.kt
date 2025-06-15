package ritualplanner.service

import jakarta.mail.MessagingException
import org.springframework.core.io.ClassPathResource
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets

@Service
class EmailService (
    private val mailSender: JavaMailSender,
) {

    private fun loadHtmlTemplate(filePath: String): String {
        return ClassPathResource(filePath).inputStream.readBytes().toString(StandardCharsets.UTF_8)
    }

    @Async
    fun sendRegistrationEmail(to: String, subject: String, username: String, password: String, name: String) {
        try {
            // Create MimeMessage
            val mimeMessage = mailSender.createMimeMessage()
            val helper = MimeMessageHelper(mimeMessage, true, StandardCharsets.UTF_8.name())

            // Set email properties
            helper.setFrom("parmeshb90@gmail.com")
            helper.setTo(to)
            helper.setSubject(subject)

            // Load HTML template from resources/Registration.html
            val emailTemplate = loadHtmlTemplate("templates/Registration.html")

            // Replace placeholders with actual data
            val emailContent = emailTemplate
                .replace("{{name}}", name)
                .replace("{{username}}", username)
                .replace("{{password}}", password)
                .replace("{{app_url}}", "http://localhost:3000/auth/login")

            // Set HTML content
            helper.setText(emailContent, true) // true indicates HTML content

            // Send email
            mailSender.send(mimeMessage)

        } catch (e: MessagingException) {
            throw RuntimeException("Email sending failed", e)
        } catch (e: Exception) {
            throw RuntimeException("Email sending failed", e)
        }
    }

    @Async
    fun sendOtp(to: String, subject: String, name: String, otpCode: String) {
        try {
            val mimeMessage = mailSender.createMimeMessage()
            val helper = MimeMessageHelper(mimeMessage, true, StandardCharsets.UTF_8.name())

            // Set email properties
            helper.setFrom("parmeshb90@gmail.com")
            helper.setTo(to)
            helper.setSubject(subject)

            // Load HTML template from resources/Registration.html
            val emailTemplate = loadHtmlTemplate("templates/ForgotPassword.html")

            // Replace placeholders with actual data
            val emailContent = emailTemplate
                .replace("{{name}}", name)
                .replace("{{otp_code}}", otpCode)

            // Set HTML content
            helper.setText(emailContent, true) // true indicates HTML content

            // Send email
            mailSender.send(mimeMessage)
        } catch (e: Exception) {
            throw RuntimeException("Email sending failed", e)
        }
    }

    @Async
    fun sendOTPForChangePassword(to: String, subject: String, name: String, otpCode: String) {
        try {
            val mimeMessage = mailSender.createMimeMessage()
            val helper = MimeMessageHelper(mimeMessage, true, StandardCharsets.UTF_8.name())

            // Set email properties
            helper.setFrom("parmeshb90@gmail.com")
            helper.setTo(to)
            helper.setSubject(subject)

            // Load HTML template from resources/Registration.html
            val emailTemplate = loadHtmlTemplate("templates/ChangePassword.html")

            // Replace placeholders with actual data
            val emailContent = emailTemplate
                .replace("{{name}}", name)
                .replace("{{otp_code}}", otpCode)

            // Set HTML content
            helper.setText(emailContent, true) // true indicates HTML content

            // Send email
            mailSender.send(mimeMessage)
        } catch (e: Exception) {
            throw RuntimeException("Email sending failed", e)
        }
    }
}