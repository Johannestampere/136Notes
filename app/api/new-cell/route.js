import { NextResponse } from "next/server";
import dbConnection from "@/app/api/dbConnection";
import Content from "@/app/models/content";
import File from "@/app/models/file";

export async function POST(request) {
    try {
        // Connect to the db
        await dbConnection();

        // Gets the file objectid and cell content type from the request body
        const { fileId, type } = await request.json();

        // Validates the file ID and type
        if (!fileId || !type) {
            return NextResponse.json({ message: "File ID and type are required" }, { status: 400 });
        }

        // Create a new empty cell
        const newContent = new Content({
            file: fileId,
            type,
            data: "",
        });

        // Save the new cell
        await newContent.save();

        // Update the file with the new cell data
        const file = await File.findById(fileId);
        file.content.push(newContent._id);
        await file.save();

        return NextResponse.json({ _id: newContent._id, message: "Content cell added successfully" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "An error occurred while adding the content cell" }, { status: 500 });
    }
}