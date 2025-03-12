// /api/delete-file

import { NextResponse } from "next/server";
import File from "@/app/models/file";
import dbConnection from "../dbConnection";
import mongoose from "mongoose";
import User from "@/app/models/user";
import Content from "@/app/models/content";

export async function DELETE(request) {
    try {
        // Connect to the database
        await dbConnection();

        // Extract the file ID from the query parameters
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const email = searchParams.get("email");

        // Validate the ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid file ID" },
                { status: 400 }
            );
        }   

        // Convert the ID to a MongoDB ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        // Delete the file from the database
        const result = await File.deleteOne({ _id: objectId });

        // Check if the file was deleted
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: "File not found" },
                { status: 404 }
            );
        }

        // Delete all the content associated with the file
        await Content.deleteMany({ file: objectId });

        // Find the user based on the email address
        const user = await User.findOne({ email: email });

        // Remove the file from the user's list of files
        user.files.pull(objectId);
        await user.save();

        return NextResponse.json(
            { message: "File deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred while deleting the file" },
            { status: 500 }
        );
    }
}