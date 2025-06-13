package ritualplanner.config

import org.springframework.context.annotation.Configuration
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException
import ritualplanner.model.User
import ritualplanner.repository.AuthRepository
import ritualplanner.repository.UserRepository

@Configuration
class CustomUserDetails(
    private val authRepository: AuthRepository
) {
    fun loadUserByUsername(email: String): UserDetails {
        val user = authRepository.getUserDetailsByEmail(email)

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.email) // Use email as username for consistency
            .password("") // Firebase users might not have password
            .authorities(getAuthorities(user))
            .accountExpired(false)
            .accountLocked(false)
            .credentialsExpired(false)
            .disabled(false)
            .build()
    }

    private fun getAuthorities(user: User): Collection<GrantedAuthority> {
        // Add user roles/authorities here
        return listOf(SimpleGrantedAuthority("ROLE_USER"))
    }
}