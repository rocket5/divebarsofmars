import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a9396); // Teal background color

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 1, 10); // Position camera further back and slightly up

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
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

// Variable to store astronaut model
let astronaut;

// Animation mixer and clock
let mixer = null;
const clock = new THREE.Clock();

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 3.0);
scene.add(ambientLight);

const frontLight = new THREE.DirectionalLight(0xffffff, 4.0);
frontLight.position.set(0, 2, 5);
frontLight.castShadow = true;
frontLight.shadow.bias = -0.001;
frontLight.shadow.mapSize.width = 1024;
frontLight.shadow.mapSize.height = 1024;
scene.add(frontLight);

const backLight = new THREE.DirectionalLight(0xffffcc, 3.5);
backLight.position.set(0, 3, -5);
scene.add(backLight);

const pointLight1 = new THREE.PointLight(0xffffff, 2.0, 10);
pointLight1.position.set(2, 1, 2);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 2.0, 10);
pointLight2.position.set(-2, 1, 2);
scene.add(pointLight2);

// Create a texture loader
const textureLoader = new THREE.TextureLoader();
textureLoader.setPath('assets/textures/');

// Load the texture
const astronautTexture = textureLoader.load(
    'astronaut.png',
    function(texture) {
        // Important settings for FBX textures
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        
        // If we have the model already loaded, apply the texture
        if (astronaut) {
            applyTextureToModel(astronaut, texture);
        }
    },
    undefined,
    function(error) {
        console.error('Error loading texture:', error);
    }
);

// Function to apply texture to model meshes
function applyTextureToModel(model, texture) {
    model.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                map: texture,
                side: THREE.DoubleSide,
                metalness: 0.2,
                roughness: 0.8
            });
        }
    });
}

// Set up FBX loader
const fbxLoader = new FBXLoader();
fbxLoader.setPath('assets/models/');

// Load astronaut FBX model
fbxLoader.load(
    'astronaut.fbx',
    (object) => {
        astronaut = object;
        
        // Scale the model to appropriate size
        astronaut.scale.set(0.05, 0.05, 0.05);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(astronaut);
        const center = box.getCenter(new THREE.Vector3());
        
        // Create a container object at the origin
        const container = new THREE.Group();
        scene.add(container);
        
        // Add the model to the container and offset it to be centered
        container.add(astronaut);
        astronaut.position.set(-center.x, -center.y, -center.z);
        
        // Save reference to the container instead of the model
        astronaut = container;
        
        // Set up animation
        if (object.animations && object.animations.length > 0) {
            // Clone the animation before modifying it
            const originalClip = object.animations[0];
            const filteredClip = originalClip.clone();
            
            // Keep only rotation and scale tracks, filter out position tracks
            filteredClip.tracks = filteredClip.tracks.filter(track => {
                return !track.name.toLowerCase().includes('position');
            });
            
            // Create animation mixer for the container
            mixer = new THREE.AnimationMixer(container);
            
            // Play the filtered animation
            const action = mixer.clipAction(filteredClip, astronaut);
            action.play();
        }

        // Position at scene origin
        astronaut.position.set(0, 0, 0);
        
        // If texture is already loaded, apply it
        if (astronautTexture.image) {
            applyTextureToModel(astronaut, astronautTexture);
        }
        
        // Add the model to the scene
        scene.add(astronaut);
        
        // Remove loading indicator
        loadingElem.remove();
    },
    (xhr) => {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
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
    
    // Update animation mixer
    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta);
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

// Start animation
animate(); 