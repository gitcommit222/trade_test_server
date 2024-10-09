import { Schema, model } from "mongoose";

const userSchema = new Schema({
	name: String,
	email: String,
	username: {
		type: String,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: "user",
	},
});

const User = model("User", userSchema);

export default User;
