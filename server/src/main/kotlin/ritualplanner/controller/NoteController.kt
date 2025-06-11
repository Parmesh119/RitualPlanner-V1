package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
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
    fun createNote(@RequestBody note: Note): ResponseEntity<Note> {
        return ResponseEntity.ok(noteService.createNote(note))
    }

    @PutMapping("/update")
    fun updateNote(@RequestBody note: Note): ResponseEntity<Note> {
        return ResponseEntity.ok(noteService.updateNote(note))
    }

    @DeleteMapping("/delete")
    fun deleteNote(@RequestBody deleteNoteRequest: DeleteNote): ResponseEntity<String> {
        return ResponseEntity.ok(noteService.deleteNote(deleteNoteRequest))
    }

    @GetMapping("/note/{id}")
    fun getNoteById(@PathVariable id: String): ResponseEntity<Note> {
        val result = noteService.getNoteById(id)
        if(result == null) {
            throw Exception("note not found")
        }
        return ResponseEntity.ok(result)
    }

    @PostMapping("")
    fun listAllNotes(@RequestBody listNote: ListNote): ResponseEntity<List<Note>> {
        return ResponseEntity.ok(noteService.listNotes(listNote))
    }
}