const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

const sendOtpEmail = async (toEmail, otp) => {
    console.log("SMTP: sending OTP to:", toEmail);

    try {
        const info = await transporter.sendMail({
            from: `"Vishal Barde Portfolio" <${process.env.SMTP_EMAIL}>`,
            to: toEmail,
            subject: "Your OTP for Email Verification",

            html: `
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>

                <h1>${otp}</h1>

                <p>This OTP is valid for 5 minutes.</p>
            `,
        });

        console.log("SMTP: Email sent:", info.messageId);

        return info;
    } catch (error) {
        console.error("SMTP ERROR:", error);
        throw error;
    }
};

module.exports = { sendOtpEmail };