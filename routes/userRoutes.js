import express from "express";
import {
	deleteUser,
	forgotPassword,
	getAllUsers,
	getUserById,
	signin,
	signup,
	updateUser,
} from "../controllers/userController.js";
import { auth, authorizeRoles } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

userRouter.put("/:userId", auth, authorizeRoles(["admin"]), updateUser);

userRouter.put("/:email", forgotPassword);

userRouter.delete("/:userId", auth, authorizeRoles(["admin"]), deleteUser);

userRouter.get("/", auth, authorizeRoles(["admin"]), getAllUsers);

userRouter.get("/:userId", auth, getUserById);

export default userRouter;
