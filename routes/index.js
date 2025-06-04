const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Product = require('../models/product-modal');
const productModal = require('../models/product-modal');
const userModel = require('../models/user-modal');
const user = require('../models/user-modal');
router.get('/', (req, res) => {
    let error = req.flash('error');
    res.render('./index',{error , loggedin:false});
});
router.get("/shop",isLoggedIn, async function(req, res) {
  let query = {};
  let sort = {};

  // Filtering
  if (req.query.filter === "new") {
    // Example: show products added in the last 30 days (requires createdAt field)
    // For now, just sort by newest and limit to 8
    sort = { _id: -1 };
  } else if (req.query.filter === "discount") {
    query.discount = { $gt: 0 };
  } else if (req.query.filter === "available") {
    // Assuming all products are available, or add your own logic here
    // For demo, show all products (or add a field like 'inStock' to filter)
  }
  // Sorting
  if (req.query.sortby === "newest") {
    sort = { _id: -1 };
  } else if (req.query.sortby === "popular") {
    // No popularity field, so default sort (could add later)
    sort = {};
  }

  let products = await productModal.find(query).sort(sort);
  let success = req.flash("success");
  res.render('shop', { products, success, loggedin: true, sortby: req.query.sortby || '', filter: req.query.filter || '' });
});
router.get("/addtocart/:id",isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({ email: req.user.email });
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect('/shop');
  }
  // Check if product already in cart
  let found = user.cart.find(item => {
    if (!item.product) return false;
    return item.product.toString() === req.params.id;
  });
  if (found) {
    found.quantity += 1;
  } else {
    user.cart.push({ product: req.params.id, quantity: 1 });
  }
  await user.save();
  req.flash("success", "Product added to cart successfully");
  res.redirect('/shop');
});

router.post("/cart/increment/:id", isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({ email: req.user.email });
  let found = user.cart.find(item => {
    if (!item.product) return false;
    return item.product.toString() === req.params.id;
  });
  if (found) found.quantity += 1;
  await user.save();
  res.redirect('/cart');
});

router.post("/cart/decrement/:id", isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({ email: req.user.email });
  let found = user.cart.find(item => {
    if (!item.product) return false;
    return item.product.toString() === req.params.id;
  });
  if (found && found.quantity > 1) {
    found.quantity -= 1;
  } else if (found) {
    // Remove the item even if quantity is 1
    user.cart = user.cart.filter(item => item.product && item.product.toString() !== req.params.id);
  }
  await user.save();
  res.redirect('/cart');
});

router.post("/cart/checkout", isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({ email: req.user.email }).populate('cart.product');
  if (!user.cart.length) return res.redirect('/cart');
  user.orders.push({ items: user.cart, date: new Date() });
  user.cart = [];
  await user.save();
  req.flash('success', 'Order placed successfully!');
  res.redirect('/shop');
});

router.post("/cart/checkout/:id", isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({ email: req.user.email }).populate('cart.product');
  const productId = req.params.id;
  // Find the cart item
  let found = user.cart.find(item => item.product && item.product.toString() === productId);
  if (!found) return res.redirect('/cart');
  // Add to orders
  user.orders.push({ items: [found], date: new Date() });
  // Remove from cart
  user.cart = user.cart.filter(item => item.product && item.product.toString() !== productId);
  await user.save();
  req.flash('success', 'Order placed successfully!');
  res.redirect('/shop');
});

router.get("/cart", isLoggedIn, async function(req, res) {
  let user = await userModel.findOne({ email: req.user.email }).populate('cart.product');
  const bill = user.cart.reduce((acc, item) => {
    const product = item.product;
    if (!product) return acc; // skip if product is missing
    return acc + ((product.price - (product.discount || 0) + 20) * (item.quantity || 1));
  }, 0);
  res.render('cart', { user, bill });
});
router.get('/logout', (req, res) => {
    res.render('logout');
});

module.exports = router;