// Code to get all files that belong to a user
// and return them in a JSON response to the frontend

import File from "../../models/file";
import User from "../../models/user";
import dbConnection from "../dbConnection";

export async function GET(request) {
    try {
        await dbConnection();

        // Get the email address from the query string
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        // Find the user based on the email address
        const user = await User.findOne({ email: email });

        // If the user doesn't exist, return a 404 status code
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Find all files that belong to the user based on the user's id
        const files = await File.find({ owner: user._id });

        // Return the files with a 200 status code
        return new Response(JSON.stringify({ files }), {
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