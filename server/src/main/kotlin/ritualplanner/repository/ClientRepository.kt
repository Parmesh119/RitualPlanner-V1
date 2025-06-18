package ritualplanner.repository

import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import ritualplanner.model.Client
import ritualplanner.model.ListClient
import java.sql.ResultSet
import java.sql.Timestamp
import java.time.Instant

@Repository
class ClientRepository(
    private val jdbcTemplate: JdbcTemplate,
) {
    val rowMapper = RowMapper { rs: ResultSet, _: Int ->
        Client(
            id = rs.getString("id"),
            name = rs.getString("name"),
            description = rs.getString("description"),
            email = rs.getString("email"),
            phone = rs.getString("phone"),
            city = rs.getString("city"),
            state = rs.getString("state"),
            zipcode = rs.getString("zipcode"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
        )
    }

    @Transactional
    fun createClient(client: Client, user_id: String): Client {
        return try {
            val sql = """INSERT INTO "Client" (id, name, description, email, phone, city, state, zipcode, created_at, updated_at, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""

            jdbcTemplate.update(sql, client.id, client.name, client.description, client.email, client.phone, client.city, client.state, client.zipcode, Timestamp.from(Instant.ofEpochMilli(client.createdAt)), Timestamp.from(Instant.ofEpochMilli(client.updatedAt)), user_id)

            client
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to create client")
        }
    }

    @Transactional
    fun updateClient(client: Client): Client {
        return try {
            val sql = """UPDATE "Client" SET name = ?, description = ?, email = ?, phone = ?, city = ?, state = ?, zipcode = ?, updated_at = ? WHERE id = ?"""

            jdbcTemplate.update(sql, client.name, client.description, client.email, client.phone, client.city, client.state, client.zipcode, Timestamp.from(Instant.ofEpochMilli(client.updatedAt)), client.id)
            client
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to update client information")
        }
    }

    fun listClients(listClient: ListClient, user_id: String): List<Client> {
        return try {
            val sqlBuilder = StringBuilder("""SELECT * FROM "Client" WHERE user_id = ? AND 1=1""")
            val params = mutableListOf<Any>(user_id)

            listClient.search?.takeIf { it.isNotBlank() }?.let {
                sqlBuilder.append(" AND (name ILIKE ? )")
                params.add("%$it%")
            }

            val page = (listClient.page ?: 1).coerceAtLeast(1)
            val size = (listClient.size ?: 10).coerceIn(1, 100)

            sqlBuilder.append(" ORDER BY created_at ASC")
            sqlBuilder.append(" LIMIT ? OFFSET ?")
            params.add(size)
            params.add((page - 1) * size)

            jdbcTemplate.query(sqlBuilder.toString(), rowMapper, *params.toTypedArray())
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to get clients")
        }
    }

    fun getClientById(id: String): Client {
        return try {
            val sql = """SELECT * FROM "Client" WHERE id = ?"""
            jdbcTemplate.queryForObject(sql, rowMapper, id)
                ?: throw Exception("Client not found with id: $id")
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to get client: ${e.message}")
        }
    }

    fun deleteClient(id: String): Boolean {
        return try {
            val sql = """DELETE FROM "Client" WHERE id = ?"""
            jdbcTemplate.update(sql, id) > 0
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to delete client")
        }
    }
}