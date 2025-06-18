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
        <div className="w-64 h-screen bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col items-center shadow-2xl rounded-r-2xl">
            <div className="mb-8 text-center">
                <Link href="/dashboard" className="text-white text-2xl font-bold no-underline tracking-tight">
                    136Notes
                </Link>
            </div>

            <div className="w-full flex-grow flex flex-col items-center justify-center gap-4">
                <input 
                    type="text" 
                    value={fileName} 
                    onChange={(e) => setFileName(e.target.value)} 
                    placeholder="New file name"
                    className="w-full p-3 rounded-2xl border border-neutral-700 outline-none bg-black text-white text-center text-lg mb-4 shadow"
                />
                <button 
                    onClick={handleCreateFile} 
                    className="w-16 h-16 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors text-3xl font-bold flex items-center justify-center shadow-lg border border-neutral-700 transform transition-transform duration-150 hover:scale-110 hover:shadow-2xl"
                >
                    +
                </button>
            </div>

            <div className="w-full mt-auto">
                <div className="text-white text-lg p-2 rounded-2xl hover:bg-neutral-800 transition-colors cursor-pointer text-center mb-4">
                    Recents
                </div>

                {session && (
                    <button 
                        onClick={handleSignOut} 
                        className="w-full p-2 bg-black text-white rounded-2xl border border-neutral-700 hover:bg-neutral-800 transition-colors shadow transform transition-transform duration-150 hover:scale-105 hover:shadow-2xl"
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </div>
    );
}