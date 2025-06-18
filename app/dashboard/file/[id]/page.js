"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FileNavbar from '@/app/components/fileNavbar';
import Plus from '@/app/components/Plus';
import Cell from '@/app/components/Cell';

export default function FilePage() {
    const { id } = useParams(); // Get the file mongo ObjectId from the URL
    const [file, setFile] = useState(null); // File data
    const [loading, setLoading] = useState(true);
    const [editingCellId, setEditingCellId] = useState(null); // Track the cell that's currently on edit mode
    const [selectedCellId, setSelectedCellId] = useState(null); // Track the cell that's currently selected

    // Fetches the specific file's data and returns it as a JSON object
    const getFileData = async () => {
        try {
            const response = await fetch(`/api/file/${id}`);
            const data = await response.json();
            if (data.file) {
                setFile(data.file);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getFileData();
        }
    }, [id]);

    // ctrl + d to deselect all cells
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'd') {
                setSelectedCellId(null);
                setEditingCellId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (loading) {
        return <div className="bg-black min-h-screen text-white flex justify-center items-center">Loading...</div>;
    }

    if (!file) {
        return <div className="bg-black min-h-screen text-white flex justify-center items-center">File not found</div>;
    }

    return (
        <div className="bg-black min-h-screen">
            <FileNavbar name={file.name} fileId={id} />
            <div className="max-w-3xl mx-auto px-4 py-10 mt-8 bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-800">
                {file.content.map((cell, index) => (
                    <Cell
                        key={index}
                        cell={cell}
                        isEditing={editingCellId === cell._id}
                        setEditingCellId={setEditingCellId}
                        refreshFileData={getFileData}
                        selectedCellId={selectedCellId}
                        setSelectedCellId={setSelectedCellId}
                    />
                ))}
                <Plus fileId={id} refreshFileData={getFileData} setEditingCellId={setEditingCellId} />
            </div>
        </div>
    );  
}