import File from "../../models/file";
import User from "../../models/user";
import dbConnection from "../dbConnection";

export async function POST(request) {
    try {
        await dbConnection();

        // Parse the frontend request body as JSON
        const { nameFrontend, ownerFrontend } = await request.json();

        // Find the user based on the email address
        const user = await User.findOne({ email: ownerFrontend });

        // If the user doesn't exist, return a 404 status code
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Create a new file
        const file = new File({
            name: nameFrontend,
            owner: user._id,
        });

        // Save the file to the database
        await file.save();

        // Add the file to the concrete user's files array
        user.files.push(file._id);
        await user.save();

        // Return the created file with a 200 status code
        return new Response(JSON.stringify({ file }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "An error occurred while processing the request" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}