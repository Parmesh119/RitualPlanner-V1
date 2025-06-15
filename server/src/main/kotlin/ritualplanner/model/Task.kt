package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class Task (
    val id: String? = UUID.randomUUID().toString(),
    val taskOwner_id: String,
    val name: String,
    val date: Long = Instant.now().toEpochMilli(),
    val self: Boolean,
    val place: String,
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
    val status: String? = "PENDING", // PENDING means not received and COMPLETED means received
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)