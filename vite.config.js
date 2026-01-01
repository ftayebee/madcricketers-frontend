import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vue-toastification', 'axios', 'vue-picture-cropper']
  },
});
