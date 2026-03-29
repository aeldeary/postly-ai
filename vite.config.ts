
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    base: '/postly-ai/',
    plugins: [react()],
    define: {
      // API key is loaded from localStorage at runtime - never hardcoded
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})
