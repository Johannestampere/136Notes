import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Vector3D = ({ x, y, z }) => {
    // The useRef Hook allows you to persist values between renders.

    // It can be used to store a mutable value that does not cause a re-render when updated.

    // It can be used to access a DOM element directly.

    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    // Upate container size based on the current size
    const updateContainerSize = () => {
        if (containerRef.current) {
            setContainerSize({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight,
            });
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Init scene
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x00000); // black bg
            sceneRef.current = scene;

            // Init camera
            const camera = new THREE.PerspectiveCamera(15, containerSize.width / containerSize.height, 0.1, 1000);
            camera.position.set(0, 0, 100);
            camera.lookAt(20, 0, 0);
            cameraRef.current = camera;

            // Init renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(containerSize.width, containerSize.height); // Use container size
            rendererRef.current = renderer;

            // Clear previous content if any and append renderer to container
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
                containerRef.current.appendChild(renderer.domElement);
            }

            // Init controls to allow rotation of the scene
            const controls = new OrbitControls(camera, renderer.domElement);
            controlsRef.current = controls;

            // Initialize 3d grid
            const gridHelper = new THREE.GridHelper(200, 50, 0xffffff, 0x888888); // Black grid lines
            scene.add(gridHelper);

            // Initialize axes
            const axesHelper = new THREE.AxesHelper(50);
            axesHelper.setColors(new THREE.Color(0xffffff), new THREE.Color(0xffffff), new THREE.Color(0xffffff));
            scene.add(axesHelper);

            // Add labels to axes
            const createLabel = (text, position, color = "white") => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                context.font = "16px Arial";
                context.fillStyle = color;
                context.fillText(text, 0, 24);
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.copy(position);
                sprite.scale.set(10, 5, 1);
                scene.add(sprite);
            };
            
            const axisLabelOffset = 1.1;
            createLabel("X", new THREE.Vector3(15 * axisLabelOffset, 0, 0));
            createLabel("Y", new THREE.Vector3(0, 10 * axisLabelOffset, 0));
            createLabel("Z", new THREE.Vector3(0, 0, 20 * axisLabelOffset));

            // Initialize vector as an arrow
            const direction = new THREE.Vector3(x, y, z).normalize();
            const len = Math.sqrt(x * x + y * y + z * z);
            const origin = new THREE.Vector3(0, 0, 0);
            const vectorColor = "#fd3fe6";

            // Create an arrow helper
            const arrowHelper = new THREE.ArrowHelper(direction, origin, len, vectorColor, 2, 1);
            scene.add(arrowHelper);

            // Vector label
            const vectorLabel = `x = (${x}, ${y}, ${z})`;
            createLabel(vectorLabel, new THREE.Vector3(x / 2, y / 2, z / 2), vectorColor);

            // Update renderer
            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };
            animate();

            // Window resizing
            const handleResize = () => {
                updateContainerSize(); // Update container size on resize
                camera.aspect = containerSize.width / containerSize.height;
                camera.updateProjectionMatrix();
                renderer.setSize(containerSize.width, containerSize.height);
            };
            window.addEventListener("resize", handleResize);

            // Set the right window size
            updateContainerSize();

            // Cleanup
            return () => {
                window.removeEventListener("resize", handleResize);
                if (containerRef.current) {
                    containerRef.current.removeChild(renderer.domElement);
                }
                renderer.dispose();
                controls.dispose();
            };
        }
    }, [x, y, z, containerSize.width, containerSize.height]);

    return (
        <div ref={containerRef} style={{ width: "100%", height: "400px" }} />
    );
};

export default Vector3D;