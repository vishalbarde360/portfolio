const otpModel = require("../models/otp.model");
const { sendOtpEmail } = require("../utils/mailer");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OTP_EXPIRY_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 45;
const MAX_VERIFY_ATTEMPTS = 5;

const generateOtp = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};


// ================= SEND OTP =================

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Email validation
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Valid email is required"
            });
        }

        // Check resend cooldown
        const existing = await otpModel
            .findOne({ email })
            .sort({ createdAt: -1 });

        if (existing) {
            const secondsSinceLastSend =
                (Date.now() - existing.createdAt.getTime()) / 1000;

            if (secondsSinceLastSend < RESEND_COOLDOWN_SECONDS) {
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${Math.ceil(
                        RESEND_COOLDOWN_SECONDS - secondsSinceLastSend
                    )}s before requesting another OTP`
                });
            }

            // Delete old OTP
            await otpModel.deleteMany({ email });
        }

        // Generate OTP
        const otp = generateOtp();

        // OTP expires after 5 minutes
        const expiresAt = new Date(
            Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
        );

        // Save OTP
        const otpRecord = await otpModel.create({
            email,
            otp,
            expiresAt
        });

        try {

            // Send OTP using Resend
            await sendOtpEmail(email, otp);

            return res.status(200).json({
                success: true,
                message: "OTP sent to your email"
            });

        } catch (emailError) {

            // Delete OTP if email failed
            await otpModel.deleteOne({
                _id: otpRecord._id
            });

            console.error("OTP EMAIL ERROR:", emailError);

            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email"
            });
        }

    } catch (error) {

        console.error("SEND OTP ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= VERIFY OTP =================

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const record = await otpModel
            .findOne({ email })
            .sort({ createdAt: -1 });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "No OTP found. Please request a new one"
            });
        }

        // Already verified
        if (record.verified) {
            return res.status(200).json({
                success: true,
                message: "Email already verified"
            });
        }

        // OTP expired
        if (record.expiresAt.getTime() < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one"
            });
        }

        // Maximum attempts
        if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
            return res.status(429).json({
                success: false,
                message: "Too many attempts. Please request a new OTP"
            });
        }

        // Incorrect OTP
        if (record.otp !== String(otp).trim()) {

            record.attempts += 1;

            await record.save();

            return res.status(400).json({
                success: false,
                message: "Incorrect OTP"
            });
        }

        // Correct OTP
        record.verified = true;

        await record.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {

        console.error("VERIFY OTP ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    sendOtp,
    verifyOtp
};