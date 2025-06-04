const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const {loginUser, registerUser,logout} = require('../controllers/authController');

router.get('/', (req, res) => {
    res.send("hey users");
});
router.post('/register',registerUser);
router.post("/login",loginUser)
router.get('/logout', logout);

module.exports = router;