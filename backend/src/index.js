const express = require("express");
const dotenv = require("dotenv");
const contactRoute = require("./routes/contact.route");
const otpRoute = require("./routes/otp.route");
const connectDB = require("./db/db");
const cors = require("cors")


dotenv.config();
connectDB();
const app = express();


app.use(
    cors({
        origin: [
            "https://vishalbarde.vercel.app",
            "https://vishalbarde-portfolio.vercel.app",
            "https://vishalbarde-dashboard.vercel.app"

        ],
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
})
app.use("/api/contact", contactRoute);
app.use("/api/otp", otpRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});