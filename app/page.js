"use client"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react"
import "@/app/globals.css" 
import Image from 'next/image'
import latexlogo from "@/public/LaTeX_logo.svg.png"
import threejslogo from "@/public/threejs.png"
import mathjaxlogo from "@/public/mathjax.png"

const HomePage = () => {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      return
    }
    if (session) {
      handleSignIn()
    }
  }, [session, router])

  const handleSignIn = async () => {
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
        console.error('Failed to create/fetch user');
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  
  if (session) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-emerald-900 text-white">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-emerald-400">
            136Notes
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-emerald-200">
            Interactive Notes for Math 136 Students
          </p>
          <div className="mt-8">
            <button
              onClick={() => signIn("google")}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-emerald-900 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex lg:flex-1 bg-emerald-800 justify-center items-center">
        <div className="flex flex-col items-center space-y-8">
          <Image src={latexlogo} alt="LaTeX Logo" width={150} height={150} objectFit="contain" />
          <Image src={threejslogo} alt="Three.js Logo" width={150} height={150} objectFit="contain" />
          <Image src={mathjaxlogo} alt="MathJax Logo" width={150} height={150} objectFit="contain" />
        </div>
      </div>
    </div>
  )
}

export default HomePage
