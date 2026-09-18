const mongoose = require("mongoose")
const dns = require("dns")

// Ensure MongoDB Atlas SRV records resolve cleanly on Windows
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"])
} catch (e) {
    // fallback to system default if not supported
}

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database")
    }
    catch (err) {
        console.log("Database connection error:", err.message)
    }
}

module.exports = connectToDB