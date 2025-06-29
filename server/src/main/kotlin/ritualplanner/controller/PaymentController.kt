package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.model.Payment
import ritualplanner.service.PaymentService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/payments")
class PaymentController (
    private val paymentService: PaymentService
) {
    @GetMapping("/get/{id}")
    fun get(@PathVariable("id") id: String): ResponseEntity<Payment> {
        return ResponseEntity.ok(paymentService.getPaymentById(id))
    }
}