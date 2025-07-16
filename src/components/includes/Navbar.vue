<template>
    <nav :class="['fixed top-0 left-0 w-full z-50 transition-shadow bg-white', { 'shadow-md': isSticky }]">
        <div class="container mx-auto flex items-center justify-between py-3 px-4 md:px-0">
            <!-- Logo -->
            <a href="/" class="flex items-center">
                <img :src="mainLogo" alt="Logo" class="h-12" />
            </a>

            <!-- Desktop Menu -->
            <ul class="hidden md:flex space-x-6 font-medium text-gray-700 mb-0">
                <li><router-link to="/" class="nav-link" active-class="text-blue-700">Home</router-link></li>
                <li><router-link to="/tournaments" class="hover:text-blue-600 nav-link"
                        active-class="text-blue-700">Tournaments</router-link></li>
                <li><router-link to="/players" class="hover:text-blue-600 nav-link"
                        active-class="text-blue-700">Players</router-link></li>
                <li><router-link to="/teams" class="hover:text-blue-600 nav-link"
                        active-class="text-blue-700">Teams</router-link></li>
                <li><router-link to="/team" class="hover:text-blue-600 nav-link" active-class="text-blue-700">Team</router-link>
                </li>
            </ul>

            <!-- Desktop Button -->
            <button class="btn btn-sm btn-primary" type="button">Create Account</button>

            <!-- Mobile Hamburger Button -->
            <button @click="toggleMenu" class="md:hidden focus:outline-none" aria-label="Toggle Menu">
                <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Mobile Menu -->
        <transition name="slide-fade">
            <div v-if="isMenuOpen" class="md:hidden bg-white shadow-md">
                <ul class="flex flex-col space-y-2 px-4 py-4 text-gray-700 font-medium">
                    <li><router-link @click.native="closeMenu" to="/">Home</router-link></li>
                    <li><router-link @click.native="closeMenu" to="/features">Features</router-link></li>
                    <li><router-link @click.native="closeMenu" to="/services">Services</router-link></li>
                    <li><router-link @click.native="closeMenu" to="/reviews">Reviews</router-link></li>
                    <li><router-link @click.native="closeMenu" to="/team">Team</router-link></li>
                    <li><router-link @click.native="closeMenu" to="/pricing">Pricing</router-link></li>
                    <li><router-link @click.native="closeMenu" to="/contact">Contact</router-link></li>
                    <li>
                        <button @click="closeMenu"
                            class="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="button">
                            Create Account
                        </button>
                    </li>
                </ul>
            </div>
        </transition>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import mainLogo from '../../assets/main-logo.png'

const isMenuOpen = ref(false)
const isSticky = ref(false)

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}
function closeMenu() {
    isMenuOpen.value = false
}

// Sticky nav on scroll
function handleScroll() {
    isSticky.value = window.scrollY > 50
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Slide fade transition for mobile menu */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

</style>
