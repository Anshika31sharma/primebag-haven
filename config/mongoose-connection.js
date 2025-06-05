const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose");
const config = require("config");

const uri = config.get("MONGODB_URI");
console.log("MongoDB URI:", uri);
mongoose.connect(uri)
.then(function () {
  dbgr("Connected to MongoDB successfully");
})
.catch(function (err) {
  dbgr("MongoDB connection error:", err);
});

module.exports = mongoose.connection;
