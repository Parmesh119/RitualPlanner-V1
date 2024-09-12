const express = require('express')
const router = express.Router()
const User = require('../models/user')

const validate = require('../middleware/validate_Update_Password')
const updatePasswordSchema = require('../validation/updatePassword')

router.put("/recover-password/new-password", validate(updatePasswordSchema), async (req, res) => {
    const {password, confirmPassword, ID} = req.body
    console.log(ID)
    try {
            let update_password = await User.findByIdAndUpdate(
                ID,
            { 
              password,
              confirmPassword 
            },
            { new: true, runValidators: true }
            )
            if(update_password) return res.status(200).send({success: "Password Updated Successfully!"})
            else return res.status(400).status({error: "Error while updating password!"}) 
    } catch(error) {
        console.log(error.message)
        return res.status(500).send({error: "Server error!"})
    }
})
module.exports = router