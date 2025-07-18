<template>
    <div class="container mx-auto px-4 mt-6">
        <div class="flex flex-col md:flex-row gap-4">
            <!-- Team Sidebar -->
            <div class="w-full md:w-1/4 border rounded p-3 bg-gray-50">
                <h3 class="text-lg font-semibold mb-3 text-gray-800">Teams</h3>
                <ul>
                    <li v-for="team in squadsWithCount" :key="team.name" @click="activeTeam = team" :class="[
                        'cursor-pointer p-2 rounded mb-1',
                        activeTeam?.name === team.name ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                    ]">
                        {{ team.name }} ({{ team.playerCount }})
                    </li>
                </ul>
            </div>

            <!-- Player List -->
            <div class="w-full md:w-3/4 border rounded p-4 bg-white">
                <div v-if="activeTeam">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">{{ activeTeam.name }} Squad</h3>

                    <div v-if="groupedPlayers.batters.length" class="mb-6">
                        <h4 class="font-semibold mb-2 text-blue-700">Batters ({{ groupedPlayers.batters.length }})</h4>
                        <ul class="list-disc ml-6 text-gray-700">
                            <li v-for="player in groupedPlayers.batters" :key="player.name">{{ player.name }}</li>
                        </ul>
                    </div>

                    <div v-if="groupedPlayers.bowlers.length" class="mb-6">
                        <h4 class="font-semibold mb-2 text-green-700">Bowlers ({{ groupedPlayers.bowlers.length }})</h4>
                        <ul class="list-disc ml-6 text-gray-700">
                            <li v-for="player in groupedPlayers.bowlers" :key="player.name">{{ player.name }}</li>
                        </ul>
                    </div>

                    <div v-if="groupedPlayers.allRounders.length" class="mb-6">
                        <h4 class="font-semibold mb-2 text-purple-700">All-Rounders ({{
                            groupedPlayers.allRounders.length
                            }})</h4>
                        <ul class="list-disc ml-6 text-gray-700">
                            <li v-for="player in groupedPlayers.allRounders" :key="player.name">{{ player.name }}</li>
                        </ul>
                    </div>
                </div>
                <div v-else class="text-gray-500 text-sm">Select a team to view its squad.</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    tournament: {
        type: Object,
        required: true
    }
})

// Extract squads from tournament
const squads = ref(props.tournament?.teams || [])
const activeTeam = ref(null)

watch(
    () => squads.value,
    (val) => {
        if (val?.length) {
            activeTeam.value = val[0]
        }
    },
    { immediate: true }
)

// Compute players grouped by role
const groupedPlayers = computed(() => {
    const result = {
        batters: [],
        bowlers: [],
        allRounders: []
    }

    if (!activeTeam.value || !activeTeam.value.players) return result

    for (const player of activeTeam.value.players) {
        const role = (player.role || '').toLowerCase()

        if (role.includes('batter') || role.includes('batsman')) {
            result.batters.push(player)
        } else if (role.includes('bowler')) {
            result.bowlers.push(player)
        } else if (role.includes('all') || role.includes('rounder')) {
            result.allRounders.push(player)
        }
    }

    return result
})

// Add total player count to each team for display
const squadsWithCount = computed(() =>
    squads.value.map(team => ({
        ...team,
        playerCount: team.players?.length || 0
    }))
)
</script>