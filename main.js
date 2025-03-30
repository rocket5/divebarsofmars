import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // Light gray background for debugging

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

// Stronger lighting setup for Lambert materials
// Increase ambient light for better overall illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 3.0);
scene.add(ambientLight);

// Front light - Very bright
const frontLight = new THREE.DirectionalLight(0xffffff, 4.0);
frontLight.position.set(0, 2, 5);
frontLight.castShadow = true;
frontLight.shadow.bias = -0.001;
frontLight.shadow.mapSize.width = 1024;
frontLight.shadow.mapSize.height = 1024;
scene.add(frontLight);

// Back light for rim lighting
const backLight = new THREE.DirectionalLight(0xffffcc, 3.5);
backLight.position.set(0, 3, -5);
scene.add(backLight);

// Add point lights around the model for better illumination
const pointLight1 = new THREE.PointLight(0xffffff, 2.0, 10);
pointLight1.position.set(2, 1, 2);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 2.0, 10);
pointLight2.position.set(-2, 1, 2);
scene.add(pointLight2);

// Create a texture loader
const textureLoader = new THREE.TextureLoader();
textureLoader.setPath('assets/textures/');

// Load the texture with callbacks for better debugging
const astronautTexture = textureLoader.load(
    'F_CharTextures.png',
    // Success callback
    function(texture) {
        console.log('Texture loaded successfully:', texture);
        console.log('Texture image dimensions:', texture.image.width, 'x', texture.image.height);
        
        // Log additional texture info
        console.log('Texture source:', texture.source);
        console.log('Texture UUID:', texture.uuid);
        console.log('Texture image complete:', texture.image.complete);
        
        // Important settings for FBX textures
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
        
        // Make sure the texture uses the correct wrap mode
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        
        // Ensure texture filtering for better quality
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        // Ensure the texture is updated
        texture.needsUpdate = true;
        
        // If we have the model already loaded, apply the texture
        if (astronaut) {
            // Apply all our texture approaches
            applyTextureByMeshName(astronaut, texture);
        }
    },
    // Progress callback
    undefined,
    // Error callback
    function(error) {
        console.error('Error loading texture:', error);
    }
);

// Function to apply textures to specific named meshes
function applyTextureByMeshName(model, texture) {
    console.log('Applying texture by specific mesh names...');
    
    // Based on the logs, we know the model has these specific mesh names
    const meshNames = ['_M_Astronaut_Helmet', '_M_Astronaut_Suit', '_M_Head'];
    
    model.traverse((child) => {
        if (child.isMesh) {
            // Create different material types based on the mesh name
            let meshMaterial;
            
            // Apply to all meshes this time, with specific handling for known meshes
            console.log(`Applying special material to ${child.name}`);
            
            // Try to match the original mesh material type
            if (child.material && child.material.type === 'MeshLambertMaterial') {
                meshMaterial = new THREE.MeshLambertMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    emissive: new THREE.Color(0x222222)
                });
            } else {
                // Default to basic material for maximum visibility without lighting effects
                meshMaterial = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });
            }
            
            // If we created a material, apply it
            if (meshMaterial) {
                // Force the texture to update
                meshMaterial.map.needsUpdate = true;
                meshMaterial.needsUpdate = true;
                
                // Apply the material
                child.material = meshMaterial;
                
                console.log(`Applied ${meshMaterial.type} to ${child.name}`);
            }
            
            // If there are UV coordinates, try to adjust them
            if (child.geometry && child.geometry.attributes.uv) {
                // Check if this is a known mesh with specific UV adjustments
                if (meshNames.includes(child.name)) {
                    // Calculate better UV scaling/offset based on the specific part
                    const uvAttribute = child.geometry.attributes.uv;
                    const uvArray = uvAttribute.array;
                    
                    // Different adjustments for different mesh parts
                    let scaleX = 1.0;
                    let scaleY = 1.0;
                    let offsetX = 0.0;
                    let offsetY = 0.0;
                    
                    // Example specific adjustments based on mesh name
                    if (child.name === '_M_Astronaut_Helmet') {
                        // Adjust helmet UVs
                        scaleX = 1.0;
                        scaleY = 1.0;
                        offsetX = 0.0;
                        offsetY = 0.0;
                    } else if (child.name === '_M_Astronaut_Suit') {
                        // Adjust suit UVs
                        scaleX = 1.0;
                        scaleY = 1.0;
                        offsetX = 0.0;
                        offsetY = 0.0;
                    } else if (child.name === '_M_Head') {
                        // Adjust head UVs
                        scaleX = 1.0;
                        scaleY = 1.0;
                        offsetX = 0.0;
                        offsetY = 0.0;
                    }
                    
                    // Apply transformations to all UVs
                    for (let i = 0; i < uvArray.length; i += 2) {
                        // Apply scale and offset transformations
                        uvArray[i] = (uvArray[i] * scaleX) + offsetX;
                        uvArray[i + 1] = (uvArray[i + 1] * scaleY) + offsetY;
                    }
                    
                    // Mark UVs for update
                    uvAttribute.needsUpdate = true;
                    console.log(`Adjusted UV coordinates for ${child.name}`);
                }
            }
        }
    });
}

