# Astronaut in Space

A Three.js-based interactive 3D experience featuring an astronaut floating in space with a star field background and music.

## Features

- 3D astronaut model that floats in space
- Interactive controls to rotate and zoom the camera
- Beautiful star field created with particle system
- Background music ("Dive Bars of Mars") that loops
- Audio controls for muting/unmuting
- Responsive design for various screen sizes
- Loading screen with progress indicator

## Setup Instructions

1. **Clone the repository**
   ```
   git clone [your-repository-url]
   cd [repository-name]
   ```

2. **Add your audio file**
   - Place your MP3 file in the `assets/audio` directory
   - Rename it to `divebarsofmars.mp3` or update the file path in `js/main.js`

3. **Add the astronaut model**
   - Place the astronaut.fbx file in the `assets/models` directory

4. **Testing locally**
   Due to browser security restrictions, you'll need to serve the files from a local web server.
   
   Option 1: Using Python's built-in server
   ```
   # Python 3
   python -m http.server
   
   # Python 2
   python -m SimpleHTTPServer
   ```
   
   Option 2: Using Node.js's http-server
   ```
   npm install -g http-server
   http-server
   ```
   
   Then open your browser and navigate to `http://localhost:8000` (or the port indicated in your terminal).

## Deploying to GitHub Pages

1. **Create a GitHub repository** (if you haven't already)

2. **Push your code to GitHub**
   ```
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll down to the GitHub Pages section
   - Select the branch you want to deploy (usually `main`)
   - Save the settings

4. **Access your deployed site**
   Your site will be available at `https://[your-username].github.io/[repository-name]/`

## Controls

- **Left mouse button + drag**: Rotate the camera around the astronaut
- **Mouse wheel**: Zoom in and out
- **Start Experience button**: Begin the audio and full experience
- **Mute button**: Toggle audio on/off

## Customization

### Changing the Star Field

You can modify the star field in the `createStarField()` method within `js/main.js`. Some ideas:
- Adjust the number of stars by changing `particleCount`
- Modify star colors in the `colorOptions` array
- Change the distribution pattern or density

### Adjusting Astronaut Animation

Tune how the astronaut moves in the `updateAstronautAndStars()` method:
- Modify floating animation speed and amplitude
- Adjust rotation speed
- Change how the audio affects the model

## Technologies Used

- Three.js for 3D rendering
- Web Audio API for audio analysis
- HTML5 Audio for playback
- CSS3 for styling
- JavaScript (ES6+) for logic

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js community for the powerful 3D library
- Web Audio API developers for audio analysis capabilities
