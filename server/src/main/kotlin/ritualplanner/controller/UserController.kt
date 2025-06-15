package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.config.JwtUtil
import ritualplanner.model.ResetPasswordRequest
import ritualplanner.model.User
import ritualplanner.model.VerifyOTP
import ritualplanner.service.AuthService
import ritualplanner.service.UserService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/user")
class UserController (
    private val userService: UserService,
    private val authService: AuthService,
    private val jwtUtil: JwtUtil,
) {

    @PostMapping("/account")
    fun getAccountDetails(@RequestHeader("Authorization") authorization: String): ResponseEntity<User> {
        return ResponseEntity.ok(userService.getAccountDetails(authorization))
    }

    @PostMapping("/send-otp")
    fun updatePassword(@RequestHeader("Authorization") authorization: String): ResponseEntity<String> {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        return ResponseEntity.ok(userService.changePassword(email, "Security Code for Password Change - RitualPlanner"))
    }

    @PostMapping("/verify-otp")
    fun verifyOtp(@RequestBody verifyOTP: VerifyOTP, @RequestHeader("Authorization") authorization: String): ResponseEntity<Boolean> {
        return ResponseEntity.ok(userService.verifyOtp(verifyOTP.otp, verifyOTP.email, authorization))
    }

    @PutMapping("/update-password")
    fun updatePassword(@RequestBody resetPasswordRequest: ResetPasswordRequest, @RequestHeader("Authorization") authorization: String): ResponseEntity<Boolean> {
        if(resetPasswordRequest.email == null) {
            val token = authorization.substringAfter("Bearer")
            val email = jwtUtil.getEmailFromToken(token)
            return ResponseEntity.ok(authService.resetPassword(email, resetPasswordRequest.password, resetPasswordRequest.confirmPassword))
        } else {
            return ResponseEntity.ok(authService.resetPassword(resetPasswordRequest.email, resetPasswordRequest.password, resetPasswordRequest.confirmPassword))
        }
    }

    @DeleteMapping("/delete-account")
    fun deleteAccount(@RequestHeader("Authorization") authorization: String): ResponseEntity<String> {
        return ResponseEntity.ok(userService.deleteAccount(authorization))
    }

    @PutMapping("/account/update")
    fun updateAccount(@RequestHeader("Authorization") authorization: String, @RequestBody user: User): ResponseEntity<User> {
        return ResponseEntity.ok(userService.updateAccount(authorization, user))
    }
}