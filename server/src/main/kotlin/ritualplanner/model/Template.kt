package ritualplanner.model

import java.time.Instant
import java.util.UUID

data class Template (
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val description: String? = null,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class ItemTemplate (
    val id: String? = UUID.randomUUID().toString(),
    val template_id: String? = null,
    val itemname: String,
    val quantity: Int,
    val unit: String,
    val note: String? = null,
    val createdAt: Long = Instant.now().toEpochMilli(),
    val updatedAt: Long = Instant.now().toEpochMilli()
)

data class RitualTemplateRequest (
    val ritualTemplate: Template,
    val requiredItems: List<ItemTemplate>
)

data class ListTemplate (
    val search: String? = null,
    val page: Int? = 1,
    val size: Int? = 10,
    val startDate: Long? = null,
    val endDate: Long? = null,
)