const express = require('express');

const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/generateToken');
const userModal = require('../models/user-modal');

module.exports.registerUser =  async (req, res) => {
 try{
     let {email,fullName,password} = req.body;
    let user = await userModal.findOne({email:email})
     if (user) {
         req.flash('error', 'user already exists');
         return res.redirect('/'); 
     }
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(password, salt);
     let newUser = await userModal.create({
         fullName,
         email,
         password: hash // Save hashed password
     });
     let token =  generateToken(newUser);
     res.cookie("token",token);
     return res.redirect('/shop');
 } catch(err){
     console.log(err.message);
     req.flash('error', 'Registration failed. Please try again.');
     return res.redirect('/');
 }
}
module.exports.loginUser = async function (req, res) {
    if (req.cookies && req.cookies.token) {
        return res.redirect('/shop');
    }
    let {email, password} = req.body;
    let user = await userModal.findOne({ email: email });
    if (!user) {
        req.flash('error', 'incorrect email or password');
        return res.redirect('/users/login');
    }
    console.log('Login attempt:', { email, userFound: !!user, userPassword: user.password, jwtKey: process.env.JWT_KEY });
    bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
            console.error('Bcrypt compare error:', err);
            req.flash('error', 'Internal server error. Please try again.');
            return res.status(500).redirect('/users/login');
        }
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token);
            return res.redirect('/shop');
        }
        req.flash('error', 'incorrect email or password');
        return res.redirect('/users/login');
    });
}

module.exports.logout = function (req, res) {
    res.cookie("token","");
    res.redirect('/');
}
