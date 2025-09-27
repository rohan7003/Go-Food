// // backend/Routes/Auth.js

// const express = require('express')
// const User = require('../models/User')
// const Order = require('../models/Order') // This line is correct
// const router = express.Router()
// const { body, validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs')
// var jwt = require('jsonwebtoken');
// const axios = require('axios')
// const fetch = require('../middleware/fetchdetails');
// const jwtSecret = "HaHa"

// // ... (rest of your file is okay) ...

// module.exports = router

// backend/Routes/Auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwtSecret = "HaHa"; // You should use a more secure secret, preferably from an environment variable

// ROUTE 1: Create a new user at POST "/api/auth/createuser". No login required.
router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let securePassword = await bcrypt.hash(req.body.password, salt);

    try {
        const newUser = await User.create({
            name: req.body.name,
            password: securePassword,
            email: req.body.email,
            location: req.body.location
        });

        const data = { user: { id: newUser.id } };
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success: true, authToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "An error occurred" });
    }
});

// ROUTE 2: Authenticate a user at POST "/api/auth/login". No login required.
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ errors: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).json({ errors: "Invalid credentials" });
        }

        const data = { user: { id: userData.id } };
        const authToken = jwt.sign(data, jwtSecret);
        return res.json({ success: true, authToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "An error occurred" });
    }
});

// backend/Routes/Auth.js
// Find your '/orderData' route and replace it with this:

router.post('/orderData', fetch, async (req, res) => { // 1. Added 'fetch' middleware
    let data = req.body.order_data;
    await data.splice(0, 0, { Order_date: req.body.order_date });

    // 2. Get the user ID from the middleware instead of the email from the body
    let userId = req.user.id;

    let existingOrder = await Order.findOne({ 'user_id': userId });

    if (existingOrder === null) {
        // If it's the user's first order, create a new document
        try {
            await Order.create({
                user_id: userId,
                order_data: [data]
            });
            res.json({ success: true });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error: " + error.message);
        }
    } else {
        // If the user has ordered before, update their existing document
        try {
            await Order.findOneAndUpdate(
                { user_id: userId },
                { $push: { order_data: data } }
            );
            res.json({ success: true });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Server Error: " + error.message);
        }
    }
});

module.exports = router;