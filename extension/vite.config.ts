import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-files',
      writeBundle() {
        // Create dist directory if it doesn't exist
        if (!existsSync('dist')) {
          mkdirSync('dist', { recursive: true });
        }
        if (!existsSync('dist/icons')) {
          mkdirSync('dist/icons', { recursive: true });
        }

        // Copy manifest.json
        copyFileSync('manifest.json', 'dist/manifest.json');

        // Copy icons if they exist
        const iconSizes = [16, 48, 128];
        iconSizes.forEach((size) => {
          const iconPath = `public/icons/icon${size}.png`;
          if (existsSync(iconPath)) {
            copyFileSync(iconPath, `dist/icons/icon${size}.png`);
          }
        });
      },
    },
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep background script at root level for manifest
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    sourcemap: process.env.NODE_ENV === 'development',
  },
});
