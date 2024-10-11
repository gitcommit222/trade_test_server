import mongoose, { Schema } from "mongoose";

const postSchema = mongoose.Schema({
	title: String,
	message: String,
	name: String,
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	tags: [String],
	selectedFile: String,
	videoLinks: String,
	likes: {
		type: [String],
		default: [],
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

var PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
