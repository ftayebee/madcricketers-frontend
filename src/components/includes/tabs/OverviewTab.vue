<template>
    <div class="bg-slate-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- ===== Left: Featured Matches ===== -->
                <div class="lg:col-span-2 space-y-6">

                    <!-- Matches -->
                    <div>
                        <h3 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                            Featured Matches
                        </h3>

                        <div v-if="tournament.matches && tournament.matches.length" class="space-y-2">
                            <MatchRow v-for="match in tournament.matches" :key="match.id" :match="match" />
                        </div>
                        <div v-else class="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm">
                            No matches scheduled yet.
                        </div>
                    </div>

                    <!-- Points Table (summary — first group only) -->
                    <div v-if="pointGroups.length">
                        <h3 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                            Points Table
                        </h3>

                        <!-- Group tabs (only if multiple groups) -->
                        <div v-if="pointGroups.length > 1" class="flex flex-wrap gap-2 mb-3">
                            <button v-for="group in pointGroups" :key="group" @click="activeGroup = group"
                                :class="['px-3 py-1 text-xs font-semibold rounded-full border transition',
                                    activeGroup === group
                                        ? 'bg-red-600 text-white border-red-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-red-300']">
                                {{ group }}
                            </button>
                        </div>

                        <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="bg-slate-800 text-white text-xs uppercase tracking-wide">
                                        <th class="px-4 py-3 text-left">Team</th>
                                        <th class="px-3 py-3 text-center">P</th>
                                        <th class="px-3 py-3 text-center">W</th>
                                        <th class="px-3 py-3 text-center">L</th>
                                        <th class="px-3 py-3 text-center">NRR</th>
                                        <th class="px-3 py-3 text-center font-bold">Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(team, idx) in pointsTable[activeGroup]" :key="team.name"
                                        :class="['border-t border-slate-50', idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50']">
                                        <td class="px-4 py-3 font-semibold text-slate-800">{{ team.name }}</td>
                                        <td class="px-3 py-3 text-center text-slate-500">{{ team.p }}</td>
                                        <td class="px-3 py-3 text-center text-emerald-600 font-semibold">{{ team.w }}</td>
                                        <td class="px-3 py-3 text-center text-red-500">{{ team.l }}</td>
                                        <td class="px-3 py-3 text-center text-slate-500 text-xs">{{ team.nrr }}</td>
                                        <td class="px-3 py-3 text-center font-bold text-slate-900">{{ team.pts }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                <!-- ===== Right: Key Stats ===== -->
                <div>
                    <h3 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                        Key Stats
                    </h3>

                    <div v-if="keyStats.length" class="space-y-3">
                        <KeyStat v-for="stat in keyStats" :key="stat.label" :stat="stat" :title="stat.label" />
                    </div>
                    <div v-else
                        class="bg-white rounded-xl border border-slate-100 p-6 text-center text-slate-400 text-sm">
                        No stats available yet.
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MatchRow from './../MatchRow.vue'
import KeyStat from './../../includes/KeyStat.vue'

const props = defineProps({
    tournament: {
        type: Object,
        required: true
    }
})

const pointGroups = ref([])
const pointsTable = ref({})
const activeGroup = ref('')

// key_stats is now a flat array from the API
const keyStats = computed(() => Array.isArray(props.tournament?.key_stats) ? props.tournament.key_stats : [])

watch(() => props.tournament, (tournament) => {
    if (!tournament?.points_table?.length) return

    pointGroups.value = tournament.points_table.map(g => g.group_name)
    activeGroup.value = pointGroups.value[0] || ''

    const table = {}
    tournament.points_table.forEach(group => {
        table[group.group_name] = group.teams.map(team => ({
            name: team.team_name || team.name,
            p:    team.played   ?? team.p   ?? 0,
            w:    team.won      ?? team.w   ?? 0,
            l:    team.lost     ?? team.l   ?? 0,
            nrr:  team.nrr ?? '0.00',
            pts:  team.points   ?? team.pts ?? 0,
        }))
    })
    pointsTable.value = table
}, { immediate: true })
</script>
