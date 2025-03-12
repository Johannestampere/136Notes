import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    file: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    type: { type: String, enum: ["title", "h1", "h2", "text", "latex", "2d", "3d"], required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
});

const Content = mongoose.models.Content || mongoose.model("Content", contentSchema);

export default Content;