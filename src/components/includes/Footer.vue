<template>
    <footer class="bg-red-100 text-white py-6 flex flex-col items-center" :style="{ backgroundImage: `url(${bgHome})` }">
      <!-- Brand Logo -->
      <div class="mb-2">
        <img :src="mainLogo" alt="Brand Logo" class="h-10" />
      </div>
  
      <!-- Footer Text -->
      <p class="text-sm mb-1 text-gray-700">{{ text }}</p>
  
      <!-- Copyright -->
      <p class="text-xs text-gray-700">&copy; {{ currentYear }} {{ brandName }}. All rights reserved.</p>
    </footer>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Props or reactive variables
  import mainLogo from '../../assets/main-logo-dark.png'
  import bgHome from '../../assets/bg/bg-home.png'
  const brandName = 'AlgoHive IT Solutions';
  const text = 'Live scores, updates, and highlights from around the world';
  const currentYear = new Date().getFullYear();
  </script>
  
  <style scoped>
  footer img {
    max-height: 50px;
  }
  </style>
  