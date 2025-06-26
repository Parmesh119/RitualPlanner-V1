package ritualplanner.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import ritualplanner.config.JwtUtil
import ritualplanner.model.Bill
import ritualplanner.model.BillPaymentRequest
import ritualplanner.model.ListBillPayment
import ritualplanner.repository.AuthRepository
import ritualplanner.repository.BillRepository

@Service
class BillService (
    private val billRepository: BillRepository,
    private val jwtUtil: JwtUtil,
    private val authRepository: AuthRepository
) {
    fun listBills(listBillPayment: ListBillPayment, authorization: String): List<Bill> {
        val token = authorization.removePrefix("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return billRepository.listBills(user_id!!, listBillPayment)
    }

    fun createBill(requestBill: BillPaymentRequest, authorization: String): BillPaymentRequest {
        val token = authorization.removePrefix("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return billRepository.createBill(user_id!!, requestBill)
    }

    fun updateBill(requestBill: BillPaymentRequest): BillPaymentRequest {
        return billRepository.updateBill(requestBill)
    }

    fun getBIllById(id: String): BillPaymentRequest {
        return billRepository.getBillById(id)
    }

    fun deleteBill(id: String): Boolean {
        return billRepository.deleteBill(id)
    }
}