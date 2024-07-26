const express = require("express");
const { Client, Account, ID } = require("appwrite");

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Appwrite client
const client = new Client()
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject("669a15e2002a3f27b95a");

const account = new Account(client);

// Route for sending email OTP
app.post("/auth/login", async (req, res) => {
	const { email } = req.body;
	console.log("Email Recieved", email);
	if (!email) {
		return res.status(400).json({ error: "Email is required" });
	}

	try {
		const result = await account.createEmailToken(ID.unique(), email);
		console.log("Email Sent", result);

		res.json({ message: "OTP sent successfully", sessionId: result.$id });
	} catch (error) {
		console.error("Error sending OTP:", error);
		res.status(500).json({ error: "Failed to send OTP" });
	}
});

// Route for verifying OTP
app.post("/auth/verify", async (req, res) => {
	const { userId, secret } = req.body;

	if (!userId || !secret) {
		return res.status(400).json({ error: "User ID and secret are required" });
	}

	try {
		const result = await account.updateMagicURLSession(userId, secret);
		res.json({ message: "OTP verified successfully", session: result });
	} catch (error) {
		console.error("Error verifying OTP:", error);
		res.status(401).json({ error: "Invalid OTP" });
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
