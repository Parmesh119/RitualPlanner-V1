package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class Task (
    val id: String? = UUID.randomUUID().toString(),
    val taskOwner_id: String,
    val name: String,
    val date: Long = Instant.now().toEpochMilli(),
    val self: Boolean,
    val location: String,
    val payment_id: String? = null,
    val status: String? = "PENDING", // PENDING menas future work and COMPLETED means done
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class TaskNote (
    val id: String? = UUID.randomUUID().toString(),
    val task_id: String,
    val note_id: String,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class TaskAssistant (
    val id: String? = UUID.randomUUID().toString(),
    val task_id: String,
    val taskOwner_id: String,
    val assistant_id: String,
    val payment_id: String? = null,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class Payment (
    val id: String? = UUID.randomUUID().toString(),
    val task_id: String,
    val taskOwner_id: String,
    val paidAmount: Int? = 0,
    val totalAmount: Int,
    val paymentDate: Long? = Instant.now().toEpochMilli(),
    val paymentMode: String? = "CASH",
    val onlinePaymentMode: String? = null,
    val paymentStatus: String? = "PENDING", // PENDING means not received and COMPLETED means received
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class ListTask (
    val search: String? = null,
    val pages: Int? = 1,
    val size: Int? = 10,
    val startDate: Long? = null,
    val endDate: Long? = null,
    val status: String? = null,
    val paymentStatus: String? = null,
)