const jwt = require('jsonwebtoken');
const userModal = require('../models/user-modal');

module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        req.flash('error', 'You must be logged in to access this page');
        return res.redirect('/');
    }
    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModal.findOne({email: decoded.email})
        .select("-password");
        if (!user) {
            req.flash('error', 'User not found, please log in again');
            return res.redirect('/');
        }
        req.user = user;
        next()
    } catch(err){
        req.flash('error', 'Invalid token, please log in again');
        return res.redirect('/');
    }
    }