// Function to debug model materials in depth
function debugModelMaterials(model) {
    console.log('========== DETAILED MATERIAL DEBUG ==========');
    model.traverse(function(child) {
        if (child.isMesh) {
            console.log(`Mesh: ${child.name}`);
            
            const material = child.material;
            if (Array.isArray(material)) {
                material.forEach((mat, idx) => {
                    console.log(`  Material[${idx}]: ${mat.name} (${mat.type})`);
                    debugMaterialDetails(mat);
                });
            } else {
                console.log(`  Material: ${material.name} (${material.type})`);
                debugMaterialDetails(material);
            }
            
            // Log geometry info
            const geo = child.geometry;
            console.log(`  Geometry attributes: ${Object.keys(geo.attributes).join(', ')}`);
            if (geo.attributes.uv) {
                console.log(`  UV min/max x: ${getMinMax(geo.attributes.uv.array, 0, 2)}`);
                console.log(`  UV min/max y: ${getMinMax(geo.attributes.uv.array, 1, 2)}`);
            }
        }
    });
    console.log('============================================');
}

// Helper function to debug material details
function debugMaterialDetails(material) {
    console.log(`    Color: ${material.color ? material.color.getHexString() : 'none'}`);
    console.log(`    Map: ${material.map ? 'present' : 'none'}`);
    if (material.map) {
        console.log(`      Map dimensions: ${material.map.image.width}x${material.map.image.height}`);
        console.log(`      Map UUID: ${material.map.uuid}`);
        console.log(`      Map needsUpdate: ${material.map.needsUpdate}`);
        console.log(`      Map flipY: ${material.map.flipY}`);
        console.log(`      Map colorSpace: ${material.map.colorSpace}`);
    }
    console.log(`    Transparent: ${material.transparent}`);
    console.log(`    Opacity: ${material.opacity}`);
    console.log(`    Side: ${material.side}`);
    console.log(`    Visible: ${material.visible}`);
    console.log(`    NeedsUpdate: ${material.needsUpdate}`);
}

// Helper function to get min/max values from array
function getMinMax(array, offset, stride) {
    let min = Infinity;
    let max = -Infinity;
    
    for (let i = offset; i < array.length; i += stride) {
        if (array[i] < min) min = array[i];
        if (array[i] > max) max = array[i];
    }
    
    return { min, max };
}

