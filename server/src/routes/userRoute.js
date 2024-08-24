const express = require("express")
const cors = require("cors")
const User = require("../models/user")

const router = express.Router()

router.post("/register", async (req, res) => {
    const { username, name, email, number, password } = req.body
    try {
        let user = await User.findOne({ email })
        if(user) return res.status(400).send({error: "User already exists..."})

        user = new User({ username, name, email, number, password });
        await user.save()
        return res.status(200).send({success: "Account Created Successfully...!"})
    } catch(error) {
        console.log(error.message)
        res.status(500).send({error: "Server error...!"})
    }

});

router.post("/login", async (req, res) => {
    const {email, password} = req.body
    
    try {
        const user = await User.findOne({email})

        if(!user) return res.status(400).send({error: "Invalid Credentials"})

        return res.status(200).send({success: "Login Successfull...!"})
    } catch(error) {
        console.error(error.message)
        return res.status(500).send({error: "Server error...!"})
    }
})

module.exports = router