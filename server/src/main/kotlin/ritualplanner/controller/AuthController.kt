package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.model.LoginRequest
import ritualplanner.model.LoginResponse
import ritualplanner.model.RefreshTokenRequest
import ritualplanner.model.RegisterRequest
import ritualplanner.model.RegisterResponse
import ritualplanner.model.User
import ritualplanner.service.AuthService
import ritualplanner.service.UserService

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
}