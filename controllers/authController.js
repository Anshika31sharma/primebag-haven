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
         return res.redirect('/'); // Redirect to home or registration page
     }
     bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(password,salt,async function(err,hash){
        if(err) return res.send(err.message); 
        else{
               let user = await userModal.create({
         fullName,
         email,
         password: hash // Save hashed password
     });
  let token =  generateToken(user);
  res.cookie("token",token);
  res.send("user created successfully");
        }
       
     })
    })
  
 } catch(err){
     console.log(err.message);
 }

}
module.exports.loginUser = async function (req, res) {
    let {email,password} = req.body;
    let user = await userModal.findOne({email:email});
    if(!user) {
        req.flash('error', 'incorrect email or password');
        return res.redirect('/');
    }
    bcrypt.compare(password,user.password,function(err,result){
        if(result){
            let token = generateToken(user);
            res.cookie("token",token);
            // Redirect to shop or dashboard after successful login
            return res.redirect('/shop');
        }
        req.flash('error', 'incorrect email or password');
        return res.redirect('/');
    })
}

module.exports.logout = function (req, res) {
    res.cookie("token","");
    res.redirect('/');
}
