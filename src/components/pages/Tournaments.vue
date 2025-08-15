<template>
    <section id="home" class="bg-home bg-cover bg-center" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center py-24" style="padding-top: 7rem;">
            <div class="container mx-auto px-4">
                <div class="flex flex-wrap -mx-4">
                    <div class="w-full lg:w-12/12 px-4">

                        <h5 class="mb-6 text-white text-2xl font-bold flex items-center gap-2">
                            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M9.75 6.75v10.5M14.25 6.75v10.5M4.5 8.25H19.5M6.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 17.25V6.75A2.25 2.25 0 016.75 4.5z" />
                            </svg>
                            Currently Running
                        </h5>

                        <!-- Loader -->
                        <div v-if="loading" class="flex justify-center py-16">
                            <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        </div>

                        <!-- Error -->
                        <div v-else-if="error" class="text-center text-red-400 py-6">
                            Failed to load tournaments. Please try again later.
                        </div>

                        <!-- Empty State -->
                        <div v-else-if="tournaments.length === 0" class="text-center text-gray-300 py-10">
                            No tournaments available.
                        </div>

                        <!-- Tournament Cards -->
                        <div v-else class="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                            <TournamentCard v-for="tournament in tournaments" :key="tournament.id"
                                :tournament="tournament" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TournamentCard from '../includes/TournamentCard.vue';
import bgHome from './../../assets/bg/bg-home.png';
import { fetchTournaments } from './../api/tournaments';

const tournaments = ref([]);
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
    try {
        loading.value = true;
        tournaments.value = await fetchTournaments();
    } catch (err) {
        error.value = true;
        console.error('Error fetching tournaments:', err);
    } finally {
        loading.value = false;
    }
});
</script>
