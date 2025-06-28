package ritualplanner.model

import java.time.Instant
import java.time.LocalTime
import java.util.UUID

data class Task(
    val id: String? = UUID.randomUUID().toString(),
    val taskOwner_id: String,
    val name: String,
    val description: String? = null,
    val date: Long = Instant.now().toEpochMilli(),
    val starttime: LocalTime,
    val endtime: LocalTime,
    val self: Boolean,
    val location: String,
    val client_id: String? = null,
    val template_id: String? = null,
    val bill_id: String? = null,
    val status: String? = "PENDING", // PENDING menas future work and COMPLETED means done
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class TaskNote (
    val id: String? = UUID.randomUUID().toString(),
    val task_id: String? = null,
    val note_id: String? = null,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class TaskAssistant (
    val id: String? = UUID.randomUUID().toString(),
    val task_id: String? = null,
    val taskOwner_id: String,
    val assistant_id: String? = null,
    val payment_id: String? = null,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class TaskPayment (
    val id: String? = UUID.randomUUID().toString(),
    val task_id: String? = null,
    val taskOwner_id: String,
    val payment_id: String? = null,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class RequestTask (
    val task: Task,
    val note: List<TaskNote>? = emptyList(),
    val assistant: List<TaskAssistant>? = emptyList(),
    val payment: Payment? = null,
    val assistantPayment: List<AssistantPayment>? = emptyList()
)

data class ListTask (
    val search: String? = null,
    val page: Int? = 1,
    val size: Int? = 10,
    val startDate: Long? = null,
    val endDate: Long? = null,
    val status: String? = null,
    val paymentStatus: String? = null,
)