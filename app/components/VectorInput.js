import React from "react";

export default function VectorInput({ type, value, onChange }) {
  // 2D or 3D vector
  if (type === "vector") {
    let safeValue = value;
    if (!Array.isArray(safeValue) || (safeValue.length !== 2 && safeValue.length !== 3) || safeValue.some(v => typeof v !== 'number')) {
      safeValue = [0, 0, 0];
    }
    if (safeValue.length === 3) {
      const [x, y, z] = safeValue;
      return (
        <div className="flex gap-2 items-center">
          <label className="text-white">x:</label>
          <input type="number" className="w-14 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={x} onChange={e => onChange([Number(e.target.value), y, z])} />
          <label className="text-white">y:</label>
          <input type="number" className="w-14 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={y} onChange={e => onChange([x, Number(e.target.value), z])} />
          <label className="text-white">z:</label>
          <input type="number" className="w-14 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={z} onChange={e => onChange([x, y, Number(e.target.value)])} />
        </div>
      );
    }
    // fallback to 2D
    const [x, y] = safeValue;
    return (
      <div className="flex gap-2 items-center">
        <label className="text-white">x:</label>
        <input type="number" className="w-14 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={x} onChange={e => onChange([Number(e.target.value), y])} />
        <label className="text-white">y:</label>
        <input type="number" className="w-14 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={y} onChange={e => onChange([x, Number(e.target.value)])} />
      </div>
    );
  }
  // 2D/3D vector sum or projection
  if (type === "vectors_sum" || type === "projection2d") {
    let safeValue = value;
    // If either vector is length 3, treat as 3D
    const is3D = Array.isArray(safeValue) && safeValue.length === 2 &&
      Array.isArray(safeValue[0]) && safeValue[0].length === 3 &&
      Array.isArray(safeValue[1]) && safeValue[1].length === 3;
    if (is3D) {
      const [[x1, y1, z1], [x2, y2, z2]] = safeValue;
      return (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span className="text-white font-semibold">Vector 1:</span>
            <label className="text-white">x₁:</label>
            <input type="number" className="w-12 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={x1} onChange={e => onChange([[Number(e.target.value), y1, z1], [x2, y2, z2]])} />
            <label className="text-white">y₁:</label>
            <input type="number" className="w-12 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={y1} onChange={e => onChange([[x1, Number(e.target.value), z1], [x2, y2, z2]])} />
            <label className="text-white">z₁:</label>
            <input type="number" className="w-12 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={z1} onChange={e => onChange([[x1, y1, Number(e.target.value)], [x2, y2, z2]])} />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-white font-semibold">Vector 2:</span>
            <label className="text-white">x₂:</label>
            <input type="number" className="w-12 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={x2} onChange={e => onChange([[x1, y1, z1], [Number(e.target.value), y2, z2]])} />
            <label className="text-white">y₂:</label>
            <input type="number" className="w-12 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={y2} onChange={e => onChange([[x1, y1, z1], [x2, Number(e.target.value), z2]])} />
            <label className="text-white">z₂:</label>
            <input type="number" className="w-12 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={z2} onChange={e => onChange([[x1, y1, z1], [x2, y2, Number(e.target.value)]])} />
          </div>
        </div>
      );
    }
    // fallback to 2D
    if (
      !Array.isArray(safeValue) ||
      safeValue.length !== 2 ||
      !Array.isArray(safeValue[0]) ||
      !Array.isArray(safeValue[1]) ||
      safeValue[0].length !== 2 ||
      safeValue[1].length !== 2
    ) {
      safeValue = [[0, 0], [0, 0]];
    }
    const [[x1, y1], [x2, y2]] = safeValue;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <span className="text-white font-semibold">Vector 1:</span>
          <label className="text-white">x₁:</label>
          <input type="number" className="w-14 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={x1} onChange={e => onChange([[Number(e.target.value), y1], [x2, y2]])} />
          <label className="text-white">y₁:</label>
          <input type="number" className="w-14 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={y1} onChange={e => onChange([[x1, Number(e.target.value)], [x2, y2]])} />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-white font-semibold">Vector 2:</span>
          <label className="text-white">x₂:</label>
          <input type="number" className="w-14 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={x2} onChange={e => onChange([[x1, y1], [Number(e.target.value), y2]])} />
          <label className="text-white">y₂:</label>
          <input type="number" className="w-14 p-2 rounded bg-neutral-800 text-white border border-neutral-700" value={y2} onChange={e => onChange([[x1, y1], [x2, Number(e.target.value)]])} />
        </div>
      </div>
    );
  }
  
  return null;
}