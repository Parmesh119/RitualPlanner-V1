package ritualplanner.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import ritualplanner.config.JwtUtil
import ritualplanner.model.DeleteNote
import ritualplanner.model.ListNote
import ritualplanner.model.Note
import ritualplanner.repository.AuthRepository
import ritualplanner.repository.NoteRepository

@Service
class NoteService(
    private val noteRepository: NoteRepository,
    private val jwtUtil: JwtUtil,
    private val authRepository: AuthRepository
) {
    fun createNote(note: Note, authorization: String): Note {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id
        return noteRepository.createNote(note, user_id)
    }

    fun updateNote(note: Note, authorization: String): Note {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        if(user_id != null) {
            return noteRepository.updateNote(note)
        }
        throw Exception("User Not Found")
    }

    fun deleteNote(deleteNote: DeleteNote, authorization: String): String {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id
        return noteRepository.deleteNote(deleteNote, user_id)
    }

    fun getNoteById(id: String, authorization: String): Note? {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id
        val result = noteRepository.getNoteById(id, user_id)

        if(result != null) {
            return result
        }
        return null
    }

    fun listNotes(listNote: ListNote, authorization: String): List<Note> {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return noteRepository.listNotes(listNote, user_id)
    }
}