<template>
    <nav :class="['fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white',
        isSticky ? 'shadow-md' : 'shadow-sm border-b border-slate-100']">
        <div class="w-full px-4 lg:px-8 flex items-center justify-between py-3">

            <!-- Logo -->
            <router-link to="/" class="flex items-center flex-shrink-0">
                <img :src="mainLogo" alt="MadCricketers" class="h-10" />
            </router-link>

            <!-- Desktop Menu (center) -->
            <ul class="hidden lg:flex items-center gap-5 list-none m-0 p-0">
                <li v-for="link in navLinks" :key="link.path">
                    <router-link :to="link.path"
                        class="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors nav-link whitespace-nowrap"
                        active-class="text-red-600 font-semibold">
                        {{ link.label }}
                    </router-link>
                </li>
            </ul>

            <!-- Desktop CTA buttons (right) -->
            <div class="hidden lg:flex items-center gap-2 flex-shrink-0">
                <router-link to="/registration"
                    class="btn-cta-primary text-sm px-4 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap">
                    Registration
                </router-link>
                <a href="https://app.madcricketers.com/" target="_blank"
                    class="btn-cta-outline text-sm px-4 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap">
                    Login
                </a>
            </div>

            <!-- Mobile: right side = hamburger only -->
            <button @click="toggleMenu"
                class="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none"
                aria-label="Toggle Menu">
                <svg v-if="!isMenuOpen" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg v-else class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Mobile Menu -->
        <transition name="slide-down">
            <div v-if="isMenuOpen" class="lg:hidden bg-white border-t border-slate-100 shadow-lg">
                <ul class="list-none m-0 p-0 px-4 py-3 space-y-1">
                    <li v-for="link in navLinks" :key="link.path">
                        <router-link :to="link.path" @click="closeMenu"
                            class="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors no-underline"
                            active-class="bg-red-50 text-red-600">
                            {{ link.label }}
                        </router-link>
                    </li>
                </ul>
                <div class="px-4 pb-4 flex flex-col gap-2">
                    <router-link to="/registration" @click="closeMenu"
                        class="btn-cta-primary text-sm text-center py-2.5 rounded-lg font-semibold transition-all">
                        Registration
                    </router-link>
                    <a href="https://app.madcricketers.com/" target="_blank"
                        class="btn-cta-outline text-sm text-center py-2.5 rounded-lg font-semibold transition-all">
                        Admin Login
                    </a>
                </div>
            </div>
        </transition>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import mainLogo from '../../assets/main-logo-dark.png'

const isMenuOpen = ref(false)
const isSticky = ref(false)

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/tournaments', label: 'Tournaments' },
    { path: '/fixtures', label: 'Fixtures' },
    { path: '/players', label: 'Players' },
    { path: '/contact-us', label: 'Contact' },
]

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu = () => { isMenuOpen.value = false }

const handleScroll = () => { isSticky.value = window.scrollY > 40 }

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.btn-cta-primary {
    background-color: #D84040;
    color: #fff;
    border: 1.5px solid #D84040;
    display: inline-block;
    text-decoration: none;
}

.btn-cta-primary:hover {
    background-color: #c03030;
    border-color: #c03030;
    color: #fff;
}

.btn-cta-outline {
    background-color: transparent;
    color: #D84040;
    border: 1.5px solid #D84040;
    display: inline-block;
    text-decoration: none;
}

.btn-cta-outline:hover {
    background-color: #D84040;
    color: #fff;
}

/* Slide down animation for mobile menu */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
