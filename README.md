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

2. **Install dependencies**
   ```
   npm install
   ```

3. **Add your audio file**
   - Place your MP3 file in the `assets/audio` directory
   - Rename it to `divebarsofmars.mp3` or update the file path in the code

4. **Add the astronaut model**
   - Place the astronaut.fbx file in the `assets/models` directory

5. **Development server**
   Run the development server with hot-reload:
   ```
   npm run dev
   ```
   Then open your browser and navigate to `http://localhost:5173` (or the port indicated in your terminal).

6. **Building for production**
   To create a production build:
   ```
   npm run build
   ```
   This will generate optimized files in the `dist` directory.

7. **Preview production build**
   To preview the production build locally:
   ```
   npm run preview
   ```

## Deploying to GitHub Pages

### Automated Deployment

This project includes a GitHub Actions workflow that automatically builds and deploys the site to GitHub Pages whenever changes are pushed to the main branch.

1. **Setup GitHub repository** (if you haven't already)
   - Create a new repository on GitHub
   - Push your code to the repository

2. **Enable GitHub Pages with GitHub Actions**
   - Go to your repository settings
   - Navigate to "Pages" in the sidebar
   - Under "Build and deployment", select "GitHub Actions" as the source
   - The workflow in `.github/workflows/deploy.yml` will handle the rest

3. **Access your deployed site**
   Your site will be available at `https://[your-username].github.io/[repository-name]/`

### Manual Deployment

If you prefer to deploy manually:

1. **Build the project**
   ```
   npm run build
   ```

2. **Deploy the `dist` folder**
   - You can use the `gh-pages` package:
     ```
     npm install -g gh-pages
     gh-pages -d dist
     ```
   - Or manually push the contents of the `dist` folder to the `gh-pages` branch

## Project Structure

- `src/` - Source files
- `public/` - Static assets that are copied to the build directory
- `dist/` - Build output (generated after running `npm run build`)
- `vite.config.js` - Vite configuration
- `.github/workflows/` - GitHub Actions workflow for automated deployment

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
- Vite for build tooling and development server
- GitHub Actions for CI/CD

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js community for the powerful 3D library
- Web Audio API developers for audio analysis capabilities
