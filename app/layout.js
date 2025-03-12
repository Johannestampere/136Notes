import Navbar from './components/Navbar';
import { MathJax, MathJaxContext } from "better-react-mathjax";

export default function Layout({ children }) {
    return (
            <div>
                {children}
            </div>
    );
}
