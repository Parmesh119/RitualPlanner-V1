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
import ritualplanner.model.ListTemplate
import ritualplanner.model.RitualTemplateRequest
import ritualplanner.model.Template
import ritualplanner.service.TemplateService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/template")
class TemplateController(
    private val templateService: TemplateService
) {
    @PostMapping("/create")
    fun createTemplate(@RequestBody ritualTemplateRequest: RitualTemplateRequest, @RequestHeader("Authorization") authorization: String): ResponseEntity<RitualTemplateRequest> {
        return ResponseEntity.ok(templateService.createTemplate(ritualTemplateRequest, authorization))
    }

    @PutMapping("/update")
    fun updateTemplate(@RequestBody ritualTemplateRequest: RitualTemplateRequest): ResponseEntity<RitualTemplateRequest> {
        return ResponseEntity.ok(templateService.updateTemplate(ritualTemplateRequest))
    }

    @PostMapping("")
    fun listTemplates(@RequestBody listTemplate: ListTemplate, @RequestHeader("Authorization") authorization: String): ResponseEntity<List<Template>> {
        return ResponseEntity.ok(templateService.listTemplate(listTemplate, authorization))
    }

    @GetMapping("/get/{id}")
    fun getTemplateById(@PathVariable id: String): ResponseEntity<RitualTemplateRequest> {
        return ResponseEntity.ok(templateService.getTemplateById(id))
    }

    @DeleteMapping("/delete/{id}")
    fun deleteTemplate(@PathVariable id: String): ResponseEntity<Boolean> {
        return ResponseEntity.ok(templateService.deleteTemplate(id))
    }
}