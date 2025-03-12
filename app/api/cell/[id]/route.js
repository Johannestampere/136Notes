import dbConnection from "../../dbConnection";
import Content from "@/app/models/content";
import File from "@/app/models/file";

export const PUT = async (req, { params }) => {
    const { data } = await req.json()

    try {
        await dbConnection()
        const { id } = params
        const updatedCell = await Content.findByIdAndUpdate(
            id,
            { data },
            { new: true }
        );
        if (!updatedCell) {
            return new Response("Cell not found", { status: 404 })
        }
        return new Response(JSON.stringify(updatedCell), { status: 200 })
    } catch (error) {
        return new Response("Failed to update cell", { status: 500 })
    }
}

export const DELETE = async (req, { params }) => {
    try {
        await dbConnection()
        const { id } = params
        const deletedCell = await Content.findByIdAndDelete(id);
        if (!deletedCell) {
            return new Response("Cell not found", { status: 404 });
        }

        // Remove the cell reference from the file
        await File.updateOne(
            { content: id },
            { $pull: { content: id } }
        );

        return new Response("Cell deleted successfully", { status: 200 })
    } catch (error) {
        return new Response("Failed to delete cell", { status: 500 })
    }
}