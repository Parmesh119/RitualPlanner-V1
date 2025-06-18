package ritualplanner.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import ritualplanner.config.JwtUtil
import ritualplanner.model.Client
import ritualplanner.model.ListClient
import ritualplanner.repository.AuthRepository
import ritualplanner.repository.ClientRepository

@Service
class ClientService(
    private val clientRepository: ClientRepository,
    private val jwtUtil: JwtUtil,
    private val authRepository: AuthRepository
) {
    fun createClient(client: Client, authorization: String): Client {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return clientRepository.createClient(client, user_id!!)
    }

    fun updateClient(client: Client): Client {
        return clientRepository.updateClient(client)
    }

    fun listClients (listClient: ListClient, authorization: String): List<Client> {
        val token = authorization.substringAfter("Bearer")
        val email = jwtUtil.getEmailFromToken(token)
        val user_id = authRepository.getUserDetailsByEmail(email).id

        return clientRepository.listClients(listClient, user_id!!)
    }

    fun getClientById(id: String): Client {
        return clientRepository.getClientById(id)
    }

    fun deleteClient(id: String): Boolean {
        return clientRepository.deleteClient(id)
    }
}