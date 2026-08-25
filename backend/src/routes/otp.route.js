const otpRoute = require("express").Router();
const { sendOtp, verifyOtp } = require("../controllers/otp.controller");

otpRoute.post("/send", sendOtp);
otpRoute.post("/verify", verifyOtp);

module.exports = otpRoute;
