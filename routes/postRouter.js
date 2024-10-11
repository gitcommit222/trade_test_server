import express from "express";
import {
	getPosts,
	createPost,
	updatePost,
	deletePost,
	likePost,
} from "../controllers/postController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getPosts).post(auth, createPost);
router.route("/:id").put(auth, updatePost).delete(auth, deletePost);
router.patch("/:id/likePost", auth, likePost);

export default router;
