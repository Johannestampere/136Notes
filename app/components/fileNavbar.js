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
        <nav className="bg-neutral-900 border-b border-neutral-800 p-4 shadow-2xl rounded-t-2xl">
            <div className="flex items-center justify-between">
                <button onClick={() => router.push("/dashboard")} className="text-white text-2xl font-bold no-underline tracking-tight hover:text-neutral-300 transition-colors">
                    136Notes
                </button>
                <div className="flex gap-4">
                    <div className="text-white text-2xl font-bold">{name}</div>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleSignOut} className="bg-black text-white rounded-2xl border border-neutral-700 px-4 py-2 shadow hover:bg-neutral-800 transition-colors transform transition-transform duration-150 hover:scale-105 hover:shadow-2xl font-semibold">Sign out</button>
                </div>
            </div>
        </nav>
    );
}