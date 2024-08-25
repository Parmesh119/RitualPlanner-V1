const express = require("express")
const cors = require("cors")
const bcrypt = require('bcryptjs')
const User = require("../models/user")
const validate = require('../middleware/validate-signup')
const signupSchema = require('../validation/signup')

const router = express.Router()

router.post("/register", validate(signupSchema), async (req, res) => {
    const { username, name, email, number, password } = req.body
    try {
        let user = await User.findOne({ $or: [
            { email: email },
            { username: username },
            { number: number },
            {password: password}
        ] })
        // if(user) return res.status(400).send({error: "User already exists..."})

        if (user) {
            
            if (user.email === email) return res.status(400).send({ error: "Email is already taken." });
            if (user.username === username) return res.status(400).send({ error: "Username is already taken." });
            if (user.number.toString() === number.toString()) return res.status(400).send({ error: "Number is already taken." });
            if (user.password === password) return res.status(400).send({ error: "Password is already taken." });
        }

        user = new User({ username, name, email, number, password });
        await user.save()
        return res.status(200).send({success: "Account Created Successfully...!"})
    } catch(error) {
        console.log(error.message)
        res.status(500).send({error: "Server error...!"})
    }

});

router.post("/login", async (req, res) => {
    const { credentials, password } = req.body;

    try {
        let user;

        if (!isNaN(credentials)) {
            user = await User.findOne({ number: credentials });
        } else {
            user = await User.findOne({
                $or: [{ email: credentials }, { username: credentials }]
            });
        }

        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!user || !isMatch) return res.status(400).send({ error: "Invalid Credentials" });


        return res.status(200).send({ success: "Login Successful...!" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ error: "Server error...!" });
    }
});


module.exports = router