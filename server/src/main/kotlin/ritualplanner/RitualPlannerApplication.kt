package ritualplanner

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableAsync

@SpringBootApplication
@EnableAsync
class RitualPlannerApplication

fun main(args: Array<String>) {
    runApplication<RitualPlannerApplication>(*args)
}
