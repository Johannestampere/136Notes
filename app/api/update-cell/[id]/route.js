import { NextResponse } from "next/server";
import dbConnection from "@/app/api/dbConnection";
import Content from "@/app/models/content";

export async function PUT(request, { params }) {
    try {
        await dbConnection();

        // Get cell id from the params
        const { id } = await params;

        // Get the cell data from the request body
        const { data } = await request.json();

        // Update the cell data in the database
        const updatedCell = await Content.findByIdAndUpdate(
            id,
            { data },
            { new: true }
        );

        if (!updatedCell) {
            return NextResponse.json({ message: "Cell not found" }, { status: 404 });
        }

        // Return the updated cell data to the frontend
        return NextResponse.json(updatedCell, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "An error occurred while updating the cell" }, { status: 500 });
    }
}