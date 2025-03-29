# Music Video Experience

A Three.js-based interactive music visualization for web browsers, designed to be hosted on GitHub Pages.

## Features

- Interactive 3D visualization that reacts to music
- Audio playback controls (play, pause, seek)
- Responsive design for various screen sizes
- Particle system and geometric shapes that respond to audio frequencies
- Loading screen with progress indicator

## Setup Instructions

1. **Clone the repository**
   ```
   git clone [your-repository-url]
   cd [repository-name]
   ```

2. **Add your music**
   - Place your MP3 file in the `assets/audio` directory
   - Rename it to `music.mp3` or update the file path in `js/main.js`

3. **Testing locally**
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

## Customization

### Changing Visuals

You can modify the visual elements in the `createVisualElements()` method within `js/main.js`. Some ideas:
- Change the geometry type (cube, sphere, torus, etc.)
- Adjust particle count and distribution
- Modify color schemes and lighting

### Adjusting Audio Response

Tune how the visuals respond to audio in the `updateVisuals()` method of `js/main.js`:
- Modify the frequency bands used for color mapping
- Adjust scaling factors for more or less dramatic responses
- Change the animation speed and movement patterns

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
