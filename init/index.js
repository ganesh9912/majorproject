const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js"); // adjust path if needed

// Use Atlas URL from environment variable
const mongo_url = process.env.MONGO_URL;

async function main() {
    try {
        await mongoose.connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.log("❌ MongoDB connection error:", err);
    }
}

main().then(() => initDB());

const initDB = async () => {
    try {
        // Clear existing listings
        await Listing.deleteMany({});

        // Add owner and default geometry if not present
        const dataWithDefaults = initData.data.map((obj) => ({
            ...obj,
            owner: "67a449f5f77031ba93c531b0", // default owner ID
            geometry: obj.geometry || { 
                type: "Point", 
                coordinates: [74.0060, 40.7128] // default coordinates
            }
        }));

        await Listing.insertMany(dataWithDefaults);
        console.log("✅ Data initialized successfully!");
        mongoose.connection.close(); // close connection after seeding
    } catch (err) {
        console.log("❌ Error initializing DB:", err);
    }
};
