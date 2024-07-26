// routes/auth.js
const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const User = require("../models/User");

router.post("/login", async (req, res) => {
	const { email } = req.body;
	console.log(email);
	try {
		const result = await authService.createOTP(email);
		console.log(result);
		const { data } = result;

		if (result.success) {
			res.json({ message: "OTP sent successfully", data });
		} else {
			res.status(400).json({ error: result.error });
		}
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

router.post("/verify", async (req, res) => {
	const { userId, otp } = req.body;
	console.log("Verify request received for userId:", userId);

	try {
		const result = await authService.confirmOTP(userId, otp);
		console.log("confirmOTP result:", result);

		if (result.success) {
			try {
				let user = await User.findOne({ userId });
				if (!user) {
					user = new User({ userId });
					await user.save();
				}
				res.json({
					success: true,
					token: result.data.jwt,
					userId: result.data.userId,
				});
			} catch (dbError) {
				console.error("Database error:", dbError);
				res
					.status(500)
					.json({
						success: false,
						error: "Database error",
						details: dbError.message,
					});
			}
		} else {
			res
				.status(400)
				.json({ success: false, error: result.error, details: result.details });
		}
	} catch (error) {
		console.error("Server error in /verify:", error);
		res
			.status(500)
			.json({ success: false, error: "Server error", details: error.message });
	}
});

module.exports = router;
