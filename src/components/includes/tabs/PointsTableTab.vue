<template>
    <div class="container mx-auto px-4 bg-white min-h-screen">
        <div class="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Points Table -->
                <div v-if="pointGroups.length">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">{{tournament.name}} Points Table</h3>
                    <div class="flex space-x-2 mb-2">
                        <button v-for="(group, idx) in pointGroups" :key="idx" @click="activeGroup = group" :class="[
                            'px-3 py-1 text-sm rounded',
                            activeGroup === group
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700',
                        ]">
                            {{ group }}
                        </button>
                    </div>
                    <table class="w-full text-sm text-left border rounded overflow-hidden">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-3 py-2">Team</th>
                                <th class="px-3 py-2">P</th>
                                <th class="px-3 py-2">W</th>
                                <th class="px-3 py-2">L</th>
                                <th class="px-3 py-2">NRR</th>
                                <th class="px-3 py-2">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="team in pointsTable[activeGroup]" :key="team.name" class="border-t">
                                <td class="px-3 py-2">{{ team.name }}</td>
                                <td class="px-3 py-2">{{ team.p }}</td>
                                <td class="px-3 py-2">{{ team.w }}</td>
                                <td class="px-3 py-2">{{ team.l }}</td>
                                <td class="px-3 py-2">{{ team.nrr }}</td>
                                <td class="px-3 py-2">{{ team.pts }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="text-gray-500 text-sm">Points table not available.</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
    tournament: {
        type: Object,
        required: true
    }
});

const pointGroups = ref([]);
const pointsTable = ref({});
const activeGroup = ref('');

watch(() => props.tournament, (tournament) => {
    if (tournament && tournament.points_table) {
        // Extract group names
        pointGroups.value = tournament.points_table.map(group => group.group_name);

        // Set first group as active
        activeGroup.value = pointGroups.value[0] || '';

        // Build pointsTable map
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