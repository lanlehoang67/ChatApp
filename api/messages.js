const express = require("express");
const connectdb = require("../dbconnection");
const Chats = require("../models/ChatSchema");

const router = express.Router();

router.get("/",(req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    connectdb.then(db => {
        console.log('ok')
        Chats.find({}).then(chat => {
            res.json(chat);
        })
    })
})
console.log('wtf')
module.exports = router;