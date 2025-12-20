
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1200, // Aumentado para silenciar avisos de bibliotecas grandes
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: {
          // Solução de Code Splitting: Separa libs pesadas em arquivos próprios
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          ai: ['@google/genai']
        }
      }
    }
  },
  server: {
    port: 3000,
  }
});
