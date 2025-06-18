package ritualplanner.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import ritualplanner.config.JwtUtil
import ritualplanner.model.ListTemplate
import ritualplanner.model.RitualTemplateRequest
import ritualplanner.model.Template
import ritualplanner.repository.AuthRepository
import ritualplanner.repository.TemplateRepository

@Service
class TemplateService(
    private val templateRepository: TemplateRepository,
    private val authRepository: AuthRepository,
    private val jwtUtil: JwtUtil
) {
    fun createTemplate(ritualTemplateRequest: RitualTemplateRequest, authorization: String): RitualTemplateRequest {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return templateRepository.createTemplate(ritualTemplateRequest, user_id!!)
    }

    fun updateTemplate(ritualTemplateRequest: RitualTemplateRequest): RitualTemplateRequest {
        return templateRepository.updateTemplate(ritualTemplateRequest)
    }

    fun listTemplate(listTemplate: ListTemplate, authorization: String): List<Template> {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return templateRepository.listTemplate(listTemplate, user_id!!)
    }

    fun getTemplateById(id: String): RitualTemplateRequest {
        return templateRepository.getTemplateById(id)
    }

    fun deleteTemplate(id: String): Boolean {
        return templateRepository.deleteTemplate(id)
    }
}