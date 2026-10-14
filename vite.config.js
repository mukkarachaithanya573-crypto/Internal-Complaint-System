import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            // When backend server on port 5000 is not running, gracefully respond with 200 empty/fallback
            if (res.writeHead) {
              res.writeHead(200, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({ success: false, offline: true, message: 'Backend offline, using client-side Firestore mode' }));
            }
          });
        },
      },
    },
  },
});
