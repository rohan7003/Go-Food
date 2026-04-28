const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const mongoDB = require("./db");
const cors = require('cors');
require('dotenv').config(); // ✅ important for env variables

// 🔹 Connect to MongoDB
mongoDB();

// 🔹 Middleware (ORDER MATTERS)
app.use(express.json()); // parse JSON first

// 🔹 CORS (use only ONCE)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// 🔹 Routes
app.use('/api/auth', require('./Routes/Auth'));

app.get('/api/DisplayData', (req, res) => {
    try {
        res.send([global.food_items, global.foodCategory]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// 🔹 Default route
app.get('/', (req, res) => {
    res.send('Backend is running ✅');
});

// 🔹 Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});