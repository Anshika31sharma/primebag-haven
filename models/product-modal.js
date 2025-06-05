const mongoose = require('mongoose');

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