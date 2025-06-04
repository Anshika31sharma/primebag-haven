const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-modal");

router.post("/create", upload.single("image"), async function (req, res) {
 try{
   let { image, name, price, discount, bgcolor, panelcolor, textcolor } =
    req.body;
  let product = await productModel.create({
    image: req.file.buffer,
    name,
    price,
    discount: discount ? parseInt(discount) : 0,
    bgcolor,
    panelcolor,
    textcolor,
  });
  req.flash("success", "Product created successfully");
  res.redirect("/owners/admin");
 } catch (err) {
  res.status(500).send({ error: err.message });
 }
});

module.exports = router;
