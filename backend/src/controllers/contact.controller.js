const contactModel = require("../models/contact.model");
const otpModel = require("../models/otp.model");

const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


        if (name.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Name must be at least 3 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            });
        }

        if (message.length < 10) {
            return res.status(400).json({
                success: false,
                message: "Message must be at least 10 characters"
            });
        }

        // Email must be OTP-verified before the message is accepted
        const verifiedOtp = await otpModel.findOne({ email, verified: true }).sort({ createdAt: -1 });
        if (!verifiedOtp) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email with the OTP before sending a message"
            });
        }

        const contact = await contactModel.create({ name, email, message });

        // OTP is single-use for a submission — clear it so it can't be replayed
        await otpModel.deleteMany({ email });

        res.status(201).json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


module.exports = { createContact };