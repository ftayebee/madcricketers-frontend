<template>
    <div class="container bg-white min-h-screen">
        <div class="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Featured Matches -->
                <div class="tournament-card bg-white transition-all duration-300 mb-10 flex items-start gap-3">
                    <img :src="tournament?.logo || placeholderImg" @error="onImageError" alt="Tournament Logo"
                        class="w-16 h-16 object-cover rounded-full border-2 border-gray-200" />

                    <!-- Info Section -->
                    <div class="flex-1">
                        <h6 class=" text-gray-800 mb-1">{{ match?.title }}</h6>
                        <h5 class="text-xl font-bold text-gray-800 mt-2 mb-0">{{ tournament?.name }}</h5>
                    </div>
                </div>

                <div class="">
                    <p class="text-md font-bold text-gray-800 mb-1">📅 {{ formattedDate }}</p>
                    <p class="text-md text-gray-500 mt-2 mb-0">📍 {{ match.venue }}</p>
                </div>

                <div>
                    <h5 class="text-md font-bold text-gray-800 mb-3">
                        Team Form
                        <small>(Last 5 Matches)</small>
                    </h5>

                    <div v-for="team in teamInfo" :key="team.id" class="flex items-center gap-4 mb-2 justify-between">
                        <div class="flex gap-2">
                            <img :src="team.team_logo" alt="team logo" class="w-8 h-8" />
                            <span class="font-medium m-0">{{ team.team_name }}</span>
                        </div>

                        <div class="flex gap-1">
                            <span v-for="(result, index) in team.form" :key="index" class="px-2 py-1 rounded text-xs"
                                :class="{
                                    'bg-green-500': result === 'W',
                                    'bg-red-400': result === 'L',
                                    'bg-gray-200': result !== 'W' && result !== 'L',
                                    'text-dark': result == '-',
                                    'text-white': result != '-'
                                }">
                                {{ result == '-' ? '•' : result }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-8">
                <h4 class="text-lg font-semibold mb-3">Playing XI</h4>

                <div>
                    <!-- Tabs -->
                    <div class="flex mb-4 space-x-4">
                        <button v-for="(team, index) in teamInfo" :key="index"
                            class="px-4 py-2 font-medium border rounded-md transition duration-200" :class="activeTab === index
                                ? 'bg-green-500 text-white border-green-500'
                                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100'" @click="activeTab = index">
                            {{ team.team_name }}
                        </button>
                    </div>

                    <div v-if="teamInfo.length && teamInfo[activeTab]" class="grid grid-cols-2 gap-4">
                        <div v-for="(player, idx) in teamInfo[activeTab].players" :key="idx"
                            class="bg-gray-100 p-2 rounded flex items-center gap-3">
                            <img :src="player.image || 'https://via.placeholder.com/40'" alt="Player Image"
                                class="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p class="text-sm font-medium text-gray-800 mb-1">{{ player.name }}</p>
                                <p class="text-xs text-gray-600">{{ formatRole(player.role) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import placeholderImg from './../../../assets/images/logo-placeholder.jpg';
import { useRoute } from 'vue-router'
import { fetchTeamInfo } from './../../api/matches'

const props = defineProps({
    tournament: {
        type: Object,
        required: true
    },
    match: {
        type: Object,
        required: true
    }
});

const pointGroups = ref([]);
const pointsTable = ref({});
const activeGroup = ref('');
const teamInfo = ref([]);
const route = useRoute();
const activeTab = ref(0);

onMounted(async () => {
    try {
        const id = route.params.id

        if (!id) {
            console.error('ID not found in route params')
            return
        }
        teamInfo.value = await fetchTeamInfo(id);
    } catch (error) {
        console.error('Error fetching team form:', error);
    }
});

watch(() => props.tournament, (tournament) => {
    if (tournament && tournament.points_table) {
        pointGroups.value = tournament.points_table.map(group => group.group_name);
        activeGroup.value = pointGroups.value[0] || '';

        const table = {};
        tournament.points_table.forEach(group => {
            table[group.group_name] = group.teams.map(team => ({
                name: team.team_name || team.name,
                p: team.p || 0,
                w: team.w || 0,
                l: team.l || 0,
                nrr: team.nrr || '0.00',
                pts: team.pts || 0,
            }));
        });
        pointsTable.value = table;
    }
}, { immediate: true });

const formattedDate = computed(() => {
    const date = new Date(props.match.match_date);
    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };
    return date.toLocaleString('en-US', options);
});

const formatRole = (role) => {
    return role
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
</script>