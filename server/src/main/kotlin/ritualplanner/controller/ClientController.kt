package ritualplanner.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.model.Client
import ritualplanner.model.ListClient
import ritualplanner.service.ClientService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/client")
class ClientController(private val clientService: ClientService) {

    @PostMapping("/create")
    fun createClient(@RequestBody client: Client, @RequestHeader("Authorization") authorization: String): ResponseEntity<Client> {
        return ResponseEntity.ok(clientService.createClient(client, authorization))
    }

    @PutMapping("/update")
    fun updateClient(@RequestBody client: Client): ResponseEntity<Client> {
        return ResponseEntity.ok(clientService.updateClient(client))
    }

    @PostMapping("")
    fun listClients(@RequestBody listClient: ListClient, @RequestHeader("Authorization") authorization: String): ResponseEntity<List<Client>> {
        return ResponseEntity.ok(clientService.listClients(listClient, authorization))
    }

    @GetMapping("/get/{id}")
    fun getClient(@PathVariable("id") id: String): ResponseEntity<Client> {
        return ResponseEntity.ok(clientService.getClientById(id))
    }

    @DeleteMapping("/delete/{id}")
    fun deleteClient(@PathVariable("id") id: String): ResponseEntity<Boolean> {
        return ResponseEntity.ok(clientService.deleteClient(id))
    }
}