import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// Audio setup
const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
let audioReady = false;
let audioLoading = false;

// Use base URL to ensure paths work in deployment
const baseUrl = import.meta.env.BASE_URL || '/';

// Add audio control button
const audioButton = document.createElement('button');
audioButton.style.position = 'absolute';
audioButton.style.bottom = '20px';
audioButton.style.right = '20px';
audioButton.style.padding = '10px';
audioButton.style.background = 'transparent';
audioButton.style.color = 'white';
audioButton.style.border = 'none';
audioButton.style.cursor = 'pointer';
audioButton.style.zIndex = '100';
audioButton.style.fontFamily = 'Arial, sans-serif';
audioButton.style.fontSize = '16px';
audioButton.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.8)';
audioButton.innerHTML = '<span style="font-size: 18px;">♪</span> Dive Bars of Mars';
audioButton.addEventListener('click', () => {
    if (sound.isPlaying) {
        sound.pause();
        audioButton.innerHTML = '<span style="font-size: 18px;">♪</span> Dive Bars of Mars';
    } else {
        if (audioReady) {
            sound.play();
            audioButton.innerHTML = '<span style="font-size: 18px;">♫</span> Dive Bars of Mars';
        } else if (!audioLoading) {
            // Start loading if not already loading
            audioLoading = true;
            audioButton.innerHTML = '<span style="font-size: 18px;">⟳</span> Loading...';
            loadAudio();
        } else {
            // Already loading
            audioButton.innerHTML = '<span style="font-size: 18px;">⟳</span> Loading...';
        }
    }
});
document.body.appendChild(audioButton);

// Function to load audio
function loadAudio() {
    audioLoader.load(
        `${baseUrl}assets/audio/divebarsofmars.mp3`,
        (buffer) => {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            audioReady = true;
            audioLoading = false;
            
            // Play audio immediately after loading
            sound.play().then(() => {
                audioButton.innerHTML = '<span style="font-size: 18px;">♫</span> Dive Bars of Mars';
            }).catch(err => {
                console.log('Audio play error:', err);
                audioButton.innerHTML = '<span style="font-size: 18px;">♪</span> Dive Bars of Mars';
            });
        },
        (xhr) => {
            // Loading progress
            const percent = Math.round((xhr.loaded / xhr.total * 100));
            audioButton.innerHTML = `<span style="font-size: 18px;">⟳</span> Loading ${percent}%`;
        },
        (error) => {
            console.error('Error loading audio:', error);
            audioLoading = false;
            audioButton.innerHTML = '<span style="font-size: 18px;">✕</span> Load Failed';
        }
    );
}

// Try to pre-load audio on first user interaction
const startAudio = () => {
    if (!audioReady && !audioLoading) {
        audioLoading = true;
        audioButton.innerHTML = '<span style="font-size: 18px;">⟳</span> Loading...';
        loadAudio();
    }
    
    // Remove listeners once audio is loading
    document.removeEventListener('click', startAudio);
    document.removeEventListener('touchstart', startAudio);
    document.removeEventListener('keydown', startAudio);
    document.removeEventListener('mousedown', startAudio);
};

// Listen for any kind of user interaction
document.addEventListener('click', startAudio);
document.addEventListener('touchstart', startAudio);
document.addEventListener('keydown', startAudio);
document.addEventListener('mousedown', startAudio);

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000814); // Deep space color

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 1, 10); // Position camera further back and slightly up
camera.add(listener); // Add audio listener to camera

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
// Use base URL to ensure paths work in deployment
textureLoader.setPath(`${baseUrl}assets/textures/`);

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
                roughness: 0.5,
                color: 0x000814
            });
        }
    });
}

// Set up FBX loader
const fbxLoader = new FBXLoader();
fbxLoader.setPath(`${baseUrl}assets/models/`);

