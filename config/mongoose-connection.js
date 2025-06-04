const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose");
const config = require("config");
const MONGODB_URI = require("./development.json")

const uri = MONGODB_URI ;


mongoose.connect(uri)
.then(function(){
    dbgr("Connected to MongoDB successfully");
})
.catch(function(err){
    dbgr(err);
})

module.exports = mongoose.connection