// Add a function to check and fix UV mapping
function checkAndFixUVs(model) {
    console.log('Checking UV mappings...');
    
    model.traverse(function(child) {
        if (child.isMesh && child.geometry && child.geometry.attributes.uv) {
            const uvs = child.geometry.attributes.uv;
            console.log(`Checking UVs for mesh: ${child.name}`);
            
            // Get min/max values to check if they're in proper range (0-1)
            const { min: minX, max: maxX } = getMinMax(uvs.array, 0, 2);
            const { min: minY, max: maxY } = getMinMax(uvs.array, 1, 2);
            
            console.log(`  UV X range: ${minX} to ${maxX}`);
            console.log(`  UV Y range: ${minY} to ${maxY}`);
            
            // Check if UVs are outside the 0-1 range
            let modified = false;
            
            // If UVs are completely outside range or seem incorrect, try to reset them
            if (maxX <= 0 || minX >= 1 || maxY <= 0 || minY >= 1) {
                console.log(`  UVs appear to be outside normal range for ${child.name}, attempting to reset`);
                
                // Get vertex positions to generate simple UV mapping
                const positions = child.geometry.attributes.position;
                const count = positions.count;
                
                // Create new UV array based on bounding box mapping
                const newUVs = new Float32Array(count * 2);
                
                // Get bounding box to normalize positions
                const bbox = new THREE.Box3().setFromBufferAttribute(positions);
                const size = new THREE.Vector3();
                bbox.getSize(size);
                
                for (let i = 0; i < count; i++) {
                    const x = positions.getX(i);
                    const y = positions.getY(i);
                    const z = positions.getZ(i);
                    
                    // Simple planar mapping based on x,y positions
                    // Normalize values to 0-1 range based on bounding box
                    newUVs[i * 2] = (x - bbox.min.x) / size.x;
                    newUVs[i * 2 + 1] = (y - bbox.min.y) / size.y;
                }
                
                // Apply new UVs
                child.geometry.setAttribute('uv', new THREE.BufferAttribute(newUVs, 2));
                child.geometry.attributes.uv.needsUpdate = true;
                modified = true;
                
                console.log(`  Created new UVs for ${child.name}`);
            }
            
            // Report whether we modified anything
            if (modified) {
                console.log(`  Modified UV mapping for ${child.name}`);
            } else {
                console.log(`  UV mapping appears normal for ${child.name}, not modified`);
            }
        }
    });
}

// Set up texture path for FBX loader to find textures
const texturesPath = 'assets/textures/';
const fbxLoader = new FBXLoader();
fbxLoader.setPath('assets/models/');

// Create a test cube to verify texture loading
let testCube;
let testCube2;
let testCube3;
function createTestCube(texture) {
    // Create a cube with the same texture to verify texture loading
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.0,
        roughness: 0.5
    });
    testCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    testCube.position.set(3, 0, 0); // Position next to where astronaut will be
    testCube.castShadow = true;
    testCube.receiveShadow = true;
    scene.add(testCube);
    console.log('Test cube created with texture applied');
    
    // Create a second test cube with a procedural texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Create a simple checkered pattern
    const checkSize = 32;
    for (let y = 0; y < canvas.height; y += checkSize) {
        for (let x = 0; x < canvas.width; x += checkSize) {
            context.fillStyle = ((x/checkSize + y/checkSize) % 2 === 0) ? '#ff0000' : '#00ff00';
            context.fillRect(x, y, checkSize, checkSize);
        }
    }
    
    // Create a texture from the canvas
    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.needsUpdate = true;
    
    // Create a cube with the canvas texture
    const cube2Material = new THREE.MeshStandardMaterial({
        map: canvasTexture,
        metalness: 0.0,
        roughness: 0.5
    });
    testCube2 = new THREE.Mesh(cubeGeometry, cube2Material);
    testCube2.position.set(-3, 0, 0); // Position on other side of astronaut
    testCube2.castShadow = true;
    testCube2.receiveShadow = true;
    scene.add(testCube2);
    console.log('Second test cube created with procedural texture');
    
    // Create a third test cube with the same texture but using MeshBasicMaterial
    // MeshBasicMaterial is not affected by lighting
    const cube3Material = new THREE.MeshBasicMaterial({
        map: texture.clone(),
        side: THREE.DoubleSide
    });
    testCube3 = new THREE.Mesh(cubeGeometry, cube3Material);
    testCube3.position.set(0, 3, 0); // Position above astronaut
    scene.add(testCube3);
    console.log('Third test cube created with MeshBasicMaterial');
}