// Create star particles for space environment
function createStarField() {
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterials = [];
    
    // Create a programmatic star texture for glow effect
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const ctx = starCanvas.getContext('2d');
    
    // Draw a radial gradient to create a glowing dot
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.3, 'rgba(240, 240, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(220, 220, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    // Create texture from canvas
    const starTexture = new THREE.CanvasTexture(starCanvas);
    starTexture.colorSpace = THREE.SRGBColorSpace;
    
    // Create groups of stars with different sizes and colors
    const starSizes = [0.2, 0.5, 0.3, 0.6];
    const starColors = [0xFFFFFF, 0xEEEEFF, 0xCCDDFF, 0xFFEEDD];
    
    // Create particle systems for each star type
    for (let i = 0; i < starSizes.length; i++) {
        const positions = new Float32Array(particleCount * 3);
        
        // Distribute stars in a large sphere around the astronaut
        for (let j = 0; j < particleCount; j++) {
            // Random position in spherical coordinates
            const radius = 30 + Math.random() * 70; // Between 30 and 100 units away
            const theta = Math.random() * Math.PI * 2; // Random angle around y-axis
            const phi = Math.acos(2 * Math.random() - 1); // Random angle from y-axis
            
            // Convert to Cartesian coordinates
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            positions[j * 3] = x;
            positions[j * 3 + 1] = y;
            positions[j * 3 + 2] = z;
        }
        
        // Create a buffer geometry for this group of stars
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Create material with varying sizes and colors
        const material = new THREE.PointsMaterial({
            color: starColors[i],
            size: starSizes[i],
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: true,
            depthWrite: false,
            map: starTexture
        });
        
        // Create particle system and add to scene
        const particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);
        
        // Store reference for animation
        particleMaterials.push({
            system: particleSystem,
            rotationSpeed: 0.0001 + Math.random() * 0.0002, // Unique rotation speed
            rotationAxis: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize()
        });
    }
    
    return particleMaterials;
}

// Create star field
const starSystems = createStarField();

// Add a few brighter "special" stars
function addSpecialStars() {
    // Create a brighter star texture
    const brightStarCanvas = document.createElement('canvas');
    brightStarCanvas.width = 64;
    brightStarCanvas.height = 64;
    const ctx = brightStarCanvas.getContext('2d');
    
    // Create a brighter, larger glow
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 230, 0.9)');
    gradient.addColorStop(0.5, 'rgba(255, 240, 220, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 230, 200, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    // Create texture from canvas
    const brightStarTexture = new THREE.CanvasTexture(brightStarCanvas);
    brightStarTexture.colorSpace = THREE.SRGBColorSpace;
    
    // Create 12 special, brighter stars
    const specialStarPositions = [];
    for (let i = 0; i < 12; i++) {
        const radius = 35 + Math.random() * 60;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        specialStarPositions.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
    }
    
    // Create geometry for special stars
    const specialGeometry = new THREE.BufferGeometry();
    specialGeometry.setAttribute(
        'position', 
        new THREE.Float32BufferAttribute(specialStarPositions, 3)
    );
    
    // Create materials with different colors for variation
    const specialColors = [0xFFFFBB, 0xFFEECC, 0xAAEEFF];
    const specialSizes = [0.4, 0.5, 0.6];
    
    for (let i = 0; i < specialColors.length; i++) {
        const material = new THREE.PointsMaterial({
            color: specialColors[i],
            size: specialSizes[i],
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: true,
            depthWrite: false,
            map: brightStarTexture
        });
        
        const specialStars = new THREE.Points(specialGeometry, material);
        scene.add(specialStars);
        
        // Add to animation systems
        starSystems.push({
            system: specialStars,
            rotationSpeed: 0.00005 + Math.random() * 0.0001,
            rotationAxis: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize()
        });
    }
}

addSpecialStars();

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

    // Animate star field - slowly rotate each particle system
    starSystems.forEach(starSystem => {
        starSystem.system.rotateOnAxis(starSystem.rotationAxis, starSystem.rotationSpeed);
        
        // Make stars twinkle slightly by varying the material opacity
        const opacity = 0.7 + 0.3 * Math.sin(Date.now() * 0.001 * starSystem.rotationSpeed * 10);
        starSystem.system.material.opacity = opacity;
    });

    // Add a subtle floating effect to the astronaut
    if (astronaut) {
        // Gentle floating motion on Y axis
        astronaut.position.y = Math.sin(Date.now() * 0.0005) * 0.2;
        // Subtle rotation
        astronaut.rotation.y = Math.sin(Date.now() * 0.0002) * 0.1;
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

// Start animation
animate(); 