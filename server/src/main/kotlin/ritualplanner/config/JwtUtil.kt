package ritualplanner.config

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseToken
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import ritualplanner.model.User
import java.security.Key
import java.util.*

@Component
class JwtUtil {
    @Value("\${jwt.secret}")
    private lateinit var jwtSecret: String


    fun generateAccessToken(user: User, userDetails: UserDetails): String {
        return Jwts.builder()
            .setSubject(userDetails.username) // Username as subject
            .setHeaderParam("alg", "HS256")
            .setHeaderParam("typ", "JWT") // Setting Token Type
            .claim("userId", user.id) // Adding userId
            .claim("email", user.email) // Adding email
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour expiry
            .signWith(getSignKey(), SignatureAlgorithm.HS256)
            .compact()
    }

    fun generateRefreshToken(username: String): String {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // 7 days expiry
            .signWith(getSignKey(), SignatureAlgorithm.HS256)
            .compact()
    }

    // Verify Firebase tokens
    fun verifyFirebaseToken(token: String): FirebaseToken? {
        return try {
            FirebaseAuth.getInstance().verifyIdToken(token)
        } catch (e: Exception) {
            println("Firebase token verification failed: ${e.message}")
            null
        }
    }

    // Check if token is a Firebase token (simple heuristic)
    fun isFirebaseToken(token: String): Boolean {
        return try {
            // Firebase tokens typically have 3 parts and start with "eyJ"
            val parts = token.split(".")
            if (parts.size != 3) return false

            // Decode header to check algorithm
            val header = String(Base64.getUrlDecoder().decode(parts[0]))
            header.contains("RS256") || header.contains("\"alg\":\"RS256\"")
        } catch (e: Exception) {
            false
        }
    }

    // Extract subject from either Firebase or internal token
    fun extractSubject(token: String): String? {
        return try {
            val subject = extractClaims(token).subject
            if (subject.isNullOrEmpty()) null else subject
        } catch (e: Exception) {
            null // Return null if there's any error getting subject
        }
    }

    // Check token validity
    fun isTokenValid(token: String, userDetails: UserDetails): Boolean {
        return if (isFirebaseToken(token)) {
            val firebaseToken = verifyFirebaseToken(token)
            firebaseToken?.email == userDetails.username && !isFirebaseTokenExpired(firebaseToken)
        } else {
            extractSubject(token) == userDetails.username && !isTokenExpired(token)
        }
    }

    private fun isFirebaseTokenExpired(firebaseToken: FirebaseToken?): Boolean {
        return firebaseToken?.let {
            // Firebase tokens use 'exp' claim for expiration (Unix timestamp in seconds)
            val expiration = it.claims["exp"] as? Long ?: return true
            expiration < System.currentTimeMillis() / 1000
        } ?: true
    }

    private fun isTokenExpired(token: String): Boolean {
        return extractClaims(token).expiration.before(Date())
    }

    private fun extractClaims(token: String): Claims {
        return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).body
    }

    private fun getSignKey(): Key {
        val keyBytes = Decoders.BASE64.decode(jwtSecret)
        return Keys.hmacShaKeyFor(keyBytes)
    }

    fun extractRoles(token: String): List<String> {
        return if (isFirebaseToken(token)) {
            val firebaseToken = verifyFirebaseToken(token)
            firebaseToken?.claims?.get("roles") as? List<String> ?: listOf("USER")
        } else {
            val claims = extractClaims(token)
            claims["roles"] as? List<String> ?: emptyList()
        }
    }

    // Extract user ID from token
    fun getUserIdFromToken(token: String): String {
        return if (isFirebaseToken(token)) {
            val firebaseToken = verifyFirebaseToken(token)
            firebaseToken?.uid ?: throw Exception("User ID not found in Firebase token")
        } else {
            try {
                val claims = Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .body

                claims.get("userId", String::class.java) ?: throw Exception("User ID not found in token")
            } catch (e: Exception) {
                throw Exception("Invalid token")
            }
        }
    }

    // Extract email from token
    fun getEmailFromToken(token: String): String {
        return if (isFirebaseToken(token)) {
            val firebaseToken = verifyFirebaseToken(token)
            firebaseToken?.email ?: throw Exception("Email not found in Firebase token")
        } else {
            val claims = extractClaims(token)
            claims.get("email", String::class.java) ?: throw Exception("Email not found in token")
        }
    }


}