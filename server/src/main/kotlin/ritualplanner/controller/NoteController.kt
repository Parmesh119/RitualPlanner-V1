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
import ritualplanner.model.DeleteNote
import ritualplanner.model.ListNote
import ritualplanner.model.Note
import ritualplanner.service.NoteService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/notes")
class NoteController(
    private val noteService: NoteService
) {
    @PostMapping("/create")
    fun createNote(@RequestBody note: Note, @RequestHeader("Authorization") authorization: String): ResponseEntity<Note> {
        return ResponseEntity.ok(noteService.createNote(note, authorization))
    }

    @PutMapping("/update")
    fun updateNote(@RequestBody note: Note, @RequestHeader("Authorization") authorization: String): ResponseEntity<Note> {
        return ResponseEntity.ok(noteService.updateNote(note, authorization))
    }

    @DeleteMapping("/delete/{id}")
    fun deleteNote(@PathVariable id: String, @RequestHeader("Authorization") authorization: String): ResponseEntity<String> {
        return ResponseEntity.ok(noteService.deleteNote(id, authorization))
    }

    @GetMapping("/note/{id}")
    fun getNoteById(@PathVariable id: String, @RequestHeader("Authorization") authorization: String): ResponseEntity<Note> {
        val result = noteService.getNoteById(id, authorization)
        if(result == null) {
            throw Exception("note not found")
        }
        return ResponseEntity.ok(result)
    }

    @PostMapping("")
    fun listAllNotes(@RequestBody listNote: ListNote, @RequestHeader("Authorization") authorization: String): ResponseEntity<List<Note>> {
        return ResponseEntity.ok(noteService.listNotes(listNote, authorization))
    }
}