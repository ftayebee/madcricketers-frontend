<template>
    <div class="bg-slate-50 min-h-screen py-8">
        <div class="container mx-auto px-4">

            <h3 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
                <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                Team Squads
            </h3>

            <div v-if="!squads.length"
                class="bg-white rounded-xl border border-slate-100 p-10 text-center text-slate-400 text-sm">
                No squads available yet.
            </div>

            <div v-else class="flex flex-col lg:flex-row gap-6">

                <!-- Team Sidebar -->
                <div class="w-full lg:w-56 flex-shrink-0">
                    <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                        <div class="px-4 py-3 border-b border-slate-100 bg-slate-50">
                            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider m-0">Teams</p>
                        </div>
                        <ul class="p-2 space-y-1 list-none m-0">
                            <li v-for="team in squads" :key="team.id || team.name">
                                <button @click="activeTeam = team"
                                    :class="['w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left',
                                        activeTeam?.name === team.name
                                            ? 'bg-red-600 text-white'
                                            : 'text-slate-700 hover:bg-slate-50']">
                                    <div :class="['w-7 h-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 text-xs font-bold',
                                        activeTeam?.name === team.name ? 'bg-white/20' : 'bg-slate-100 text-slate-500']">
                                        <img v-if="team.logo && !team.logo.includes('team-dummy')"
                                            :src="team.logo" @error="hideImg($event)"
                                            class="w-full h-full object-cover" />
                                        <span v-else>{{ abbr(team.name) }}</span>
                                    </div>
                                    <span class="truncate">{{ team.name }}</span>
                                    <span :class="['ml-auto text-xs flex-shrink-0',
                                        activeTeam?.name === team.name ? 'text-white/70' : 'text-slate-400']">
                                        {{ team.players?.length || 0 }}
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Player List -->
                <div class="flex-1 min-w-0">
                    <div v-if="!activeTeam" class="bg-white rounded-xl border border-slate-100 p-10 text-center text-slate-400 text-sm">
                        Select a team to view its squad.
                    </div>

                    <template v-else>
                        <!-- Team header -->
                        <div class="bg-white rounded-xl border border-slate-100 p-4 mb-4 flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                                <img v-if="activeTeam.logo && !activeTeam.logo.includes('team-dummy')"
                                    :src="activeTeam.logo" @error="hideImg($event)"
                                    class="w-full h-full object-cover" />
                                <span v-else class="text-slate-500 font-bold text-sm">{{ abbr(activeTeam.name) }}</span>
                            </div>
                            <div>
                                <p class="font-bold text-slate-900 m-0">{{ activeTeam.name }}</p>
                                <p class="text-xs text-slate-400 m-0">{{ activeTeam.players?.length || 0 }} players</p>
                            </div>
                            <div v-if="activeTeam.coach_name" class="ml-auto text-right text-xs text-slate-400">
                                <p class="m-0">Coach: <span class="text-slate-600 font-medium">{{ activeTeam.coach_name }}</span></p>
                                <p v-if="activeTeam.manager_name" class="m-0">Manager: <span class="text-slate-600 font-medium">{{ activeTeam.manager_name }}</span></p>
                            </div>
                        </div>

                        <!-- Role sections -->
                        <div v-for="(group, label) in groupedPlayers" :key="label">
                            <div v-if="group.length" class="mb-5">
                                <div class="flex items-center gap-2 mb-3">
                                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider m-0">
                                        {{ label }} ({{ group.length }})
                                    </p>
                                    <div class="flex-1 h-px bg-slate-200"></div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                    <div v-for="player in group" :key="player.id || player.name"
                                        class="bg-white rounded-xl border border-slate-100 flex items-center gap-3 p-3 hover:shadow-sm transition">
                                        <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 flex-shrink-0">
                                            <img v-if="player.image" :src="player.image"
                                                @error="hideImg($event)" class="w-full h-full object-cover" />
                                            <span v-else class="text-slate-500 font-bold text-xs">{{ abbr(player.name) }}</span>
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-sm font-semibold text-slate-800 m-0 truncate">{{ player.name }}</p>
                                            <p class="text-xs text-slate-400 m-0 capitalize">{{ player.role }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Uncategorised -->
                        <div v-if="groupedPlayers['Others'].length" class="mb-5">
                            <div class="flex items-center gap-2 mb-3">
                                <p class="text-xs font-bold text-slate-500 uppercase tracking-wider m-0">
                                    Others ({{ groupedPlayers['Others'].length }})
                                </p>
                                <div class="flex-1 h-px bg-slate-200"></div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                <div v-for="player in groupedPlayers['Others']" :key="player.id || player.name"
                                    class="bg-white rounded-xl border border-slate-100 flex items-center gap-3 p-3">
                                    <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 flex-shrink-0">
                                        <img v-if="player.image" :src="player.image"
                                            @error="hideImg($event)" class="w-full h-full object-cover" />
                                        <span v-else class="text-slate-500 font-bold text-xs">{{ abbr(player.name) }}</span>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-sm font-semibold text-slate-800 m-0 truncate">{{ player.name }}</p>
                                        <p class="text-xs text-slate-400 m-0 capitalize">{{ player.role || 'Player' }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getTeamAbbreviation } from './../../../helpers/MatchHelper'

const props = defineProps({
    tournament: {
        type: Object,
        required: true
    }
})

const activeTeam = ref(null)

// Reactively derive squads from the tournament prop
const squads = computed(() => props.tournament?.teams || [])

// When squads load, auto-select the first team
watch(squads, (teams) => {
    if (teams.length && !activeTeam.value) {
        activeTeam.value = teams[0]
    }
}, { immediate: true })

const abbr = (name) => getTeamAbbreviation(name)
const hideImg = (e) => { e.target.style.display = 'none' }

const groupedPlayers = computed(() => {
    const result = { Batters: [], Bowlers: [], 'All-Rounders': [], 'WK-Batters': [], Others: [] }
    if (!activeTeam.value?.players) return result

    for (const player of activeTeam.value.players) {
        const role = (player.role || '').toLowerCase()
        if (role.includes('wk') || role.includes('wicket')) {
            result['WK-Batters'].push(player)
        } else if (role.includes('batter') || role.includes('batsman')) {
            result.Batters.push(player)
        } else if (role.includes('all') || role.includes('rounder')) {
            result['All-Rounders'].push(player)
        } else if (role.includes('bowler')) {
            result.Bowlers.push(player)
        } else {
            result.Others.push(player)
        }
    }
    return result
})
</script>
