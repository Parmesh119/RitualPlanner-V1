package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.model.ListTask
import ritualplanner.model.RequestTask
import ritualplanner.model.Task
import ritualplanner.service.TaskService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/tasks")
class TaskController(
    private val taskService: TaskService
) {
    @PostMapping("/create")
    fun createTask(@RequestBody requestTask: RequestTask, @RequestHeader("Authorization") authorization: String): ResponseEntity<RequestTask> {
        return ResponseEntity.ok(taskService.createTask(requestTask, authorization))
    }

    @PostMapping("/update")
    fun updateTask(@RequestBody requestTask: RequestTask): ResponseEntity<RequestTask> {
        return ResponseEntity.ok(taskService.updateTask(requestTask))
    }

    @GetMapping("/get/{id}")
    fun getTask(@PathVariable id: String): ResponseEntity<RequestTask> {
        return ResponseEntity.ok(taskService.getTask(id))
    }

    @PostMapping("")
    fun listTask(@RequestBody listTask: ListTask, @RequestHeader("Authorization") authorization: String): ResponseEntity<List<Task>> {
        return ResponseEntity.ok(taskService.listTask(listTask, authorization))
    }

//    @DeleteMapping("/delete/{id}")
//    fun deleteTask(@PathVariable id: String): ResponseEntity<Boolean> {
//        return ResponseEntity.ok(taskService.deleteTask(id))
//    }
}