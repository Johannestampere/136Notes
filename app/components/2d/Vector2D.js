import { useState, useEffect } from "react";

const Vector2D = ({ x, y }) => {
    const [svgContent, setSvgContent] = useState("");

    useEffect(() => {
        const fetchSVG = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/vector?x=${x}&y=${y}`);
                const svg = await response.text();
                setSvgContent(svg);
            } catch (error) {
                console.error(error);
            }
        }

        fetchSVG();
    }, [x, y]);

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        </div>
    );
}

export default Vector2D;