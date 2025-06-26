package ritualplanner.repository

import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import ritualplanner.model.Bill
import ritualplanner.model.BillPaymentRequest
import ritualplanner.model.ItemBill
import ritualplanner.model.ItemTemplate
import ritualplanner.model.ListBillPayment
import ritualplanner.model.RitualTemplateRequest
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID

@Repository
class BillRepository(
    private val jdbcTemplate: JdbcTemplate
) {
    private val billRowMapper = RowMapper { rs, _ ->
        Bill(
            id = rs.getString("id"),
            name = rs.getString("name"),
            template_id = rs.getString("template_id"),
            totalamount = rs.getInt("totalamount"),
            paymentstatus = rs.getString("paymentstatus"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
        )
    }

    private val itemBillRowMapper = RowMapper { rs, _ ->
        ItemBill(
            id = rs.getString("id"),
            bill_id = rs.getString("bill_id"),
            itemname = rs.getString("itemname"),
            quantity = rs.getInt("quantity"),
            unit = rs.getString("unit"),
            marketrate = rs.getInt("marketrate"),
            extracharges = rs.getInt("extracharges"),
            note = rs.getString("note"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
        )
    }

    fun listBills(user_id: String, listBillPayment: ListBillPayment): List<Bill> {
        return try {
            val sqlBuilder = StringBuilder("""SELECT * FROM "Bill" WHERE user_id = ? AND 1=1""")
            val params = mutableListOf<Any>(user_id)

            listBillPayment.search?.takeIf { it.isNotBlank() }?.let {
                sqlBuilder.append(" AND (name ILIKE ? )")
                params.add("%$it%")
            }

            listBillPayment.status?.takeIf { it.isNotBlank() }?.let {
                sqlBuilder.append(" AND (paymentstatus ILIKE ? )")
                params.add("%$it%")
            }

            listBillPayment.startDate?.let {
                sqlBuilder.append(" AND created_at >= to_timestamp(?)")
                params.add(it / 1000)
            }

            listBillPayment.endDate?.let {
                sqlBuilder.append(" AND created_at <= to_timestamp(?)")
                params.add(it / 1000)
            }

            val page = (listBillPayment.page ?: 1).coerceAtLeast(1)
            val size = (listBillPayment.size ?: 10).coerceIn(1, 100)

            sqlBuilder.append(" ORDER BY created_at ASC")
            sqlBuilder.append(" LIMIT ? OFFSET ?")
            params.add(size)
            params.add((page - 1) * size)

            jdbcTemplate.query(sqlBuilder.toString(), billRowMapper, *params.toTypedArray())
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Error while fetching bills" + e.message)
        }
    }

    @Transactional
    fun createBill(user_id: String, requestBill: BillPaymentRequest): BillPaymentRequest {
        return try {
            val bill = requestBill.bill
            val billId = bill.id  // Will never be null now

            val insertTemplateSql = """
            INSERT INTO "Bill" (id, name, template_id, totalAmount, paymentStatus, created_at, updated_at, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """

            jdbcTemplate.update(
                insertTemplateSql,
                billId,
                bill.name,
                bill.template_id,
                bill.totalamount,
                bill.paymentstatus,
                Timestamp.from(Instant.ofEpochMilli(bill.createdAt)),
                Timestamp.from(Instant.ofEpochMilli(bill.updatedAt)),
                user_id
            )

            val insertItemSql = """
            INSERT INTO "ItemBill" (id, bill_id, itemname, quantity, unit, marketRate, extraCharges, note, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

            requestBill.items.forEach { item ->
                val itemId = item.id ?: UUID.randomUUID().toString()
                jdbcTemplate.update(
                    insertItemSql,
                    itemId,
                    billId,  // using Template.id here
                    item.itemname,
                    item.quantity,
                    item.unit,
                    item.marketrate,
                    item.extracharges,
                    item.note,
                    Timestamp.from(Instant.ofEpochMilli(item.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(item.updatedAt))
                )
            }

            val updatedItems = requestBill.items.map { item ->
                item.copy(bill_id = billId)
            }

            BillPaymentRequest(
                bill = requestBill.bill,
                items = updatedItems
            )
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Error while creating bill " + e.message)
        }
    }

    @Transactional
    fun updateBill(requestBill: BillPaymentRequest): BillPaymentRequest {
        return try {
            val bill = requestBill.bill
            val billId = bill.id

            // Update Template
            val updateTemplateSql = """
            UPDATE "Bill"
            SET name = ?, totalamount = ?, updated_at = ?
            WHERE id = ?
        """
            jdbcTemplate.update(
                updateTemplateSql,
                bill.name,
                bill.totalamount,
                Timestamp.from(Instant.ofEpochMilli(bill.updatedAt)),
                billId
            )

            // Optional: Delete existing items for clean re-insert (if you don't want partial updates)
            val deleteItemsSql = """DELETE FROM "ItemBill" WHERE bill_id = ?"""
            jdbcTemplate.update(deleteItemsSql, billId)

            // Insert updated items
            val insertItemSql = """
            INSERT INTO "ItemBill" (id, bill_id, itemname, quantity, unit, marketrate, extracharges, note, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

            val updatedItems = requestBill.items.map { item ->
                val itemId = item.id ?: UUID.randomUUID().toString()
                jdbcTemplate.update(
                    insertItemSql,
                    itemId,
                    billId,
                    item.itemname,
                    item.quantity,
                    item.unit,
                    item.marketrate,
                    item.extracharges,
                    item.note,
                    Timestamp.from(Instant.ofEpochMilli(item.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(item.updatedAt))
                )
                item.copy(id = itemId, bill_id = billId)
            }

            BillPaymentRequest(
                bill = bill,
                items = updatedItems
            )
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to update bill")
        }
    }

    fun getBillById(id: String): BillPaymentRequest {
        return try {
            val templateSql = """SELECT * FROM "Bill" WHERE id = ?"""
            val template = jdbcTemplate.queryForObject(templateSql, billRowMapper, id)
                ?: throw Exception("Template not found")

            // Fetch the associated ItemTemplates
            val itemSql = """SELECT * FROM "ItemBill" WHERE bill_id = ?"""
            val items = jdbcTemplate.query(itemSql, itemBillRowMapper, id)

            BillPaymentRequest(
                bill = template,
                items = items
            )
        }catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to get bill information")
        }
    }

    fun deleteBill(id: String): Boolean {
        return try {
            val itemSql = """DELETE FROM "ItemBill" WHERE bill_id = ?"""
            jdbcTemplate.update(itemSql, id)

            // Then, delete the Template record itself
            val billSql = """DELETE FROM "Bill" WHERE id = ?"""
            val billDeleted = jdbcTemplate.update(billSql, id)

            if (billDeleted > 0) {
                true
            } else {
                throw Exception("Template not found or could not be deleted")
            }
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Error while deleting bill")
        }
    }
}