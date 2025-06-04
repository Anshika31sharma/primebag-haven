const express = require('express');
const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
fullName:String,
email:String,
password:String,
cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"
    },
    quantity: {
      type: Number,
      default: 1
    }
}],
orders:{
    type: Array,
    default: []
},
contact: Number,
picture:String
})
module.exports = mongoose.model("user", userSchema);