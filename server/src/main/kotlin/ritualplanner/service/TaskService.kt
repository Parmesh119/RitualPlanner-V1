package ritualplanner.service

import org.springframework.stereotype.Service
import ritualplanner.repository.TaskRepository

@Service
class TaskService(private val taskRepository: TaskRepository) {
}