const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		res.json(user.words);
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

router.post("/", auth, async (req, res) => {
	const { word } = req.body;
	try {
		const user = await User.findById(req.user.id);
		user.words.push(word);
		await user.save();
		res.json(user.words);
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

router.delete("/:word", auth, async (req, res) => {
	const wordToDelete = req.params.word;
	try {
		const user = await User.findById(req.user.id);
		user.words = user.words.filter((word) => word !== wordToDelete);
		await user.save();
		res.json(user.words);
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

module.exports = router;
