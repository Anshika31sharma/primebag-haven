const express = require('express');
const mongoose = require('mongoose');
mongoose.connect9("mogodb://127.0.0.1:27017/scatch");

const userSchema =  mongoose.Schema({
fullName:String,
email:String,
password:String,
cart:{
    type: Array,
    default: []
},
isAdmin:Boolean,
orders:{
    type: Array,
    default: []
},
contact: Number,
picture:String
})
module.exports = mongoose.model("user", userSchema);