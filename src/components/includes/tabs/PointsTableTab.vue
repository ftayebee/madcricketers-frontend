<template>
    <div class="bg-slate-50 min-h-screen py-8">
        <div class="container mx-auto px-4 max-w-4xl">

            <h3 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
                <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                {{ tournament.name }} — Points Table
            </h3>

            <div v-if="!pointGroups.length"
                class="bg-white rounded-xl border border-slate-100 p-10 text-center text-slate-400 text-sm">
                Points table not available yet.
            </div>

            <template v-else>
                <!-- Group tabs -->
                <div v-if="pointGroups.length > 1" class="flex flex-wrap gap-2 mb-5">
                    <button v-for="group in pointGroups" :key="group" @click="activeGroup = group"
                        :class="['px-4 py-1.5 text-xs font-semibold rounded-full border transition',
                            activeGroup === group
                                ? 'bg-red-600 text-white border-red-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-red-300']">
                        {{ group }}
                    </button>
                </div>

                <div class="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-slate-800 text-white text-xs uppercase tracking-wide">
                                <th class="px-4 py-3 text-left">#</th>
                                <th class="px-4 py-3 text-left">Team</th>
                                <th class="px-3 py-3 text-center">P</th>
                                <th class="px-3 py-3 text-center">W</th>
                                <th class="px-3 py-3 text-center">L</th>
                                <th class="px-3 py-3 text-center hidden sm:table-cell">NRR</th>
                                <th class="px-3 py-3 text-center font-bold">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(team, idx) in pointsTable[activeGroup]" :key="team.name"
                                :class="['border-t border-slate-50 transition-colors hover:bg-slate-50',
                                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40']">
                                <td class="px-4 py-3 text-slate-400 text-xs font-semibold">{{ idx + 1 }}</td>
                                <td class="px-4 py-3 font-semibold text-slate-800">{{ team.name }}</td>
                                <td class="px-3 py-3 text-center text-slate-500">{{ team.p }}</td>
                                <td class="px-3 py-3 text-center text-emerald-600 font-semibold">{{ team.w }}</td>
                                <td class="px-3 py-3 text-center text-red-500">{{ team.l }}</td>
                                <td class="px-3 py-3 text-center text-slate-400 text-xs hidden sm:table-cell">
                                    {{ typeof team.nrr === 'number' ? (team.nrr >= 0 ? '+' : '') + team.nrr.toFixed(3) : team.nrr }}
                                </td>
                                <td class="px-3 py-3 text-center">
                                    <span class="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {{ team.pts }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>

        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    tournament: {
        type: Object,
        required: true
    }
})

const pointGroups = ref([])
const pointsTable = ref({})
const activeGroup = ref('')

watch(() => props.tournament, (tournament) => {
    if (!tournament?.points_table?.length) return

    pointGroups.value = tournament.points_table.map(g => g.group_name)
    activeGroup.value = pointGroups.value[0] || ''

    const table = {}
    tournament.points_table.forEach(group => {
        table[group.group_name] = group.teams.map(team => ({
            name: team.team_name || team.name,
            p:    team.played   ?? team.matches_played ?? team.p   ?? 0,
            w:    team.won      ?? team.wins           ?? team.w   ?? 0,
            l:    team.lost     ?? team.losses         ?? team.l   ?? 0,
            nrr:  team.nrr ?? 0,
            pts:  team.points   ?? team.pts ?? 0,
        }))
    })
    pointsTable.value = table
}, { immediate: true })
</script>
