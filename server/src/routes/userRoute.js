const express = require("express")
const cors = require("cors")
const bcrypt = require('bcryptjs')
const User = require("../models/user")
const validate = require('../middleware/validate-signup')
const signupSchema = require('../validation/signup')
const jwt = require('jsonwebtoken')

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
        
        if (user) {
            
            if (user.email === email) return res.status(400).send({ error: "Email is already taken." });
            if (user.username === username) return res.status(400).send({ error: "Username is already taken." });
            if (user.number.toString() === number.toString()) return res.status(400).send({ error: "Number is already taken." });
            if (user.password === password) return res.status(400).send({ error: "Password is already taken." });
        }

        user = new User({ username, name, email, number, password });
        await user.save()

        const payLoad = {user : {id: user.id, email: user.email }}
        jwt.sign(
            payLoad, 
            process.env.SECRET_KEY,
            {
                expiresIn: 3000
            },
            (err, token) => {
                if(err) throw err

                res.json({success: "Account Created Successfully...!", token})
            }
        )
    } catch(error) {
        console.log(error.message)
        res.status(500).send({error: "Server error...!"})
    }

});

router.post("/login", async (req, res) => {
    const { credentials, password } = req.body;

    try {
        let user;
"token"
        if (!isNaN(credentials)) {
            user = await User.findOne({ number: credentials });
        } else {
            user = await User.findOne({
                $or: [{ email: credentials }, { username: credentials }]
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!user || !isMatch) return res.status(400).send({ error: "Invalid Credentials" });

        const payload = { user: { id: user.id, email: user.email}}

        jwt.sign(
            payload, 
            process.env.SECRET_KEY,
            {expiresIn: 3000},
            (err, token) => {
                if (err) throw err
                return res.status(200).send({ success: "Login Successful...!" , token});
            }
        )
    } catch (error) {
        return res.status(500).send({ error: "Server error...!" });
    }
});

router.post("/verifyuser", async (req, res) => {
    try {
        const token = req.body.token;
    
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
          if (err) {
            return res
              .status(401)
              .json({ isValid: false, error: "Invalid token" });
          }
          res.json({ isValid: true, decoded });
        });
      } catch (error) {
        return res.status(500).send({error: "Server error...!"});
      }
})

module.exports = router