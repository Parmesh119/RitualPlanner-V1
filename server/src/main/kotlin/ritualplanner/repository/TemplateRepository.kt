package ritualplanner.repository

import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import ritualplanner.model.ItemTemplate
import ritualplanner.model.ListTemplate
import ritualplanner.model.RitualTemplateRequest
import ritualplanner.model.Template
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID

@Repository
class TemplateRepository(
    private val jdbcTemplate: JdbcTemplate
) {
    private val rowMapper = RowMapper { rs, _ ->
        RitualTemplateRequest(
            ritualTemplate = Template(
                id = rs.getString("id"),
                name = rs.getString("name"),
                description = rs.getString("description"),
                createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
                updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
            ),
            requiredItems = listOf(
                ItemTemplate(
                    id = rs.getString("id"),
                    template_id = rs.getString("template_id"),
                    itemname = rs.getString("itemname"),
                    quantity = rs.getInt("quantity"),
                    unit = rs.getString("unit"),
                    createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
                    updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
                )
            )
        )
    }

    private val templateRowMapper = RowMapper { rs, _ ->
        Template(
            id = rs.getString("id"),
            name = rs.getString("name"),
            description = rs.getString("description"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
        )
    }

    private val itemTemplateRowMapper = RowMapper { rs, _ ->
        ItemTemplate(
            id = rs.getString("id"),
            template_id = rs.getString("template_id"),
            itemname = rs.getString("itemname"),
            quantity = rs.getInt("quantity"),
            unit = rs.getString("unit"),
            createdAt = rs.getTimestamp("created_at").toInstant().epochSecond,
            updatedAt = rs.getTimestamp("updated_at").toInstant().epochSecond
        )
    }

    @Transactional
    fun createTemplate(ritualTemplateRequest: RitualTemplateRequest, user_id: String): RitualTemplateRequest {
        return try {
            val template = ritualTemplateRequest.ritualTemplate
            val templateId = template.id  // Will never be null now

            val insertTemplateSql = """
            INSERT INTO "Template" (id, name, description, created_at, updated_at, user_id)
            VALUES (?, ?, ?, ?, ?, ?)
        """

            jdbcTemplate.update(
                insertTemplateSql,
                templateId,
                template.name,
                template.description,
                Timestamp.from(Instant.ofEpochMilli(template.createdAt)),
                Timestamp.from(Instant.ofEpochMilli(template.updatedAt)),
                user_id
            )

            val insertItemSql = """
            INSERT INTO "ItemTemplate" (id, template_id, itemname, quantity, unit, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """

            ritualTemplateRequest.requiredItems.forEach { item ->
                val itemId = item.id ?: UUID.randomUUID().toString()
                jdbcTemplate.update(
                    insertItemSql,
                    itemId,
                    templateId,  // using Template.id here
                    item.itemname,
                    item.quantity,
                    item.unit,
                    Timestamp.from(Instant.ofEpochMilli(item.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(item.updatedAt))
                )
            }

            val updatedItems = ritualTemplateRequest.requiredItems.map { item ->
                item.copy(template_id = templateId)
            }

            RitualTemplateRequest(
                ritualTemplate = ritualTemplateRequest.ritualTemplate,
                requiredItems = updatedItems
            )

        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to create template")
        }
    }

    @Transactional
    fun updateTemplate(ritualTemplateRequest: RitualTemplateRequest): RitualTemplateRequest {
        return try {
            val template = ritualTemplateRequest.ritualTemplate
            val templateId = template.id

            // Update Template
            val updateTemplateSql = """
            UPDATE "Template"
            SET name = ?, description = ?, updated_at = ?
            WHERE id = ?
        """
            jdbcTemplate.update(
                updateTemplateSql,
                template.name,
                template.description,
                Timestamp.from(Instant.ofEpochMilli(template.updatedAt)),
                templateId
            )

            // Optional: Delete existing items for clean re-insert (if you don't want partial updates)
            val deleteItemsSql = """DELETE FROM "ItemTemplate" WHERE template_id = ?"""
            jdbcTemplate.update(deleteItemsSql, templateId)

            // Insert updated items
            val insertItemSql = """
            INSERT INTO "ItemTemplate" (id, template_id, itemname, quantity, unit, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """

            val updatedItems = ritualTemplateRequest.requiredItems.map { item ->
                val itemId = item.id ?: UUID.randomUUID().toString()
                jdbcTemplate.update(
                    insertItemSql,
                    itemId,
                    templateId,
                    item.itemname,
                    item.quantity,
                    item.unit,
                    Timestamp.from(Instant.ofEpochMilli(item.createdAt)),
                    Timestamp.from(Instant.ofEpochMilli(item.updatedAt))
                )
                item.copy(id = itemId, template_id = templateId)
            }

            RitualTemplateRequest(
                ritualTemplate = template,
                requiredItems = updatedItems
            )
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to update template")
        }
    }

    fun listTemplate(listTemplate: ListTemplate, user_id: String): List<Template> {
        return try {
            val sqlBuilder = StringBuilder("""SELECT * FROM "Template" WHERE user_id = ? AND 1=1""")
            val params = mutableListOf<Any>(user_id)

            listTemplate.search?.takeIf { it.isNotBlank() }?.let {
                sqlBuilder.append(" AND (name ILIKE ? )")
                params.add("%$it%")
            }

            val page = (listTemplate.page ?: 1).coerceAtLeast(1)
            val size = (listTemplate.size ?: 10).coerceIn(1, 100)

            sqlBuilder.append(" ORDER BY created_at ASC")
            sqlBuilder.append(" LIMIT ? OFFSET ?")
            params.add(size)
            params.add((page - 1) * size)

            jdbcTemplate.query(sqlBuilder.toString(), templateRowMapper, *params.toTypedArray())
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to get template")
        }
    }

    fun getTemplateById(id: String): RitualTemplateRequest {
        return try {
            val templateSql = """SELECT * FROM "Template" WHERE id = ?"""
            val template = jdbcTemplate.queryForObject(templateSql, templateRowMapper, id)
                ?: throw Exception("Template not found")

            // Fetch the associated ItemTemplates
            val itemSql = """SELECT * FROM "ItemTemplate" WHERE template_id = ?"""
            val items = jdbcTemplate.query(itemSql, itemTemplateRowMapper, id)

            RitualTemplateRequest(
                ritualTemplate = template,
                requiredItems = items
            )
        }catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to get template information")
        }
    }

    fun deleteTemplate(id: String): Boolean {
        return try {
            // First, delete all related ItemTemplate records
            val itemSql = """DELETE FROM "ItemTemplate" WHERE template_id = ?"""
            jdbcTemplate.update(itemSql, id)

            // Then, delete the Template record itself
            val templateSql = """DELETE FROM "Template" WHERE id = ?"""
            val templateDeleted = jdbcTemplate.update(templateSql, id)

            if (templateDeleted > 0) {
                true
            } else {
                throw Exception("Template not found or could not be deleted")
            }
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Failed to delete template")
        }
    }
}