// Vite configuration file for the Email Writer React application
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Configure Vite to use the React plugin for JSX support and hot reloading
  plugins: [react()],
})
