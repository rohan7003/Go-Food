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
const Order = require('../models/Order');     
const fetch = require('../middleware/fetchdetails');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || "HaHa";

// ROUTE 1: Create a new user at POST "/api/auth/createuser". No login required.
router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('location', 'Location is required').notEmpty()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, location } = req.body;

        // ✅ check duplicate
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                error: "Email already exists"
            });
        }

        // ✅ hash password
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);

        // ✅ create user
        user = await User.create({
            name,
            email,
            password: securePassword,
            location
        });

        // ✅ jwt
        const data = {
            user: { id: user.id }
        };

        const authToken = jwt.sign(data, jwtSecret);

        res.json({ success: true, authToken });

    } catch (error) {
        console.error("CREATE USER ERROR:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
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
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const data = {
            user: { id: userData.id }
        };

        const authToken = jwt.sign(data, jwtSecret);

        return res.json({ success: true, authToken });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// backend/Routes/Auth.js
// Find your '/orderData' route and replace it with this:

router.post('/orderData', fetch, async (req, res) => {
    try {
        let data = req.body.order_data;

        data.splice(0, 0, { Order_date: req.body.order_date });

        let userId = req.user.id;

        let existingOrder = await Order.findOne({ user_id: userId });

        if (!existingOrder) {
            await Order.create({
                user_id: userId,
                order_data: [data]
            });
        } else {
            await Order.findOneAndUpdate(
                { user_id: userId },
                { $push: { order_data: data } }
            );
        }

        res.json({ success: true });

    } catch (error) {
        console.error("ORDER ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;