const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Product = require('../models/product-modal');
const productModal = require('../models/product-modal');

router.get('/', (req, res) => {
    let error = req.flash('error');
    res.render('./index',{error})
});
router.get("/shop",isLoggedIn, async function(req, res) {
 let products =  await productModal.find()
   res.render('shop', { products });
});
router.get('/logout', (req, res) => {
    res.render('logout');
});

module.exports = router;