package ritualplanner.controller

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ritualplanner.service.UserService

@RestController
@CrossOrigin
@RequestMapping("/api/v2/user")
class UserController (
    private val userService: UserService,
) {


}