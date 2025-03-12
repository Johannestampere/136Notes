import { useState, useEffect } from "react";

const Projection2D = ({ vectors }) => {
    const [svgContent, setSvgContent] = useState("");

    useEffect(() => {
        const fetchSVG = async () => {
            try {
                // Gets an array in form [[x1, y1], [x2, y2]] and sends it to the server as query params
                const response = await fetch(`http://127.0.0.1:5000/projection2d?x1=${vectors[0][0]}&y1=${vectors[0][1]}&x2=${vectors[1][0]}&y2=${vectors[1][1]}`);
                const svg = await response.text();
                setSvgContent(svg);
            } catch (error) {
                console.error(error);
            }
        }

        fetchSVG();
    }, [vectors]);

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        </div>
    );
}

export default Projection2D;