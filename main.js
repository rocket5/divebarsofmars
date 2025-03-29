import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // Lighter background to ensure contrast

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 1, 10); // Position camera further back and slightly up

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Add a simple loading indicator
const loadingElem = document.createElement('div');
loadingElem.style.position = 'absolute';
loadingElem.style.top = '50%';
loadingElem.style.left = '50%';
loadingElem.style.transform = 'translate(-50%, -50%)';
loadingElem.style.color = 'white';
loadingElem.style.fontSize = '20px';
loadingElem.textContent = 'Loading model...';
document.body.appendChild(loadingElem);

// Add a helper grid
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Variable to store astronaut model
let astronaut;

// Add stronger lighting - more lights from multiple directions
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Brighter ambient light
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(5, 5, 5);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight2.position.set(-5, 5, -5);
scene.add(directionalLight2);

// Add a point light to illuminate the model from below
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, -3, 0);
scene.add(pointLight);

// Load the astronaut model
const fbxLoader = new FBXLoader();
fbxLoader.load(
    'assets/models/astronaut.fbx',
    (object) => {
        astronaut = object;
        
        // Scale the model to appropriate size - slightly larger
        astronaut.scale.set(0.05, 0.05, 0.05);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(astronaut);
        const center = box.getCenter(new THREE.Vector3());
        astronaut.position.x = -center.x;
        astronaut.position.y = -center.y;
        astronaut.position.z = -center.z;
        
        // Add the model to the scene
        scene.add(astronaut);
        
        // Remove loading indicator
        loadingElem.remove();
        
        console.log('Model loaded successfully');
        
        // Log the model's dimensions to help with debugging
        const size = new THREE.Vector3();
        box.getSize(size);
        console.log('Model dimensions:', size);
    },
    (xhr) => {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        console.log(percent + '% loaded');
        loadingElem.textContent = `Loading model... ${percent}%`;
    },
    (error) => {
        console.error('An error happened loading the model:', error);
        loadingElem.textContent = 'Error loading model!';
    }
);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0); // Set the center point for orbit controls

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate astronaut if loaded
    if (astronaut) {
        astronaut.rotation.y += 0.01;
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

// Start animation
animate(); 