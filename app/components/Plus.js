import React, { useState } from "react";

export default function Plus({ fileId, refreshFileData, setEditingCellId }) {
    // Visibility of the choices
    const [showChoices, setShowChoices] = useState(false);

    // Handles when the user clicks the add cell button
    const handleChoiceClick = async (type) => {
        try {
            const response = await fetch("/api/new-cell", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileId, type }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Cell added successfully");
                refreshFileData();
                setEditingCellId(data._id); // Set the new cell to editing mode
            } else {
                console.error("Failed to add cell");
            }
        } catch (error) {
            console.error("Error adding cell:", error);
        }
    };

    const types = ["title", "h1", "h2", "text", "latex", "2d", "3d"];

    return (
        <div 
            className="relative w-full h-16 bg-white hover:bg-neutral-200 transition-colors duration-300 rounded-2xl shadow-lg mt-4"
            onMouseEnter={() => setShowChoices(true)}
            onMouseLeave={() => setShowChoices(false)}
        >
            <button className="w-full h-full text-3xl font-bold text-black rounded-2xl transition-transform duration-150 hover:scale-105 hover:shadow-2xl">
                +
            </button>
            
            {showChoices && (
                <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-between px-2 rounded-2xl">
                    {types.map((type) => (
                        <button
                            key={type}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-3 transition-colors duration-300 flex-grow mx-0.5 text-sm rounded-2xl shadow border border-neutral-700 font-semibold hover:scale-105 hover:shadow-2xl transform"
                            onClick={() => handleChoiceClick(type)}
                        >
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}