const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-modal');

if(process.env.NODE_ENV === 'development') {
    router.post('/create', async function (req, res) {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(503).send("Owners already exist");
        }
        const { fullName, email, password } = req.body;
        try {
            let createdOwner = await ownerModel.create({
                fullName, email, password
            });
            res.status(201).send(createdOwner);
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    });
}
router.get('/admin', (req, res) => {
 let success=  req.flash("success");
    res.render("createproducts", { success});
});
module.exports = router;