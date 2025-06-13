package ritualplanner.config

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseToken
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
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
            // Remove Bearer prefix if present
            val cleanToken = token.removePrefix("Bearer ").trim()
            val firebaseToken = FirebaseAuth.getInstance().verifyIdToken(cleanToken)
            firebaseToken
        } catch (e: Exception) {
            println("Firebase token verification failed: ${e.message}")
            e.printStackTrace()
            null
        }
    }

    // Check if token is a Firebase token (check issuer only)
    fun isFirebaseToken(token: String): Boolean {
        return try {
            // Remove Bearer prefix if present
            val cleanToken = token.removePrefix("Bearer ").trim()

            // Firebase tokens typically have 3 parts and start with "eyJ"
            val parts = cleanToken.split(".")
            if (parts.size != 3) return false

            // Decode payload to check issuer
            val payload = String(Base64.getUrlDecoder().decode(parts[1]))

            // Check for Firebase-specific issuer
            val isFirebaseIssuer = payload.contains("securetoken.google.com") ||
                    payload.contains("\"iss\":\"https://securetoken.google.com/")


            isFirebaseIssuer
        } catch (e: Exception) {
            e.printStackTrace()
            println("Error detecting Firebase token: ${e.message}")
            false
        }
    }

    // Extract subject from either Firebase or internal token
    fun extractSubject(token: String): String? {
        return try {
            if (isFirebaseToken(token)) {
                // For Firebase tokens, get email from Firebase verification
                val firebaseToken = verifyFirebaseToken(token)
                firebaseToken?.email
            } else {
                // For internal tokens, extract from claims
                val claims = extractClaims(token)
                val subject = claims.subject
                if (subject.isNullOrEmpty()) {
                    getEmailFromToken(token)
                } else {
                    subject
                }
            }
        } catch (e: Exception) {
            println("Error extracting subject: ${e.message}")
            null // Return null if there's any error getting subject
        }
    }

    fun extractUsername(token: String): String? {
        return try {
            val claims = extractClaims(token)
            val subject = claims.subject
            subject
        } catch (e: Exception) {
            println("Error extracting subject: ${e.message}")
            null
        }
    }

    // Check token validity
    fun isTokenValid(token: String, userDetails: UserDetails): Boolean {
        return if (isFirebaseToken(token)) {
            val firebaseToken = verifyFirebaseToken(token)
            firebaseToken?.email == userDetails.username && !isFirebaseTokenExpired(firebaseToken)
        } else {
            try {
                extractSubject(token) == userDetails.username && !isTokenExpired(token)
            } catch (e: Exception) {
                println("Error validating token: ${e.message}")
                false
            }
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
        return try {
            // Only check expiration for internal tokens
            if (isFirebaseToken(token)) {
                return false // Firebase token expiration is handled separately
            }
            extractClaims(token).expiration.before(Date())
        } catch (e: Exception) {
            println("Error checking token expiration: ${e.message}")
            true // Consider expired if we can't parse it
        }
    }

    // Modified to only handle internal tokens
    private fun extractClaims(token: String): Claims {
        // This should only be called for internal tokens, not Firebase tokens
        if (isFirebaseToken(token)) {
            throw IllegalArgumentException("Cannot extract claims from Firebase token using internal key")
        }
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
            try {
                val claims = extractClaims(token)
                claims["roles"] as? List<String> ?: emptyList()
            } catch (e: Exception) {
                println("Error extracting roles: ${e.message}")
                emptyList()
            }
        }
    }

    // Extract user ID from token
    fun getUserIdFromToken(token: String): String {
        return if (isFirebaseToken(token)) {
            val firebaseToken = verifyFirebaseToken(token)
            firebaseToken?.uid ?: throw Exception("User ID not found in Firebase token")
        } else {
            try {
                val claims = extractClaims(token)
                claims.get("userId", String::class.java) ?: throw Exception("User ID not found in token")
            } catch (e: Exception) {
                throw Exception("Invalid token: ${e.message}")
            }
        }
    }

    // Extract email from token
    fun getEmailFromToken(token: String): String {
        return if (isFirebaseToken(token)) {
            val firebaseToken = verifyFirebaseToken(token)
            firebaseToken?.email ?: throw Exception("Email not found in Firebase token")
        } else {
            try {
                val claims = extractClaims(token)
                claims.get("email", String::class.java) ?: throw Exception("Email not found in token")
            } catch (e: Exception) {
                e.printStackTrace()
                throw Exception("Invalid token or email not found: ${e.message}")
            }
        }
    }
}