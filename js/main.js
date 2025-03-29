// Music Video Visualization with Three.js
class MusicVideoExperience {
    constructor() {
        this.container = document.getElementById('container');
        this.loadingScreen = document.getElementById('loading-screen');
        this.playButtonContainer = document.getElementById('play-button-container');
        this.playButton = document.getElementById('play-button');
        this.pauseButton = document.getElementById('pause-button');
        this.progressSlider = document.getElementById('progress-slider');
        this.timeDisplay = document.getElementById('time-display');
        this.progressBar = document.querySelector('.progress-bar');
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.audioElement = null;
        this.analyser = null;
        this.dataArray = null;
        this.visualElements = [];
        this.clock = new THREE.Clock();
        this.isPlaying = false;
        this.loadingManager = new THREE.LoadingManager();
        
        this.init();
    }
    
    init() {
        // Setup loading manager
        this.setupLoadingManager();
        
        // Hide controls initially
        document.getElementById('controls').style.display = 'none';
        
        // Initialize ThreeJS scene
        this.initScene();
        
        // Setup audio
        this.setupAudio();
        
        // Add event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
    }
    
    setupLoadingManager() {
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            this.progressBar.style.width = progress + '%';
        };
        
        this.loadingManager.onLoad = () => {
            this.loadingScreen.style.display = 'none';
            this.playButtonContainer.style.display = 'flex';
        };
        
        this.loadingManager.onError = (url) => {
            console.error('Error loading:', url);
        };
    }
    
    initScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#000000');
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.position.z = 15;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Add orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Create visual elements
        this.createVisualElements();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    createVisualElements() {
        // Create a particle system
        const particleCount = 5000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.particleSystem);
        this.visualElements.push(this.particleSystem);
        
        // Create central object
        const geometry = new THREE.IcosahedronGeometry(5, 2);
        const material = new THREE.MeshPhongMaterial({
            color: 0x8e2de2,
            emissive: 0x4a00e0,
            emissiveIntensity: 0.3,
            wireframe: true
        });
        
        this.centralObject = new THREE.Mesh(geometry, material);
        this.scene.add(this.centralObject);
        this.visualElements.push(this.centralObject);
    }
    
    setupAudio() {
        // Create audio element
        this.audioElement = new Audio();
        this.audioElement.crossOrigin = "anonymous";
        this.audioElement.src = "assets/audio/music.mp3"; // Replace with your music file
        this.audioElement.load();
        
        // Setup Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(this.audioElement);
        this.analyser = audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        
        source.connect(this.analyser);
        this.analyser.connect(audioContext.destination);
        
        // Create data array for frequency analysis
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
    }
    
    setupEventListeners() {
        // Play button event
        this.playButton.addEventListener('click', () => {
            this.playButtonContainer.style.display = 'none';
            document.getElementById('controls').style.display = 'flex';
            this.playAudio();
        });
        
        // Pause button event
        this.pauseButton.addEventListener('click', () => {
            if (this.isPlaying) {
                this.audioElement.pause();
                this.pauseButton.textContent = 'Play';
                this.isPlaying = false;
            } else {
                this.audioElement.play();
                this.pauseButton.textContent = 'Pause';
                this.isPlaying = true;
            }
        });
        
        // Progress slider event
        this.progressSlider.addEventListener('input', () => {
            const seekTime = (this.progressSlider.value / 100) * this.audioElement.duration;
            this.audioElement.currentTime = seekTime;
        });
        
        // Audio time update event
        this.audioElement.addEventListener('timeupdate', () => {
            const currentTime = this.formatTime(this.audioElement.currentTime);
            const duration = this.formatTime(this.audioElement.duration);
            this.timeDisplay.textContent = `${currentTime} / ${duration}`;
            
            if (!this.isSeeking) {
                const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
                this.progressSlider.value = progress;
            }
        });
        
        // Audio ended event
        this.audioElement.addEventListener('ended', () => {
            this.isPlaying = false;
            this.pauseButton.textContent = 'Play';
            this.progressSlider.value = 0;
        });
        
        this.progressSlider.addEventListener('mousedown', () => {
            this.isSeeking = true;
        });
        
        this.progressSlider.addEventListener('mouseup', () => {
            this.isSeeking = false;
        });
    }
    
    playAudio() {
        this.audioElement.play();
        this.isPlaying = true;
    }
    
    formatTime(time) {
        if (isNaN(time)) return '00:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateVisuals() {
        if (!this.analyser || !this.isPlaying) return;
        
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate average frequency amplitude
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
        }
        const avg = sum / this.dataArray.length;
        
        // Update central object based on audio
        if (this.centralObject) {
            this.centralObject.rotation.x += 0.005;
            this.centralObject.rotation.y += 0.01;
            
            // Scale based on audio intensity
            const scale = 1 + avg / 256;
            this.centralObject.scale.set(scale, scale, scale);
            
            // Change color based on frequency bands
            const lowFreq = this.getAverageFrequency(0, 5);
            const midFreq = this.getAverageFrequency(6, 10);
            const highFreq = this.getAverageFrequency(11, 15);
            
            this.centralObject.material.emissive.setRGB(
                lowFreq / 256,
                midFreq / 256,
                highFreq / 256
            );
        }
        
        // Update particle system
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.001;
            
            const positions = this.particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Get frequency value for this particle
                const freqIndex = Math.floor(i / positions.length * this.dataArray.length);
                const frequencyValue = this.dataArray[freqIndex] / 256;
                
                // Apply pulse effect
                const originalPos = new THREE.Vector3(
                    positions[i], 
                    positions[i + 1], 
                    positions[i + 2]
                ).normalize();
                
                const distance = 50 + frequencyValue * 20 + Math.sin(this.clock.getElapsedTime() + i) * 5;
                
                positions[i] = originalPos.x * distance;
                positions[i + 1] = originalPos.y * distance;
                positions[i + 2] = originalPos.z * distance;
            }
            
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    getAverageFrequency(startIndex, endIndex) {
        let sum = 0;
        for (let i = startIndex; i <= endIndex; i++) {
            sum += this.dataArray[i];
        }
        return sum / (endIndex - startIndex + 1);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Update orbit controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Update visual elements based on audio
        this.updateVisuals();
        
        // Render the scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Create placeholder file for music
const createPlaceholderFile = async () => {
    const audioDirectory = 'assets/audio';
    
    try {
        // Check if directory exists
        const response = await fetch(audioDirectory);
        if (!response.ok) {
            console.warn(`Please create the directory: ${audioDirectory}`);
        }
        
        console.log("Please add your music file as 'music.mp3' in the assets/audio directory");
    } catch (error) {
        console.warn("Unable to check audio directory:", error);
        console.log("Please make sure to create assets/audio directory and add your music.mp3 file");
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createPlaceholderFile();
    new MusicVideoExperience();
}); 