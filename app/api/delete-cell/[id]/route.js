import { NextResponse } from "next/server";
import dbConnection from "@/app/api/dbConnection";
import Content from "@/app/models/content";
import File from "@/app/models/file";

export async function DELETE(request, { params }) {
    try {
        await dbConnection()

        // Get cell id from the params
        const { id } = await params

        // Find the content to get the file reference
        const content = await Content.findById(id)

        if (!content) {
            return NextResponse.json({ message: "Cell not found" }, { status: 404 })
        }

        // Find the file associated with the content
        const file = await File.findById(content.file)

        if (!file) {
            return NextResponse.json({ message: "File not found" }, { status: 404 })
        }

        // Remove the specific cell from the file's content array
        file.content = file.content.filter(cellId => cellId.toString() !== id)

        // Save the updated file
        await file.save()

        // Delete the cell from the database
        await Content.findByIdAndDelete(id)

        return NextResponse.json({ message: "Cell deleted successfully" }, { status: 200 })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: "An error occurred while deleting the cell" }, { status: 500 })
    }
}