const express = require('express');
const mongoose = require('mongoose');
// Fix typo in mongoose.connect
mongoose.connect("mongodb://127.0.0.1:27017/scatch");

const ProductSchema =  mongoose.Schema({
image: Buffer,
name: String,
price: Number,
discount: {
    type: Number,
    default: 0
},
bgcolor: String,
panelcolor: String,
textcolor: String,
createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model("product", ProductSchema);