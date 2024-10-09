import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			res.status(400).json({ message: "User doesn't exist!" });
		}

		if (password !== user.password) {
			res.status(400).json("Invalid credentials.");
		}

		const token = jwt.sign(
			{ email: user.email, id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.status(200).json({ user, token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong." });
	}
};

export const signup = async (req, res) => {
	const { email, password, confirmPassword, fullName } = req.body;

	try {
		const userExists = await User.findOne({ email });

		if (userExists)
			return res.status(400).json({ message: "User already exists." });

		if (password !== confirmPassword)
			return res.status(400).json({ message: "Passwords don't match." });

		const hashedPass = await bcrypt.hash(password, 12);

		const result = await User.create({
			email,
			password: hashedPass,
			name: fullName,
		});

		const token = jwt.sign(
			{ email: result.email, id: result._id },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.status(200).json({ result, token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong." });
	}
};

export const updateUser = async (req, res) => {
	const { userId } = req.body;
	const { fullName, email, role, username } = req.body;
	try {
		if (!userId) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				fullName,
				email,
				role,
				username,
			},
			{ new: true }
		);

		res.status(200).json({ updatedUser });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong." });
	}
};

export const forgotPassword = async (req, res) => {
	const { email } = req.params;
	const { newPassword } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		user.password = await bcrypt.hash(newPassword, 12);

		user.save();

		res.status(200).json({ message: "Password successfully changed!" });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong." });
	}
};

export const deleteUser = async (req, res) => {
	const { userId } = req.params;
	try {
		await User.findByIdAndRemove(userId);

		res.status(200).json({ message: "User deleted." });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong." });
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();

		res.status(200).json({ users });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong." });
	}
};

export const getUserById = async (req, res) => {
	const { userId } = req.params;
	try {
		const user = await User.findById(userId);

		if (!user) res.status(404).json({ message: "User not found." });

		res.status(200).json({ user });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong." });
	}
};
