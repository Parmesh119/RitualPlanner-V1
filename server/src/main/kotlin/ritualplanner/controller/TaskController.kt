package ritualplanner.controller

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.service.TaskService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/tasks")
class TaskController(
    private val taskService: TaskService
) {
}