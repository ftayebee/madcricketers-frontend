<template>
    <!-- <div class="container bg-white min-h-screen">
        <div class="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <div class="flex align-middle justify-between">
                    <div v-for="(player, idx) in teamInfo[activeTab].players" :key="idx"
                        class="bg-gray-100 p-2 rounded flex items-center gap-3">
                        <img :src="player.image || 'https://via.placeholder.com/40'" alt="Player Image"
                            class="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p class="text-sm font-medium text-gray-800 mb-1">{{ player.name }}</p>
                            <p class="text-xs text-gray-600">{{ runs (balls) }}</p>
                        </div>
                    </div>

                    <div v-for="(player, idx) in teamInfo[activeTab].players" :key="idx"
                        class="bg-gray-100 p-2 rounded flex items-center gap-3">
                        <img :src="player.image || 'https://via.placeholder.com/40'" alt="Player Image"
                            class="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p class="text-sm font-medium text-gray-800 mb-1">{{ player.name }}</p>
                            <p class="text-xs text-gray-600">{{ runs (balls) }}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <p>Partnerships: <span>runs (balls)</span></p>
                    <p>Last Wicket: Player Name Runs (Balls)</p>
                </div>

                <div>
                    
                </div>
            </div>

            <div class="space-y-8">
                <h4 class="text-lg font-semibold mb-3">Probability</h4>
                <h4 class="text-lg font-semibold mb-3">Projected Score <small class="text-sm text-gray-600">as per RR</small></h4>
                
            </div>
        </div>
    </div> -->
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
    tournament: {
        type: Object,
        required: false
    },
});

const pointGroups = ref([]);
const pointsTable = ref({});
const activeGroup = ref('');

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
</script>