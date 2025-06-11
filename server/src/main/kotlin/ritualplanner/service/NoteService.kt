package ritualplanner.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import ritualplanner.model.DeleteNote
import ritualplanner.model.ListNote
import ritualplanner.model.Note
import ritualplanner.repository.NoteRepository

@Service
class NoteService(
    private val noteRepository: NoteRepository
) {
    fun createNote(note: Note): Note {
        return noteRepository.createNote(note)
    }

    fun updateNote(note: Note): Note {
        return noteRepository.updateNote(note)
    }

    fun deleteNote(deleteNote: DeleteNote): String {
        return noteRepository.deleteNote(deleteNote)
    }

    fun getNoteById(id: String): Note? {
        val result = noteRepository.getNoteById(id)
        if(result != null) {
            return result
        }
        return null
    }

    fun listNotes(listNote: ListNote): List<Note> {
        return noteRepository.listNotes(listNote)
    }
}