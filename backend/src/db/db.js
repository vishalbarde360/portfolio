const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://bardevishal92_db_user:9wDgayqSd8BCpiea@cluster0.fauav54.mongodb.net/portfolio")
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;