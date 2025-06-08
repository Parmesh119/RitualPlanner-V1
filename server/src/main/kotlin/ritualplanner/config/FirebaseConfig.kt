package ritualplanner.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import javax.annotation.PostConstruct

@Configuration
class FirebaseConfig {

    @Value("\${firebase.config.path:}")
    private val firebaseConfigPath: String? = null

    @PostConstruct
    fun initialize() {
        try {
            val options = if (!firebaseConfigPath.isNullOrEmpty()) {
                // If you have a service account key file
                val serviceAccount = ClassPathResource(firebaseConfigPath).inputStream
                FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build()
            } else {
                // Use default credentials (for production deployment)
                FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .build()
            }

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options)
                println("Firebase Admin SDK initialized successfully")
            }
        } catch (e: Exception) {
            println("Failed to initialize Firebase Admin SDK: ${e.message}")
            // You might want to handle this more gracefully
        }
    }
}