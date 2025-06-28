package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class Payment (
    val id: String? = UUID.randomUUID().toString(),
    val totalamount: Int,
    val paidamount: Int? = 0,
    val paymentdate: Long? = Instant.now().toEpochMilli(),
    val paymentmode: String? = "CASH",
    val onlinepaymentmode: String? = null,
    val paymentstatus: String? = "PENDING", // PENDING means not received and COMPLETED means received
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class AssistantPayment (
    val id: String? = UUID.randomUUID().toString(),
    val totalamount: Int,
    val paidamount: Int? = 0,
    val paymentdate: Long? = Instant.now().toEpochMilli(),
    val paymentmode: String? = "CASH",
    val onlinepaymentmode: String? = null,
    val paymentstatus: String? = "PENDING",
    val assistant_id: String? = null,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)