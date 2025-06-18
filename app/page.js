"use client"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { useEffect, useCallback } from "react"
import "@/app/globals.css" 
import Image from 'next/image'
import latexlogo from "@/public/LaTeX_logo.svg.png"
import threejslogo from "@/public/threejs.png"
import mathjaxlogo from "@/public/mathjax.png"

const HomePage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleSignIn = useCallback(async () => {
    if (!session?.user) return

    try {
      const response = await fetch("/api/new-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: session.user.email, 
          name: session.user.name, 
          id: session.user.id 
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        router.push("/dashboard");
      } else {
        throw new Error('Failed to create/fetch user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [session, router]);

  useEffect(() => {
    if (session?.user) {
      handleSignIn();
    }
  }, [session, handleSignIn]);
  
  if (status === "loading") {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (session) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center bg-neutral-900/80 rounded-2xl shadow-2xl p-10 border border-neutral-800">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            136Notes
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-neutral-300">
            Dynamic Linear Algebra Note-Taking App for Visual Learners
          </p>
          <div className="mt-8">
            <button
              onClick={() => signIn("google")}
              className="group relative w-full flex justify-center py-3 px-4 border border-white text-lg font-medium rounded-full text-black bg-white hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-150 ease-in-out shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-end pb-8 mt-auto">
        <div className="flex flex-row space-x-12">
          <Image 
            src={latexlogo} 
            alt="LaTeX Logo" 
            width={80} 
            height={80} 
            priority
            className="object-contain filter brightness-0 invert"
          />
          <Image 
            src={threejslogo} 
            alt="Three.js Logo" 
            width={80} 
            height={80} 
            priority
            className="object-contain grayscale"
          />
          <Image 
            src={mathjaxlogo} 
            alt="MathJax Logo" 
            width={80} 
            height={80} 
            priority
            className="object-contain grayscale"
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage
