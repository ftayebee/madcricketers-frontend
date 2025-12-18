<template>
    <div class="container bg-white min-h-screen">
        <div class="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8">
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Scorecard</h3>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-8">
                <h4 class="text-lg font-semibold mb-3">Yet To Bat</h4>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
    match: {
        type: Object,
        required: true
    }
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