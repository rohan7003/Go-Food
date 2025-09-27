const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://gofood:gofood1@cluster1.8nfvshu.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster1';

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("✅ Connected to MongoDB");

        const foodCollection = await mongoose.connection.db.collection("food_items");
        const data = await foodCollection.find({}).toArray();

        const categoryCollection = await mongoose.connection.db.collection("foodCategory");
        const Catdata = await categoryCollection.find({}).toArray();

        global.food_items = data;
        global.foodCategory = Catdata;

        // This will help you see if data is being fetched
        console.log("Data fetched from collections.");

    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
};

module.exports = mongoDB;