const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD, // Gmail App Password, not your normal password
    },
});

const sendOtpEmail = async (toEmail, otp) => {
    await transporter.sendMail({
        from: `"Vishal Barde Portfolio" <${process.env.SMTP_EMAIL}>`,
        to: toEmail,
        subject: "Your OTP for email verification",
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
                <h2 style="color:#4f46e5;">Verify your email</h2>
                <p>Use the OTP below to verify your email address. This OTP is valid for 5 minutes.</p>
                <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color:#111;">${otp}</p>
                <p style="color:#666; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        `,
    });
};

module.exports = { sendOtpEmail };
