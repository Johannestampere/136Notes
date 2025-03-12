// In Next.js, API routes are stored in the app/api directory
// when using the app router, which I'm using here
// This file is to create the API route new-user 

import dbConnection from '../dbConnection.js';
import User from "../../models/user.js";
import { NextResponse } from 'next/server';

// POST request to create a new user
export async function POST(request) {
    try {
        // Connect to the database
        await dbConnection();
        
        const { email, name, id } = await request.json();

        let user = await User.findOne({ email: email });

        // Create a new user if they don't exist
        // folders, files, and recentFiles are empty arrays
        if (!user) {
            user = new User({
            email,
            name,
            id, 
            files: [],
            recentFiles: [],
            });

            await user.save();

            // Return the user object and a 201 status code
            return NextResponse.json({ message: "User created", user }, { status: 201 });
            
            // If they exist already, return the user object and a 200 status code
        } else {
            return NextResponse.json({ message: "User found", user }, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while processing the request' }, { status: 500 });
    }
}