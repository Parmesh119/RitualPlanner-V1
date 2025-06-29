package ritualplanner.repository

import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import ritualplanner.model.AssistantPayment
import ritualplanner.model.ListTask
import ritualplanner.model.Payment
import ritualplanner.model.RequestTask
import ritualplanner.model.Task
import ritualplanner.model.TaskAssistant
import ritualplanner.model.TaskNote
import ritualplanner.model.TaskPayment
import java.sql.ResultSet
import java.sql.Time
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID

@Repository
class TaskRepository(
    private val jdbcTemplate: JdbcTemplate
) {
    private val taskRowMapper = RowMapper { rs: ResultSet, _: Int ->
        Task(
            id = rs.getString("id"),
            taskOwner_id = rs.getString("taskowner_id"),
            name = rs.getString("name"),
            date = rs.getTimestamp("date").toInstant().epochSecond,
            self = rs.getBoolean(("self")),
            location = rs.getString("location"),
            status = rs.getString("status"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond,
            description = rs.getString("description"),
            client_id = rs.getString("client_id"),
            template_id = rs.getString("template_id"),
            bill_id = rs.getString("bill_id"),
            starttime = rs.getTime("starttime").toLocalTime(),
            endtime = rs.getTime("endtime").toLocalTime()
        )
    }

    private val taskNoteRowMapper = RowMapper { rs: ResultSet, _: Int ->
        TaskNote(
            id = rs.getString("id"),
            task_id = rs.getString("task_id"),
            note_id = rs.getString("note_id"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond,
        )
    }

    private val taskAssistantRowMapper = RowMapper { rs: ResultSet, _: Int ->
        TaskAssistant(
            id = rs.getString("id"),
            task_id = rs.getString("task_id"),
            taskOwner_id = rs.getString("taskowner_id"),
            assistant_id = rs.getString("assistant_id"),
            payment_id = rs.getString("payment_id"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond,
        )
    }

    private val taskPaymentRowMapper = RowMapper { rs: ResultSet, _: Int ->
        TaskPayment(
            id = rs.getString("id"),
            task_id = rs.getString("task_id"),
            taskOwner_id = rs.getString("taskowner_id"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond,
            payment_id = rs.getString("payment_id")
        )
    }

    val paymentRowMapper = RowMapper<Payment> { rs, _ ->
        Payment(
            id = rs.getString("id"),
            totalamount = rs.getInt("totalamount"),
            paidamount = rs.getInt("paidamount"),
            paymentdate = rs.getTimestamp("paymentdate").toInstant().epochSecond,
            paymentmode = rs.getString("paymentmode"),
            onlinepaymentmode = rs.getString("onlinepaymentmode"),
            paymentstatus = rs.getString("paymentstatus"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
        )
    }

    fun createTask(requestTask: RequestTask, userId: String): RequestTask {
        return try {
            val task = requestTask.task
            val taskId = UUID.randomUUID().toString()

            // Insert Task
            val taskSql = """
            INSERT INTO "Task" (id, taskowner_id, name, description, date, starttime, endtime, self, location, client_id, template_id, bill_id, status, created_at, updated_at, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """.trimIndent()

            jdbcTemplate.update(
                taskSql,
                taskId,
                task.taskOwner_id,
                task.name,
                task.description,
                Timestamp.from(Instant.ofEpochMilli(task.date)),
                Time.valueOf(task.starttime),
                Time.valueOf(task.endtime),
                task.self,
                task.location,
                task.client_id,
                task.template_id,
                task.bill_id,
                task.status,
                Timestamp.from(Instant.ofEpochMilli(task.createdAt)),
                Timestamp.from(Instant.ofEpochMilli(task.updatedAt)),
                userId
            )

            // Insert Notes (only if note_id is present)
            requestTask.note?.filter { !it.note_id.isNullOrBlank() }?.forEach {
                val noteSql = """
                INSERT INTO "TaskNote" (id, task_id, note_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
            """.trimIndent()
                jdbcTemplate.update(
                    noteSql,
                    it.id ?: UUID.randomUUID().toString(),
                    taskId,
                    it.note_id,
                    Timestamp.from(Instant.ofEpochMilli(it.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(it.updatedAt))
                )
            }

            // Insert Assistants (only if assistant_id is present)
            requestTask.assistant?.filter { !it.assistant_id.isNullOrBlank() }?.forEach {
                val assistantSql = """
                INSERT INTO "TaskAssistant" (id, task_id, taskowner_id, assistant_id, payment_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """.trimIndent()
                jdbcTemplate.update(
                    assistantSql,
                    it.id ?: UUID.randomUUID().toString(),
                    taskId,
                    it.taskOwner_id,
                    it.assistant_id,
                    it.payment_id,
                    Timestamp.from(Instant.ofEpochMilli(it.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(it.updatedAt))
                )
            }

            // Insert assistant payment
            requestTask.assistantPayment?.filter { it.assistant_id != null }?.forEach { payment ->
                val assistantPaymentId = payment.id ?: UUID.randomUUID().toString()
                val assistantPaymentSql = """
        INSERT INTO "Payment" (id, totalamount, paidamount, paymentdate, paymentmode, onlinepaymentmode, paymentstatus, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """.trimIndent()

                jdbcTemplate.update(
                    assistantPaymentSql,
                    assistantPaymentId,
                    payment.totalamount,
                    payment.paidamount ?: 0,
                    Timestamp.from(Instant.ofEpochMilli(payment.paymentdate ?: Instant.now().toEpochMilli())),
                    payment.paymentmode,
                    payment.onlinepaymentmode,
                    payment.paymentstatus,
                    Timestamp.from(Instant.ofEpochMilli(payment.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(payment.updatedAt))
                )

                // Link assistant payment to TaskAssistant (if needed)
                requestTask.assistant?.filter { it.assistant_id == payment.assistant_id }?.forEach { assistant ->
                    val updatedSql = """
            UPDATE "TaskAssistant"
            SET payment_id = ?
            WHERE assistant_id = ? AND task_id = ?
        """.trimIndent()
                    jdbcTemplate.update(
                        updatedSql,
                        assistantPaymentId,
                        assistant.assistant_id,
                        assistant.task_id ?: taskId
                    )
                }
            }

            // Insert Payment
            var savedPayment: Payment? = null
            requestTask.payment?.let { payment ->
                val paymentId = UUID.randomUUID().toString()
                val paymentSql = """
                INSERT INTO "Payment" (id, totalamount, paidamount, paymentdate, paymentmode, onlinepaymentmode, paymentstatus, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """.trimIndent()

                jdbcTemplate.update(
                    paymentSql,
                    paymentId,
                    payment.totalamount,
                    payment.paidamount,
                    Timestamp.from(Instant.ofEpochMilli(payment.paymentdate ?: Instant.now().toEpochMilli())),
                    payment.paymentmode,
                    payment.onlinepaymentmode,
                    payment.paymentstatus,
                    Timestamp.from(Instant.ofEpochMilli(payment.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(payment.updatedAt))
                )

                // Link task to payment
                val taskPaymentSql = """
                INSERT INTO "TaskPayment" (id, task_id, taskowner_id, payment_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """.trimIndent()

                jdbcTemplate.update(
                    taskPaymentSql,
                    UUID.randomUUID().toString(),
                    taskId,
                    task.taskOwner_id,
                    paymentId,
                    Timestamp.from(Instant.now()),
                    Timestamp.from(Instant.now())
                )

                savedPayment = payment.copy(id = paymentId)
            }

            // Return updated request
            requestTask.copy(
                task = task.copy(id = taskId),
                payment = savedPayment
            )

        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Error while creating task: ${e.message}")
        }
    }


    fun updateTask(requestTask: RequestTask): RequestTask {
        return try {
            val task = requestTask.task
            val taskId = task.id ?: throw IllegalArgumentException("Task ID must not be null")

            // Update Task
            val taskUpdateSql = """
            UPDATE "Task" SET 
                name = ?, description = ?, date = ?, start_time = ?, end_time = ?, 
                self = ?, location = ?, client_id = ?, template_id = ?, bill_id = ?, 
                status = ?, updated_at = ?
            WHERE id = ?
        """.trimIndent()

            jdbcTemplate.update(
                taskUpdateSql,
                task.name,
                task.description,
                Timestamp.from(Instant.ofEpochMilli(task.date)),
                Time.valueOf(task.starttime),
                Time.valueOf(task.endtime),
                task.self,
                task.location,
                task.client_id,
                task.template_id,
                task.bill_id,
                task.status,
                Timestamp.from(Instant.ofEpochMilli(task.updatedAt)),
                taskId
            )

            // Delete existing notes and assistants
            jdbcTemplate.update("""DELETE FROM "TaskNote" WHERE task_id = ?""", taskId)
            jdbcTemplate.update("""DELETE FROM "TaskAssistant" WHERE task_id = ?""", taskId)
            jdbcTemplate.update("""DELETE FROM "TaskPayment" WHERE task_id = ?""", taskId)

            // Re-insert notes
            requestTask.note?.forEach {
                val noteSql = """
                INSERT INTO "TaskNote" (id, task_id, note_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
            """.trimIndent()
                jdbcTemplate.update(
                    noteSql,
                    it.id ?: UUID.randomUUID().toString(),
                    taskId,
                    it.note_id,
                    Timestamp.from(Instant.ofEpochMilli(it.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(it.updatedAt))
                )
            }

            // Re-insert assistants
            requestTask.assistant?.forEach {
                val assistantSql = """
                INSERT INTO "TaskAssistant" (id, task_id, taskowner_id, assistant_id, payment_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """.trimIndent()
                jdbcTemplate.update(
                    assistantSql,
                    it.id ?: UUID.randomUUID().toString(),
                    taskId,
                    it.taskOwner_id,
                    it.assistant_id,
                    it.payment_id,
                    Timestamp.from(Instant.ofEpochMilli(it.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(it.updatedAt))
                )
            }

            // Re-insert Payment and TaskPayment
            var updatedPayment: Payment? = null
            requestTask.payment?.let { payment ->
                val paymentId = payment.id ?: UUID.randomUUID().toString()

                // Delete existing Payment record
                jdbcTemplate.update("""DELETE FROM "Payment" WHERE id = ?""", payment.id)

                // Insert new payment
                val paymentSql = """
                INSERT INTO "Payment" (id, total_amount, paid_amount, payment_date, payment_mode, online_payment_mode, payment_status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """.trimIndent()

                jdbcTemplate.update(
                    paymentSql,
                    paymentId,
                    payment.totalamount,
                    payment.paidamount,
                    Timestamp.from(Instant.ofEpochMilli(payment.paymentdate ?: Instant.now().toEpochMilli())),
                    payment.paymentmode,
                    payment.onlinepaymentmode,
                    payment.paymentstatus,
                    Timestamp.from(Instant.ofEpochMilli(payment.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(payment.updatedAt))
                )

                // Insert into TaskPayment
                val taskPaymentSql = """
                INSERT INTO "TaskPayment" (id, task_id, taskowner_id, payment_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """.trimIndent()
                jdbcTemplate.update(
                    taskPaymentSql,
                    UUID.randomUUID().toString(),
                    taskId,
                    task.taskOwner_id,
                    paymentId,
                    Timestamp.from(Instant.ofEpochMilli(Instant.now().toEpochMilli())),
                    Timestamp.from(Instant.ofEpochMilli(Instant.now().toEpochMilli()))
                )

                updatedPayment = payment.copy(id = paymentId)
            }

            // Return updated requestTask
            requestTask.copy(payment = updatedPayment)
        } catch (e: Exception) {
            throw Exception("Error while updating task" + e.message)
        }
    }

    fun getTask(id: String): RequestTask {
        return try {
            // Fetch the main task
            val taskSql = """SELECT * FROM "Task" WHERE id = ?"""
            val task = jdbcTemplate.queryForObject(taskSql, taskRowMapper, id)
                ?: throw Exception("Task not found for ID: $id")

            // Fetch task notes
            val noteSql = """SELECT * FROM "TaskNote" WHERE task_id = ?"""
            val notes = jdbcTemplate.query(noteSql, taskNoteRowMapper, id)

            // Fetch task assistants
            val assistantSql = """SELECT * FROM "TaskAssistant" WHERE task_id = ?"""
            val assistants = jdbcTemplate.query(assistantSql, taskAssistantRowMapper, id)

            val taskPaymentSql = """SELECT * FROM "TaskPayment" WHERE task_id = ? LIMIT 1"""
            val taskPayment = jdbcTemplate.queryForObject(taskPaymentSql, taskPaymentRowMapper, id)
            val paymentId = taskPayment?.payment_id

            val payment: Payment? = paymentId?.let {
                val paymentSql = """SELECT * FROM "Payment" WHERE id = ?"""
                jdbcTemplate.queryForObject(paymentSql, paymentRowMapper, it)
            }

            RequestTask(
                task = task,
                note = notes,
                assistant = assistants,
                payment = payment
            )
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Error while fetching task" + e.message)
        }
    }

    fun listTask(listTask: ListTask, userId: String): List<Task> {
        return try {
            val sqlBuilder = StringBuilder("""SELECT * FROM "Task" WHERE user_id = ? AND 1=1""")
            val params = mutableListOf<Any>(userId!!)

            listTask.search?.takeIf { it.isNotBlank() }?.let {
                sqlBuilder.append(" AND (name ILIKE ? OR description ILIKE ?)")
                params.add("%$it%")
                params.add("%$it%")
            }

            listTask.startDate?.let {
                sqlBuilder.append(" AND created_at >= to_timestamp(?)")
                params.add(it / 1000)
            }

            listTask.endDate?.let {
                sqlBuilder.append(" AND created_at <= to_timestamp(?)")
                params.add(it / 1000)
            }

            listTask.status?.let {
                sqlBuilder.append(" AND (status ILIKE ? )")
                params.add("%$it%")
            }

            val page = (listTask.page ?: 1).coerceAtLeast(1)
            val size = (listTask.size ?: 10).coerceIn(1, 100)

            sqlBuilder.append(" ORDER BY created_at ASC")
            sqlBuilder.append(" LIMIT ? OFFSET ?")
            params.add(size)
            params.add((page - 1) * size)

            jdbcTemplate.query(sqlBuilder.toString(), taskRowMapper, *params.toTypedArray())
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Error while fetching task listing" + e.message)
        }
    }

//    fun deleteTask(id: String): Boolean {
//        return try {
//
//        } catch (e: Exception) {
//            e.printStackTrace()
//            throw Exception("Error while deleting the task" + e.message)
//        }
//    }
}