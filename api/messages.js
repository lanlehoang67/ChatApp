const express = require("express");
const connectdb = require("../dbconnection");
const Chats = require("../models/ChatSchema");

const router = express.Router();

router.get("/",(req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    console.log(req)
    connectdb.then(db => {
        Chats.find({room: req.query.room}).then(chat => {
            res.json(chat);
        })
    })
})
console.log('wtf')
module.exports = router;