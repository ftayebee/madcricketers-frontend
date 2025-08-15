<template>
    <section id="home" class="bg-home bg-cover bg-center" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center py-24 pb-5" style="padding-top: 7rem;">
            <div class="container mx-auto px-4">
                <div class="flex flex-wrap -mx-4">
                    <div class="w-full lg:w-12/12 px-4">
                        <h5 class="mb-6 text-white text-2xl font-bold flex items-center gap-2">
                            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M9.75 6.75v10.5M14.25 6.75v10.5M4.5 8.25H19.5M6.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 17.25V6.75A2.25 2.25 0 016.75 4.5z" />
                            </svg>
                            Key Stats
                        </h5>
                    </div>
                </div>
                <div class="flex flex-wrap -mx-4">
                    <div class="w-full sm:w-1/2 md:w-1/4 px-2 mb-6 flex" v-for="player in highestRankedPlayers"
                        :key="player.name">
                        <div class="border rounded-lg shadow-sm p-4 bg-white w-full flex flex-col h-full">
                            <!-- Category -->
                            <div class="text-sm font-semibold text-gray-600 mb-3">
                                {{ player.category }}
                            </div>

                            <!-- Player Info Row -->
                            <div class="flex items-center justify-between mt-auto">
                                <!-- Left: Image + Name/Team -->
                                <div class="flex items-center space-x-3">
                                    <img :src="player.image" alt="Player Image"
                                        class="w-12 h-12 rounded-full object-cover border" />
                                    <div>
                                        <div class="font-bold text-gray-900">{{ player.name }}</div>
                                        <div class="text-xs text-gray-500">{{ player.team }}</div>
                                    </div>
                                </div>

                                <!-- Right: Value -->
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-gray-800">{{ player.value }}</div>
                                    <div class="text-xs text-gray-500">{{ player.unit }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import bgHome from './../../assets/bg/bg-home.png';
import { fetchPlayerList } from './../api/players';

const playersList = ref([]);
const loading = ref(true);
const error = ref(false);

const highestRankedPlayers = [
    {
        category: "Most Runs",
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        name: "Ravi Sharma",
        team: "Rajshahi Royals",
        value: 482
    },
    {
        category: "Most Wickets",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        name: "Imran Hossain",
        team: "Dhaka Dynamites",
        value: 21
    },
    {
        category: "Most Sixes",
        image: "https://randomuser.me/api/portraits/men/78.jpg",
        name: "Alex Johnson",
        team: "Chattogram Challengers",
        value: 26
    },
    {
        category: "Best Strike Rate",
        image: "https://randomuser.me/api/portraits/men/34.jpg",
        name: "Shakib Rahman",
        team: "Sylhet Sixers",
        value: "178.45"
    }
];


onMounted(async () => {
    try {
        loading.value = true;

        const list = await fetchPlayerList();

        if (Array.isArray(list)) {
            playersList.value = list;
            console.log("Players Count:", playersList.value.length);
        } else {
            playersList.value = [];
            console.warn("⚠ fetchPlayerList() did not return an array:", list);
        }

    } catch (err) {
        error.value = true;
        console.error('Error fetching players:', err);
    } finally {
        loading.value = false;
    }
});
</script>
