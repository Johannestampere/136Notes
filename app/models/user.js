import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    recentFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;