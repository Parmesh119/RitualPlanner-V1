package ritualplanner.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import ritualplanner.config.JwtUtil
import ritualplanner.model.ListTask
import ritualplanner.model.RequestTask
import ritualplanner.model.Task
import ritualplanner.repository.AuthRepository
import ritualplanner.repository.TaskRepository

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    private val jwtUtil: JwtUtil,
    private val authRepository: AuthRepository
) {
    fun createTask(requestTask: RequestTask, authorization: String): RequestTask {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val userId = authRepository.getUserDetailsByEmail(email).id

        return taskRepository.createTask(requestTask, userId!!)
    }

    fun updateTask(requestTask: RequestTask): RequestTask {
        return taskRepository.updateTask(requestTask)
    }

    fun getTask(id: String): RequestTask {
        return taskRepository.getTask(id)
    }

    fun listTask(listTask: ListTask, authorization: String): List<Task> {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val userId = authRepository.getUserDetailsByEmail(email).id

        return taskRepository.listTask(listTask, userId!!)
    }

//    fun deleteTask(id: String): Boolean {
//        return taskRepository.deleteTask(id)
//    }
}