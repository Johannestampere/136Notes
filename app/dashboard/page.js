"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Link from "next/link"

export default function Dashboard() {
    const router = useRouter()
    const { data: session } = useSession()
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(true)
    

    const fetchFiles = async () => {
        if (session?.user?.email) {
            try {
                const response = await fetch(`/api/files?email=${session.user.email}`)
                const data = await response.json()
                if (data.files) {
                    setFiles(data.files)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
    }

    // Function to delete a file
    const deleteFile = async (id) => {
        try {
            const response = await fetch(`/api/delete-file?id=${id}&email=${session.user.email}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchFiles();
            } else {
                const errorData = await response.json();
                console.error("Failed to delete file:", errorData.message);
            }
        } catch (err) {
            console.error("Error deleting file:", err);
        }
    };

    useEffect(() => {
        if (!session) {
            router.push("/")
        } else if (!session.user) {
            signOut()
        } else {
            fetchFiles()
        }
    }, [session, router])

    if (!session) {
        return null
    }

    return (
        <div className="flex min-h-screen bg-gray-900">
            <Navbar refreshFiles={fetchFiles} />
            <div className="flex-1 p-6 ml-64">
                <h1 className="text-green-400 text-3xl mb-6">Welcome to your dashboard, {session.user.email}</h1>
                <h2 className="text-green-400 text-2xl mb-4">Your Files</h2>
                
                {loading ? (
                    <div className="text-gray-400 italic"></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {files.length > 0 ? (
                            files.map((file, index) => (
                                <div 
                                    key={index} 
                                    className="group bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
                                >
                                    <Link className="text-lg font-semibold text-green-400" href={`/dashboard/file/${file._id}`}>{file.name}</Link>
                                    
                                    <div 
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xl"
                                        onClick={() => deleteFile(file._id)}
                                    >
                                        🗑️
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 italic">You have not created any files yet :(</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}