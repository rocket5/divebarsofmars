import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base path for GitHub Pages, use '/' if deploying to custom domain or root
  base: '/divebarsofmars/',
  
  // Configure the build output
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  
  // Resolve asset paths
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}); 