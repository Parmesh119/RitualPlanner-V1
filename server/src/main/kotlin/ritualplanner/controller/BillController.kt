package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.model.Bill
import ritualplanner.model.BillPaymentRequest
import ritualplanner.model.ListBillPayment
import ritualplanner.service.BillService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/bills-payment")
class BillController (
    private val billService: BillService
) {
    @PostMapping("")
    fun listBills(@RequestBody listBillPayment: ListBillPayment, @RequestHeader("Authorization") authorization: String): ResponseEntity<List<Bill>> {
        return ResponseEntity.ok(billService.listBills(listBillPayment, authorization))
    }

    @PostMapping("/create")
    fun createBill(@RequestBody requestBill: BillPaymentRequest, @RequestHeader("Authorization") authorization: String): ResponseEntity<BillPaymentRequest> {
        return ResponseEntity.ok(billService.createBill(requestBill, authorization))
    }

    @PostMapping("/update")
    fun updateBill(@RequestBody requestBill: BillPaymentRequest): ResponseEntity<BillPaymentRequest> {
        return ResponseEntity.ok(billService.updateBill(requestBill))
    }

    @GetMapping("/get/{id}")
    fun getBillById(@PathVariable id: String): ResponseEntity<BillPaymentRequest> {
        return ResponseEntity.ok(billService.getBIllById(id))
    }

    @DeleteMapping("/delete/{id}")
    fun deleteBill(@PathVariable id: String): ResponseEntity<Boolean> {
        return ResponseEntity.ok(billService.deleteBill(id))
    }
}