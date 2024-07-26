const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	otp: { type: String },
	otpExpires: { type: Date },
	words: [{ type: String }],
});

module.exports = mongoose.model("User", userSchema);
