package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.model.LoginRequest
import ritualplanner.model.LoginResponse
import ritualplanner.model.RegisterRequest
import ritualplanner.model.RegisterResponse
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
}