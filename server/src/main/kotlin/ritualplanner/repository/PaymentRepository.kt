package ritualplanner.repository

import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import ritualplanner.model.Payment
import java.sql.ResultSet

@Repository
class PaymentRepository (
    private val jdbcTemplate: JdbcTemplate
) {
    private val rowMapper = RowMapper { rs: ResultSet, _: Int ->
        Payment(
            id = rs.getString("id"),
            totalamount = rs.getInt("totalamount"),
            paidamount = rs.getInt("paidamount"),
            paymentdate = rs.getTimestamp("paymentdate").toInstant().epochSecond,
            paymentmode = rs.getString("paymentmode"),
            onlinepaymentmode = rs.getString("onlinepaymentmode"),
            paymentstatus = rs.getString("paymentstatus"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond,
        )
    }

    fun getPaymentById(id: String): Payment {
        return try {
            val sql = """SELECT * FROM "Payment" WHERE id = ?"""
            jdbcTemplate.queryForObject(sql, arrayOf(id)) { rs, _ ->
                Payment(
                    id = rs.getString("id"),
                    totalamount = rs.getInt("totalamount"),
                    paidamount = rs.getInt("paidamount"),
                    paymentdate = rs.getTimestamp("paymentdate").toInstant().epochSecond,
                    paymentmode = rs.getString("paymentmode"),
                    onlinepaymentmode = rs.getString("onlinepaymentmode"),
                    paymentstatus = rs.getString("paymentstatus"),
                    createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
                    updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond,
                )
            } ?: throw Exception("Payment not found")
        } catch (e: Exception) {
            throw Exception("Error while fetching payment details: ${e.message}", e)
        }
    }

}