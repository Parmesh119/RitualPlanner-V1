const express = require('express')
const router = express.Router()

router.delete("/notes/modify/delete/:id", (req, res) => {
    const {confirm} = req.body
    try {
        res.status(200).send({success: "get"})
    } catch(error) {
        res.status(400).send({error: "not get"})
    }
})
module.exports = router