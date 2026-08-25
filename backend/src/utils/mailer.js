const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (toEmail, otp) => {
    console.log("RESEND: Sending OTP to:", toEmail);

    const { data, error } = await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: [toEmail],
        subject: "Your OTP for Email Verification",

        html: `
            <h2>Email Verification</h2>

            <p>Your OTP is:</p>

            <h1>${otp}</h1>

            <p>This OTP is valid for 5 minutes.</p>
        `
    });

    if (error) {
        console.error("RESEND ERROR:", error);
        throw new Error(error.message);
    }

    console.log("RESEND EMAIL SENT:", data);

    return data;
};

module.exports = { sendOtpEmail };