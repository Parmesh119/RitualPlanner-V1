package ritualplanner.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.web.filter.OncePerRequestFilter

@Configuration
class JwtAuthenticationFilter(
    private val jwtUtil: JwtUtil,
    private val userDetailsService: UserDetailsService,
    private val customUserDetails: CustomUserDetails
): OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            val token = getTokenFromRequest(request)

            if (token != null && SecurityContextHolder.getContext().authentication == null) {
                // Extract username/email from token (works for both Firebase and internal tokens)
                val username = jwtUtil.extractSubject(token)

                if (username?.isNotEmpty()!!) {
                    val userDetails = userDetailsService.loadUserByUsername(username)

                    // Validate token (handles both Firebase and internal tokens)
                    if (jwtUtil.isTokenValid(token, userDetails)) {
                        // Extract roles from token
                        val roles = jwtUtil.extractRoles(token)
                        val authorities = roles.map { SimpleGrantedAuthority("ROLE_$it") }

                        val authToken = UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            authorities
                        )

                        // Set authentication details
                        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                        SecurityContextHolder.getContext().authentication = authToken
                    }
                }
            }
        } catch (e: Exception) {
            val token = getTokenFromRequest(request)

            if (token != null && SecurityContextHolder.getContext().authentication == null) {
                // Extract username/email from token (works for both Firebase and internal tokens)
                val username = jwtUtil.extractSubject(token)

                if (username?.isNotEmpty()!!) {
                    val userDetails = customUserDetails.loadUserByUsername(username)

                    // Validate token (handles both Firebase and internal tokens)
                    if (jwtUtil.isTokenValid(token, userDetails)) {
                        // Extract roles from token
                        val roles = jwtUtil.extractRoles(token)
                        val authorities = roles.map { SimpleGrantedAuthority("ROLE_$it") }

                        val authToken = UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            authorities
                        )

                        // Set authentication details
                        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                        SecurityContextHolder.getContext().authentication = authToken
                    } else {
                        throw Exception("Error while validating token")
                    }
                }
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun getTokenFromRequest(request: HttpServletRequest): String? {
        val authHeader = request.getHeader("Authorization")
        return if (authHeader?.startsWith("Bearer ") == true) {
            authHeader.substring(7) // Remove "Bearer " prefix
        } else null
    }

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val path = request.requestURI
        // Skip JWT filter for public endpoints
        return path.startsWith("/api/v2/auth/") &&
                (path.contains("/login", true) || path.contains("/register", true))
    }
}