"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar({ refreshFiles }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [fileName, setFileName] = useState("");

    const handleCreateFile = async () => {
        if (!session) {
            router.push("/");
            return;
        }

        // Create a new file with the name in the input field
        try {
            const response = await fetch("/api/new-file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Send the file name and the owner's email to the backend
                body: JSON.stringify({
                    nameFrontend: fileName,
                    ownerFrontend: session.user.email,
                }),
            });

            // If the file was created successfully, refresh the file list and the input field
            if (response.ok) {
                const data = await response.json();
                setFileName("");
                refreshFiles();
            } else {
                console.error('Failed to create file');
            }
        } catch (e) {
            console.error(e);
        }
    };


    const handleSignOut = async () => {
        await signOut({ redirect: false, callbackUrl: "/" });
        router.push("/");
    };

    return (
        <div className="w-64 h-screen bg-gray-800 p-5 flex flex-col items-center shadow-lg">
            <div className="mb-8 text-center">
                <Link href="/dashboard" className="text-green-400 text-2xl font-bold no-underline">
                    136Notes
                </Link>
            </div>

            <div className="w-full flex-grow flex flex-col items-center justify-center gap-4">
                <input 
                    type="text" 
                    value={fileName} 
                    onChange={(e) => setFileName(e.target.value)} 
                    placeholder="New file name"
                    className="w-full p-3 rounded border-none outline-none bg-gray-700 text-green-400 text-center text-lg mb-4"
                />
                <button 
                    onClick={handleCreateFile} 
                    className="w-16 h-16 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors text-3xl font-bold flex items-center justify-center"
                >
                    +
                </button>
            </div>

            <div className="w-full mt-auto">
                <div className="text-green-400 text-lg p-2 rounded hover:bg-gray-700 transition-colors cursor-pointer text-center mb-4">
                    Recents
                </div>

                {session && (
                    <button 
                        onClick={handleSignOut} 
                        className="w-full p-2 bg-green-800 text-green-400 rounded hover:bg-green-900 transition-colors"
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </div>
    );
}