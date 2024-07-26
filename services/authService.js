const { Client, Account, ID } = require("node-appwrite");

const client = new Client()
	.setEndpoint(process.env.APPWRITE_ENDPOINT)
	.setProject(process.env.APPWRITE_PROJECT_ID);

const account = new Account(client);

module.exports = {
	createOTP: async (email) => {
		try {
			const res = await account.createEmailToken(ID.unique(), email);
			console.log("send otp", res);

			return { success: true, data: res };
		} catch (error) {
			console.error("Error creating OTP:", error);
			return { success: false, error: error.message };
		}
	},

	confirmOTP: async (userId, secret) => {
		try {
			console.log("Confirming OTP for userId:", userId, "with secret:", secret);
			const result = await account.updateMagicURLSession(userId, secret);
			console.log("Raw verify result:", JSON.stringify(result, null, 2));

			if (result && result.$id) {
				return {
					success: true,
					data: {
						jwt: result.$id,
						userId: result.userId,
					},
				};
			} else {
				console.error("Invalid session data:", result);
				throw new Error("Invalid session data received");
			}
		} catch (error) {
			console.error("Error confirming OTP:", error);
			if (error.response) {
				console.error(
					"Error response:",
					JSON.stringify(error.response, null, 2)
				);
			}
			return {
				success: false,
				error: error.message,
				details: error.response
					? JSON.stringify(error.response)
					: "No additional details",
			};
		}
	},
};
