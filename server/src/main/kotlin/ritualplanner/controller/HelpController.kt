package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.model.Help
import ritualplanner.service.EmailService
import ritualplanner.service.HelpService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/help")
class HelpController(
    private val helpService: HelpService
) {
    @PostMapping("/message")
    fun sendMessage(@RequestBody help: Help, @RequestHeader("Authorization") authorization: String): ResponseEntity<Boolean> {
        return ResponseEntity.ok(helpService.sendMessage(help, authorization))
    }
}