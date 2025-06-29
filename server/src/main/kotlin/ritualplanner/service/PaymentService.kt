package ritualplanner.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import ritualplanner.model.Payment
import ritualplanner.repository.PaymentRepository

@Service
class PaymentService (
    private val paymentRepository: PaymentRepository
) {
    fun getPaymentById(id: String): Payment {
        return paymentRepository.getPaymentById(id)
    }
}