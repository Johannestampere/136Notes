import { useState, useEffect } from "react";

const Input2D = ({ type }) => {
    const [input, setInput] = useState([]);
    
    useEffect(() => {
        if (type === "vector") {
            setInput([0, 0]);
        } else if (type === "vectors_sum") {
            setInput([[0, 0], [0, 0]]);
        }
    }, [type]);

    if (type === "vector") {
        return (
            <div>
                <input type="number" placeholder="x" />
                <input type="number" placeholder="y" />
            </div>
        );
    } else if (type === "vectors_sum") {
        return (
            <div>
                <input type="number" placeholder="x1" />
                <input type="number" placeholder="y1" />
                <input type="number" placeholder="x2" />
                <input type="number" placeholder="y2" />
            </div>
        );
    }
};

export default Input2D;