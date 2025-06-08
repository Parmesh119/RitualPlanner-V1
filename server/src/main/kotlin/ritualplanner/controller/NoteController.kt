package ritualplanner.controller

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.service.NoteService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/notes")
class NoteController(private val noteService: NoteService) {
}