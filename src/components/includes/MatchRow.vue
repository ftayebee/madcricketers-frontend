<template>
    <router-link :to="`/match/detail/${match.id}`" class="no-underline group block">
        <div class="match-row bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer">

            <!-- Status strip (1px colored top border) -->
            <div class="h-0.5 w-full" :class="stripColor"></div>

            <!-- Main content -->
            <div class="flex items-center px-4 py-3 gap-3">

                <!-- Team A -->
                <div class="flex items-center gap-2 flex-1 min-w-0">
                    <!-- Logo -->
                    <div class="w-9 h-9 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200">
                        <img v-if="hasLogo(match.team_a?.logo)" :src="match.team_a.logo"
                            @error="hideImg($event)" class="w-full h-full object-cover" alt="" />
                        <span v-else class="text-slate-600 font-bold text-xs">
                            {{ abbr(match.team_a?.name) }}
                        </span>
                    </div>
                    <!-- Name + Score -->
                    <div class="min-w-0">
                        <p :class="['text-sm font-semibold m-0 truncate leading-tight',
                            isWinner(match.team_a) ? 'text-slate-900' : 'text-slate-500']">
                            {{ match.team_a?.name }}
                        </p>
                        <p v-if="match.team_a?.score"
                            :class="['text-sm font-bold m-0 leading-tight mt-0.5',
                                isWinner(match.team_a) ? 'text-slate-900' : 'text-slate-400']">
                            {{ match.team_a.score }}
                            <span v-if="match.team_a.overs"
                                class="text-xs font-normal text-slate-400 ml-1">
                                ({{ match.team_a.overs }})
                            </span>
                        </p>
                    </div>
                </div>

                <!-- Center: Status / Result -->
                <div class="flex-shrink-0 text-center px-2" style="min-width: 110px; max-width: 160px;">
                    <!-- LIVE -->
                    <template v-if="match.status === 'live'">
                        <span
                            class="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            LIVE
                        </span>
                    </template>

                    <!-- Completed result -->
                    <template v-else-if="match.status === 'completed'">
                        <p v-if="match.result_summary"
                            class="text-xs text-emerald-700 font-semibold m-0 leading-tight text-center line-clamp-2">
                            {{ match.result_summary }}
                        </p>
                        <p v-else class="text-xs text-slate-400 m-0">Match ended</p>
                    </template>

                    <!-- Upcoming -->
                    <template v-else>
                        <p class="text-xs text-slate-400 font-medium m-0 leading-tight">Starts at</p>
                        <p class="text-sm text-orange-500 font-bold m-0">{{ match.match_time }}</p>
                    </template>
                </div>

                <!-- Team B -->
                <div class="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <!-- Name + Score (right aligned) -->
                    <div class="min-w-0 text-right">
                        <p :class="['text-sm font-semibold m-0 truncate leading-tight',
                            isWinner(match.team_b) ? 'text-slate-900' : 'text-slate-500']">
                            {{ match.team_b?.name }}
                        </p>
                        <p v-if="match.team_b?.score"
                            :class="['text-sm font-bold m-0 leading-tight mt-0.5',
                                isWinner(match.team_b) ? 'text-slate-900' : 'text-slate-400']">
                            {{ match.team_b.score }}
                            <span v-if="match.team_b.overs"
                                class="text-xs font-normal text-slate-400 ml-1">
                                ({{ match.team_b.overs }})
                            </span>
                        </p>
                    </div>
                    <!-- Logo -->
                    <div class="w-9 h-9 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200">
                        <img v-if="hasLogo(match.team_b?.logo)" :src="match.team_b.logo"
                            @error="hideImg($event)" class="w-full h-full object-cover" alt="" />
                        <span v-else class="text-slate-600 font-bold text-xs">
                            {{ abbr(match.team_b?.name) }}
                        </span>
                    </div>
                </div>

            </div>

            <!-- Footer: Venue + Date + Tournament -->
            <div class="px-4 pb-2.5 flex items-center justify-between flex-wrap gap-1">
                <div class="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span v-if="match.venue" class="flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {{ match.venue }}
                    </span>
                    <span v-if="match.stage" class="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs">
                        {{ match.stage }}
                    </span>
                </div>
                <span class="text-xs text-slate-400">{{ match.match_date }}</span>
            </div>

        </div>
    </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { getTeamAbbreviation } from './../../helpers/MatchHelper'

const props = defineProps({
    match: {
        type: Object,
        required: true,
    }
})

const abbr = (name) => getTeamAbbreviation(name)

const hasLogo = (logo) => logo && !logo.includes('team-dummy')

const hideImg = (e) => { e.target.style.display = 'none' }

// Highlight winning team name/score
const isWinner = (team) => {
    if (!team || !props.match.winning_team) return false
    return props.match.winning_team === team.name
}

// Colored top strip based on status
const stripColor = computed(() => {
    switch (props.match.status) {
        case 'live': return 'bg-red-500'
        case 'completed': return 'bg-emerald-500'
        default: return 'bg-blue-400'
    }
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
