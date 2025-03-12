import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Projection3D = ({ vectors }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

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
            scene.background = new THREE.Color(0x000000); // black bg
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
                context.fillStyle = color; // Use the color parameter
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
            createLabel("Z", new THREE.Vector3(0, 0, 15 * axisLabelOffset));

            const createArrow = (start, end, color) => {
                const direction = new THREE.Vector3().subVectors(end, start).normalize();
                const length = start.distanceTo(end);
                const arrowHelper = new THREE.ArrowHelper(direction, start, length, color, 2, 1);
                scene.add(arrowHelper);
            };

            const v1 = new THREE.Vector3(...vectors[0]);
            const v2 = new THREE.Vector3(...vectors[1]);
            
            const projection = v1.clone().projectOnVector(v2);

            const v1Color = "#ff0000"; 
            const v2Color = "#00ff00"; 
            const projectionColor = "#0000ff"; 

            createArrow(new THREE.Vector3(0, 0, 0), v1, v1Color); 
            createArrow(new THREE.Vector3(0, 0, 0), v2, v2Color); 
            createArrow(new THREE.Vector3(0, 0, 0), projection, projectionColor); 

            // Label for vector 1
            const vector1Label = `v1 = (${vectors[0].join(", ")})`;
            createLabel(vector1Label, new THREE.Vector3(...vectors[0]).multiplyScalar(0.5), v1Color);

            // Label for vector 2
            const vector2Label = `v2 = (${vectors[1].join(", ")})`;
            createLabel(vector2Label, new THREE.Vector3(...vectors[1]).multiplyScalar(0.5), v2Color);

            // Label for projection vector
            const projectionLabel = `proj(v1)[v2] = (${projection.toArray().join(", ")})`;
            createLabel(projectionLabel, projection.clone().multiplyScalar(0.5), projectionColor);

            // Update renderer
            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };
            animate();

            // Resize window
            const handleResize = () => {
                updateContainerSize();
                camera.aspect = containerSize.width / containerSize.height;
                camera.updateProjectionMatrix();
                renderer.setSize(containerSize.width, containerSize.height);
            };
            window.addEventListener("resize", handleResize);

            // Set the right window size
            updateContainerSize();

            // Disposal
            return () => {
                window.removeEventListener("resize", handleResize);
                if (containerRef.current) {
                    containerRef.current.removeChild(renderer.domElement);
                }
                renderer.dispose();
                controls.dispose();
            };
        }
    }, [vectors, containerSize.width, containerSize.height]);

    return (
        <div ref={containerRef} style={{ width: "100%", height: "500px" }} />
    );
};

export default Projection3D;