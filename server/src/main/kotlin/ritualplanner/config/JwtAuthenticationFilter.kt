package ritualplanner.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.web.filter.OncePerRequestFilter

@Configuration
class JwtAuthenticationFilter(
    private val jwtUtil: JwtUtil,
    private val userDetailsService: UserDetailsService
): OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = getTokenFromRequest(request)

        if (token != null) {
            val username = jwtUtil.extractSubject(token)
            val roles = jwtUtil.extractRoles(token) // Extract roles from token
            val userDetails = userDetailsService.loadUserByUsername(username)

            if (jwtUtil.isTokenValid(token, userDetails)) {
                val authorities = roles.map { SimpleGrantedAuthority("ROLE_$it") } // Convert roles to Spring format

                val authentication = UsernamePasswordAuthenticationToken(
                    userDetails, null, authorities
                )
                SecurityContextHolder.getContext().authentication = authentication
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun getTokenFromRequest(request: HttpServletRequest): String? {
        val authHeader = request.getHeader("Authorization")
        return if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authHeader.substring(7) // Remove "Bearer " prefix
        } else null
    }

}