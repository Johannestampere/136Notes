import { NextResponse } from "next/server";
import File from "@/app/models/file";
import dbConnection from "@/app/api/dbConnection";
import mongoose from "mongoose";
import Content from "@/app/models/content";

export async function GET(request, { params }) {
    try {
        // Connect to the database
        await dbConnection()

        const { id } = await params

        // Validate the file id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid file ID" },
                { status: 400 }
            );
        }

        // Find the file by id and populate the content field
        const file = await File.findById(id).populate("content");

        // Check if the file was found
        if (!file) {
            return NextResponse.json(
                { message: "File not found" },
                { status: 404 }
            );
        }

        // Return the file data to the frontend
        return NextResponse.json(
            { file },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred while fetching the file" },
            { status: 500 }
        );
    }
}