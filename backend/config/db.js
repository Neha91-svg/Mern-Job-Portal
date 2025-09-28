const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("🔎 MONGO_URI from .env:", process.env.MONGO_URI); // Debug log

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB Connected (Local Compass)");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
