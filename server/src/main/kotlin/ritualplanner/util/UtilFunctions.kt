package ritualplanner.util

import org.springframework.stereotype.Component
import kotlin.random.Random

@Component
class UtilFunctions {

    fun generateRandomUsername(name: String): String {
        val randomNumber = generateRandomNumberOfThreeLetters()
        return "RP_${name}_$randomNumber"
    }

    fun generateRandomNumberOfThreeLetters(): Int {
        // Generate a random 3-digit number (100-999)
        return Random.nextInt(100, 1000)
    }
}