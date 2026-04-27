const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require("./db");
const cors = require('cors');

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options('*', cors());
// Connect to MongoDB and fetch data
mongoDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./Routes/Auth'));
app.get('/api/DisplayData', (req, res) => {
    try {
        res.send([global.food_items, global.foodCategory]);
    } catch (error) {
        console.error(error.message);
        res.send("Server Error");
    }
});

// Default Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start Server
app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});