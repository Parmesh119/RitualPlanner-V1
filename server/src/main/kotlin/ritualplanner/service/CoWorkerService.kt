package ritualplanner.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import ritualplanner.config.JwtUtil
import ritualplanner.model.CoWorker
import ritualplanner.model.ListCoWorker
import ritualplanner.repository.AuthRepository
import ritualplanner.repository.CoWorkerRepository

@Service
class CoWorkerService(
    private val coWorkerRepository: CoWorkerRepository,
    private val jwtUtil: JwtUtil,
    private val authRepository: AuthRepository
) {
    fun createCoWorker(coWorker: CoWorker, authorization: String): CoWorker {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return coWorkerRepository.createCoWorker(coWorker, user_id)
    }

    fun updateCoWorker(coWorker: CoWorker, authorization: String): CoWorker {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return coWorkerRepository.updateCoWorker(coWorker, user_id!!)
    }

    fun listCoWorker(authorization: String, listCoWorker: ListCoWorker): List<CoWorker> {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return coWorkerRepository.listCoWorker(user_id!!, listCoWorker)
    }

    fun getCoWorkerById(id: String, authorization: String): CoWorker {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return coWorkerRepository.getCoWorkerById(id, user_id!!)
    }

    fun deleteCoWorker(id: String, authorization: String): Boolean {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return coWorkerRepository.deleteCoWorker(user_id!!, id)
    }
}