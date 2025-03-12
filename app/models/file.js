import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: String,
    owner: String,
    content: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const File = mongoose.models.File || mongoose.model("File", fileSchema);

export default File;