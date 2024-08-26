const express = require('express')
const router = express.Router()

router.put("/recover-password/new-password", (req, res) => {
    const {password, confirmPassword} = req.body
    try {
        console.log(password, " ", confirmPassword)
        return res.status(200).send({success: "done"})
    } catch(error) {
        console.log(error.message)
        return res.status(500).send({error: "Server error!"})
    }
})
module.exports = router