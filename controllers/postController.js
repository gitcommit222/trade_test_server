import mongoose from "mongoose";
import PostMessage from "../models/postModel.js";

export const getPosts = async (req, res) => {
	try {
		const postMessages = await PostMessage.find().populate("creator");
		res.status(200).json(postMessages);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const createPost = async (req, res) => {
	const post = req.body;

	console.log(req.user);
	const newPost = await PostMessage.create({
		...post,
		creator: req.user.id,
		createdAt: new Date().toISOString(),
	});
	try {
		await newPost.save();

		res.status(201).json({ newPost });
	} catch (error) {
		res.status(409).json({ meesage: error.message });
	}
};

export const updatePost = async (req, res) => {
	const { id: _id } = req.params;
	const post = req.body;
	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).json({ message: `No post with id of ${_id}` });

	const updatedPost = await PostMessage.findByIdAndUpdate(
		_id,
		{ ...post, _id },
		{
			new: true,
		}
	);

	res.status(201).json(updatedPost);
};

export const deletePost = async (req, res) => {
	const { id: _id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).json({ message: `No post with id of ${_id}` });

	await PostMessage.findByIdAndDelete(_id);

	res.status(200).json({ message: "Post deleted succesfully!" });
};

export const likePost = async (req, res) => {
	const { id: _id } = req.params;

	if (!req.user?.id) return res.json({ message: "Unauthenticated" });

	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).json({ message: `No post with id of ${_id}` });

	const post = await PostMessage.findById(_id);

	const index = post.likes.findIndex((id) => id === String(req.user?.id));

	if (index === -1) {
		// like the post
		post.likes.push(req.user?.id);
	} else {
		// dislike a post
		post.likes = post.likes.filter((id) => id !== String(req.user?.id));
	}

	const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
		new: true,
	});
	res.status(200).json(updatedPost);
};
