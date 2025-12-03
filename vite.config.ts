
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // If API_KEY is not set, default to empty string to prevent build errors or runtime crashes
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})
