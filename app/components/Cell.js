"use client"

import { useState, useEffect, useRef } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Vector2D from "@/app/components/2d/Vector2D";
import VectorSum from "@/app/components/2d/VectorSum2D";
import Projection2D from "@/app/components/2d/Projection2D";
import Vector3D from "@/app/components/3d/Vector3d.js";
import Sum3D from "./3d/Sum3d";

export default function Cell({ cell, isEditing, setEditingCellId, refreshFileData, selectedCellId, setSelectedCellId }) {
    const [content, setContent] = useState(cell.data || "")

    // State for the objectType of the 2d cell (vector, sum of vectors, projection...)
    // (to save the state of the 2d cell when refreshing the page)
    const [objectType, setObjectType] = useState(() => {
        const savedObjectType = localStorage.getItem(`objectType-${cell._id}`)
        return savedObjectType || ""
    });

    // 3d objecttype state (vector, sum of vectors, projection...)
    const [objectType3D, setObjectType3D] = useState(() => {
        // Get the objectType from localStorage if it exists (for 2d)
        const savedObjectType3D = localStorage.getItem(`objectType3D-${cell._id}`)
        return savedObjectType3D || ""
    });

    const textareaRef = useRef(null)

    // MathJax config
    const config = {
        loader: { load: ["[tex]/html"] },
        tex: {
            packages: { "[+]": ["html"] },
            inlineMath: [
                ["$", "$"],
                ["\\(", "\\)"]
            ],
            displayMath: [
                ["$$", "$$"],
                ["\\[", "\\]"]
            ]
        }
    };

    // Save cell data to the server
    const saveCell = async () => {
        try {
            const response = await fetch(`/api/update-cell/${cell._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: content }),
            });

            if (response.ok) {
                if (content === "") {
                    deleteCell(cell._id)
                    setEditingCellId(null)
                    refreshFileData()
                } else {
                    console.log("cell saved")
                    setEditingCellId(null)
                    refreshFileData()
                }
                
            } else {
                console.error("cell save failed")
            }
        } catch (e) {
            console.error("error:", e)
        }
    };

    // Delete cell data from the server
    const deleteCell = async () => {
        if (selectedCellId !== cell._id) return

        try {
            const response = await fetch(`/api/delete-cell/${cell._id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log("cell deleted successfully")
                setEditingCellId(null)
                refreshFileData()
            } else {
                console.error("failed to delete cell")
            }
        } catch (e) {
            console.error("Error deleting cell:", e)
        }
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.metaKey && e.key === "Enter") {
                saveCell()
            } else if (e.metaKey && e.key === "Backspace") {
                if (selectedCellId === cell._id) {
                    deleteCell()
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [content, selectedCellId])

    // Gets the values from the string
    const parseXY = (str) => {
        try {
            const arr = JSON.parse(str)
            return arr
        } catch (e) {
            console.error("Invalid JSON input:", e)
            return []
        }
    }

    // Adjust the height of the textarea based on its content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [content, isEditing])

    // Save objectType (2d) to localStorage whenever it changes
    useEffect(() => {
        if (objectType) {
            localStorage.setItem(`objectType-${cell._id}`, objectType)
        }
    }, [objectType, cell._id])

    // Save objectType3D (3d) to localStorage whenever it changes
    // Save objectType to localStorage whenever it changes
    useEffect(() => {
        if (objectType3D) {
            localStorage.setItem(`objectType3D-${cell._id}`, objectType3D)
        }
    }, [objectType3D, cell._id])

    return (
        <div className={`mb-4 ${selectedCellId === cell._id ? "bg-gray-800" : ""}`} onClick={() => setSelectedCellId(cell._id)}>
            {isEditing ? (
                <div className="flex items-center space-x-2">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="p-2 bg-gray-700 text-white rounded flex-grow text-base resize-none overflow-hidden"
                        placeholder={`Enter ${cell.type}...`}
                        rows={1}
                    />
                    {cell.type === "2d" && (
                        <select
                            value={objectType}
                            onChange={(e) => setObjectType(e.target.value)}
                            className="p-2 bg-gray-700 text-white rounded"
                        >
                            <option value="" disabled>Select plot type</option>
                            <option value="vector">Vector</option>
                            <option value="vectors_sum">Sum of Vectors</option>
                            <option value="projection2d">Projection</option>
                        </select>
                    )}
                    {cell.type === "3d" && (
                        <select
                            value={objectType3D}
                            onChange={(e) => setObjectType3D(e.target.value)}
                            className="p-2 bg-gray-700 text-white rounded"
                        >
                            <option value="" disabled>Select plot type</option>
                            <option value="vector">Vector</option>
                            <option value="vectors_sum">Sum of Two Vectors</option>
                        </select>
                    )}
                    <button
                        onClick={saveCell}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={deleteCell}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            ) : (
                <div
                    className={`p-2 ${
                        cell.type === "title" ? "text-4xl font-extrabold" :
                        cell.type === "h1" ? "text-3xl font-bold" :
                        cell.type === "h2" ? "text-2xl font-semibold" :
                        "text-base"
                    } text-white`}
                    onDoubleClick={() => setEditingCellId(cell._id)}
                >
                    {cell.type === "latex" ? (
                        <MathJaxContext version={3} config={config}>
                            <MathJax>{`${content}`}</MathJax>
                        </MathJaxContext>
                    ) : cell.type === "2d" ? (
                        <div className="flex justify-center">
                            {objectType === "vector" ? (
                                <Vector2D x={parseXY(content)[0]} y={parseXY(content)[1]} />
                            ) : objectType === "vectors_sum" ? (
                                <VectorSum vectors={parseXY(content)} />
                            ) : objectType === "projection2d" ? (
                                <Projection2D vectors={parseXY(content)} />
                            ) : (
                                content
                            )}
                        </div>
                    ) : cell.type === "3d" ? (
                        <div className="flex justify-center">
                            {
                        objectType3D === "vector" ? (
                            <Vector3D x={parseXY(content)[0]} y={parseXY(content)[1]} z={parseXY(content)[2]} />
                        ) : objectType3D === "vectors_sum" ? (
                            <Sum3D vectors={parseXY(content)} />
                        ) : (
                            content
                        )
                    }
                        </div>
                    ) : (
                        content
                    )}
                </div>
            )}
        </div>
    )
}