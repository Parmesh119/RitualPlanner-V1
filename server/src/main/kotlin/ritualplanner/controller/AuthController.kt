package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.model.ForgotPasswordRequest
import ritualplanner.model.LoginRequest
import ritualplanner.model.LoginResponse
import ritualplanner.model.RefreshTokenRequest
import ritualplanner.model.RegisterRequest
import ritualplanner.model.RegisterResponse
import ritualplanner.model.ResetPasswordRequest
import ritualplanner.model.User
import ritualplanner.model.VerifyOTP
import ritualplanner.service.AuthService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/auth")
class AuthController (
    private val authService: AuthService,
) {
    @PostMapping("/register")
    fun register(@RequestBody registerRequest: RegisterRequest): ResponseEntity<RegisterResponse> {
        return ResponseEntity.ok(authService.register(registerRequest))
    }

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<LoginResponse> {
        return ResponseEntity.ok(authService.login(loginRequest))
    }

    @PostMapping("/refresh-token")
    fun refreshToken(@RequestBody refreshTokenRequest: RefreshTokenRequest): ResponseEntity<LoginResponse> {
        return ResponseEntity.ok(authService.refreshToken(refreshTokenRequest.refreshToken))
    }

    @PostMapping("/get/user")
    fun getUserDetails(@RequestHeader("Authorization") authorization: String): ResponseEntity<User> {
        // Implement logic to get user details
        return ResponseEntity.ok(authService.getUserDetails(authorization))
    }

    @PostMapping("/get/email")
    fun checkAuthTypeByEmail(@RequestHeader("Authorization") authorization: String): ResponseEntity<String> {
        return ResponseEntity.ok(authService.checkAuthTypeByEmail(authorization))
    }

    @PostMapping("/forgot-password")
    fun forgotPassword(@RequestBody forgotPasswordRequest: ForgotPasswordRequest): ResponseEntity<String> {
        return ResponseEntity.ok(authService.forgotPassword(forgotPasswordRequest.email))
    }

    @PostMapping("/verify-otp")
    fun verifyOtp(@RequestBody verifyOTP: VerifyOTP): ResponseEntity<Boolean> {
        return ResponseEntity.ok(authService.verifyOtp(verifyOTP.otp, verifyOTP.email))
    }

    @PostMapping("/reset-password")
    fun resetPassword(@RequestBody resetPasswordRequest: ResetPasswordRequest): ResponseEntity<Boolean> {
        print(resetPasswordRequest.password)
        if(resetPasswordRequest.email == null) {
            throw Exception("email is required")
        }
        return ResponseEntity.ok(authService.resetPassword(resetPasswordRequest.email, resetPasswordRequest.password, resetPasswordRequest.confirmPassword))
    }
}