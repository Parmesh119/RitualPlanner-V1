package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.model.CoWorker
import ritualplanner.model.ListCoWorker
import ritualplanner.service.CoWorkerService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/co-worker")
class CoWorkerController(
    private val coWorkerService: CoWorkerService
) {
    @PostMapping("/create")
    fun createCoWorker(@RequestBody coWorker: CoWorker, @RequestHeader("Authorization") authorization: String): ResponseEntity<CoWorker> {
        return ResponseEntity.ok(coWorkerService.createCoWorker(coWorker, authorization))
    }

    @PutMapping("/update")
    fun updateCoWorker(@RequestBody coWorker: CoWorker): ResponseEntity<CoWorker> {
        return ResponseEntity.ok(coWorkerService.updateCoWorker(coWorker))
    }

    @PostMapping("")
    fun listCoWorkers(@RequestHeader("Authorization") authorization: String, @RequestBody listCoWorker: ListCoWorker): ResponseEntity<List<CoWorker>> {
        return ResponseEntity.ok(coWorkerService.listCoWorker(authorization, listCoWorker))
    }

    @GetMapping("/get/{id}")
    fun getCoWorkerById(@PathVariable id: String, @RequestHeader("Authorization") authorization: String): ResponseEntity<CoWorker> {
        return ResponseEntity.ok(coWorkerService.getCoWorkerById(id, authorization))
    }

    @DeleteMapping("/delete/{id}")
    fun deleteCoWorkerById(@PathVariable id: String, @RequestHeader("Authorization") authorization: String): ResponseEntity<Boolean> {
        return ResponseEntity.ok(coWorkerService.deleteCoWorker(id, authorization))
    }
}