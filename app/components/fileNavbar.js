import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function FileNavbar({ name }) {
    const router = useRouter();
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut({ redirect: false, callbackUrl: "/" });
        router.push("/");
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="flex items-center justify-between">
                <button onClick={() => router.push("/dashboard")} className="text-green-400 text-2xl font-bold no-underline">
                    136Notes
                </button>
                <div className="flex gap-4">
                    <div className="text-white text-2xl font-bold">{name}</div>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleSignOut} className="text-green-400">Sign out</button>
                </div>
            </div>
        </nav>
    );
}