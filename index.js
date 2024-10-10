import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

const PORT = 5000;

app.use(
	cors({
		origin: ["http://localhost:3000"],
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use("/users", userRouter);

const CONNECTION_URL = process.env.MONGO_URI;

mongoose
	.connect(CONNECTION_URL)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port: ${PORT}`);
		});
		console.log("DB Connected!");
	})
	.catch((error) => {
		console.log("Database connection failed:", error.message);
	});
