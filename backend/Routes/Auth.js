const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Order = require('../models/Order');
const fetch = require('../middleware/fetchdetails');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || "HaHa";


/* =========================
   ROUTE 1: CREATE USER
========================= */
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
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email already exists"
            });
        }

        // ✅ hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            location
        });

        // ✅ generate token
        const data = {
            user: { id: user.id }
        };

        const authToken = jwt.sign(data, jwtSecret);

        return res.json({ success: true, authToken });

    } catch (error) {
        console.error("CREATE USER ERROR:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


/* =========================
   ROUTE 2: LOGIN
========================= */
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
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


/* =========================
   ROUTE 3: ORDER DATA
========================= */
router.post('/orderData', fetch, async (req, res) => {
    try {
        let data = req.body.order_data;

        // add order date
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

        return res.json({ success: true });

    } catch (error) {
        console.error("ORDER ERROR:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


module.exports = router;