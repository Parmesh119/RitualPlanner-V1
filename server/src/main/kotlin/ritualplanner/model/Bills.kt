package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class Bill (
    val id: String? = UUID.randomUUID().toString(),
    val name: String,
    val template_id: String,
    val totalamount: Int? = null,
    val paymentstatus: String? = "PENDING",
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class ItemBill (
    val id: String? = UUID.randomUUID().toString(),
    val bill_id: String? = null,
    val itemname: String,
    val quantity: Int,
    val unit: String,
    val marketrate: Int, // per unit
    val extracharges: Int? = null,
    val note: String? = null,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class BillPaymentRequest (
    val bill: Bill,
    val items: List<ItemBill>,
)

data class ListBillPayment (
    val search: String? = null,
    val page: Int? = 1,
    val size: Int? = 10,
    val status: String? = null,
    val startDate: Long? = null,
    val endDate: Long? = null,
)