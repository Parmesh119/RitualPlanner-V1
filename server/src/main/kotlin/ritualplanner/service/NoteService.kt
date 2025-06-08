package ritualplanner.service

import org.springframework.stereotype.Service
import ritualplanner.repository.NoteRepository

@Service
class NoteService(
    private val noteRepository: NoteRepository
) {
}