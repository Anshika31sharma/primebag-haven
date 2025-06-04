const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose");
const config = require("config");

const uri = process.env.MONGODB_URI || `${config.get("MONGODB_URI")}/scatch`;

mongoose.connect(uri)
.then(function(){
    dbgr("Connected to MongoDB successfully");
})
.catch(function(err){
    dbgr(err);
})

module.exports = mongoose.connection