// Load astronaut FBX model
fbxLoader.load(
    'astronaut.fbx',
    (object) => {
        astronaut = object;
        
        // Scale the model to appropriate size
        astronaut.scale.set(0.05, 0.05, 0.05);
        
        
        
        // Calculate model's offset from intended center
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
        
        // Log material information for debugging
        console.log('Astronaut object:', object);
        
        // Check and log materials and mesh information
        astronaut.traverse((child) => {
            if (child.isMesh) {
                console.log(`Mesh name: "${child.name}"`);
                
                // Check if this mesh has UV coordinates
                const hasUVs = child.geometry.attributes.uv !== undefined;
                console.log(`  Has UV coordinates: ${hasUVs}`);
                if (hasUVs) {
                    console.log(`  UV count: ${child.geometry.attributes.uv.count}`);
                }
                
                // Log material info
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat, index) => {
                        console.log(`  Material[${index}] name: "${mat.name}", type: ${mat.type}`);
                    });
                } else {
                    console.log(`  Material name: "${child.material.name}", type: ${child.material.type}`);
                }
            }
        });
        
        // Set up animation
        if (object.animations && object.animations.length > 0) {
            console.log(`Found ${object.animations.length} animations in the model`);
            object.animations.forEach((clip, index) => {
                console.log(`Animation ${index}: ${clip.name}, duration: ${clip.duration}s`);
            });
            
            // Clone the animation before modifying it
            const originalClip = object.animations[0];
            const filteredClip = originalClip.clone();
            
            // Filter out position/translation tracks (root motion)
            const tracks = filteredClip.tracks;
            console.log(`Original animation has ${tracks.length} tracks`);
            
            // Keep only rotation and scale tracks, filter out position tracks
            filteredClip.tracks = tracks.filter(track => {
                // Keep if not a position track (typically named with .position)
                const isPositionTrack = track.name.toLowerCase().includes('position');
                if (isPositionTrack) {
                    console.log(`Filtering out position track: ${track.name}`);
                }
                return !isPositionTrack;
            });
            
            console.log(`Filtered animation now has ${filteredClip.tracks.length} tracks`);
            
            // Create animation mixer for the container
            mixer = new THREE.AnimationMixer(container);
            
            // Play the filtered animation with optionalRoot parameter
            const action = mixer.clipAction(filteredClip, astronaut);
            action.play();
            
            console.log('Started playing filtered animation without root motion');
        } else {
            console.log('No animations found in the model');
        }

        // Position directly at scene origin
        astronaut.position.set(0, 0, 0);
        
        // Check and attempt to fix any UV issues before applying texture
        checkAndFixUVs(astronaut);
        
        // If texture is already loaded, apply it
        if (astronautTexture.image) {
            // Create test cube with the same texture
            createTestCube(astronautTexture);
            
            // Apply texture using our mesh-specific function
            applyTextureByMeshName(astronaut, astronautTexture);
        }
        
        // Add the model to the scene
        scene.add(astronaut);
        
        // Remove loading indicator
        loadingElem.remove();
        
        console.log('Model loaded successfully');
        
        // Debug the materials after everything is done
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
    
    // Update animation mixer
    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta);
    }

    // Rotate astronaut if loaded
    if (astronaut) {
        // Comment out the manual rotation as we're using animation
        // astronaut.rotation.y += 0.01;
    }
    
    // Rotate test cubes if loaded
    if (testCube) {
        testCube.rotation.y -= 0.01;
    }
    
    if (testCube2) {
        testCube2.rotation.y += 0.015;
    }
    
    if (testCube3) {
        testCube3.rotation.y -= 0.02;
        testCube3.rotation.x += 0.01;
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

// Start animation
animate(); 