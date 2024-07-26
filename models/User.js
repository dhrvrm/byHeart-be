const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: { type: String },
	userId: [{ type: String }],
	otp: { type: String },
	otpExpires: { type: Date },
	words: [{ type: String }],
});

module.exports = mongoose.model("User", userSchema);
