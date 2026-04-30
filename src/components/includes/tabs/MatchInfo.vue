<template>
    <div class="bg-slate-50 min-h-screen py-6">
        <div class="container mx-auto px-4 max-w-3xl space-y-4">

            <!-- ── Match Overview Card ── -->
            <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div class="px-4 py-2.5 bg-slate-800 flex items-center gap-2">
                    <span class="text-xs font-bold text-white uppercase tracking-wide">Match Details</span>
                </div>
                <div class="p-4 space-y-3">

                    <!-- Tournament -->
                    <div v-if="tournament?.name" class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <img v-if="tournament.logo" :src="tournament.logo" @error="imgErr" class="w-full h-full object-cover" />
                            <svg v-else class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="text-[11px] text-slate-400 uppercase tracking-wide font-medium m-0">Tournament</p>
                            <p class="text-sm font-semibold text-slate-800 m-0 truncate">{{ tournament.name }}</p>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-slate-50"></div>

                    <!-- Info rows -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <div v-if="match.venue" class="flex items-start gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[11px] text-slate-400 uppercase tracking-wide font-medium m-0">Venue</p>
                                <p class="text-sm text-slate-700 font-medium m-0">{{ match.venue }}</p>
                            </div>
                        </div>

                        <div v-if="formattedDate" class="flex items-start gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[11px] text-slate-400 uppercase tracking-wide font-medium m-0">Date & Time</p>
                                <p class="text-sm text-slate-700 font-medium m-0">{{ formattedDate }}</p>
                            </div>
                        </div>

                        <div v-if="match.max_overs" class="flex items-start gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg class="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[11px] text-slate-400 uppercase tracking-wide font-medium m-0">Format</p>
                                <p class="text-sm text-slate-700 font-medium m-0">{{ match.max_overs }}-Over Match</p>
                            </div>
                        </div>

                        <div v-if="match.stage" class="flex items-start gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[11px] text-slate-400 uppercase tracking-wide font-medium m-0">Stage</p>
                                <p class="text-sm text-slate-700 font-medium m-0">{{ match.stage }}</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[11px] text-slate-400 uppercase tracking-wide font-medium m-0">Status</p>
                                <span :class="['inline-block text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide',
                                    match.status === 'live'      ? 'bg-emerald-100 text-emerald-700' :
                                    match.status === 'completed' ? 'bg-slate-100 text-slate-500' :
                                                                   'bg-blue-100 text-blue-600']">
                                    {{ match.status || 'Upcoming' }}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- ── Toss Card ── -->
            <div v-if="tossInfo" class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div class="px-4 py-2.5 bg-slate-800 flex items-center gap-2">
                    <span class="text-xs font-bold text-white uppercase tracking-wide">Toss</span>
                </div>
                <div class="p-4 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                        </svg>
                    </div>
                    <p class="text-sm text-slate-700 m-0">{{ tossInfo }}</p>
                </div>
            </div>

            <!-- ── Result Card ── -->
            <div v-if="match.status === 'completed' && match.result_summary"
                class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <p class="text-[11px] text-emerald-600 uppercase tracking-wide font-semibold m-0">Result</p>
                    <p class="text-sm font-bold text-emerald-800 m-0">{{ match.result_summary }}</p>
                </div>
            </div>

            <!-- ── Teams Card ── -->
            <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div class="px-4 py-2.5 bg-slate-800 flex items-center gap-2">
                    <span class="text-xs font-bold text-white uppercase tracking-wide">Teams</span>
                </div>
                <div class="divide-y divide-slate-50">
                    <div v-for="team in [match.team_a, match.team_b]" :key="team?.id"
                        class="flex items-center gap-3 px-4 py-3">
                        <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <img v-if="team?.logo && !team.logo.includes('team-dummy')"
                                :src="team.logo" @error="imgErr" class="w-full h-full object-cover" />
                            <span v-else class="text-slate-600 font-bold text-xs">{{ abbr(team?.name) }}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-slate-800 m-0 truncate">{{ team?.name }}</p>
                        </div>
                        <span v-if="match.winning_team === team?.name"
                            class="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            ✓ Won
                        </span>
                    </div>
                </div>
            </div>

            <!-- ── Head-to-Head Card ── -->
            <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div class="px-4 py-2.5 bg-slate-800 flex items-center gap-2">
                    <span class="text-xs font-bold text-white uppercase tracking-wide">Head to Head</span>
                </div>

                <!-- Loading -->
                <div v-if="h2hLoading" class="p-4 flex items-center justify-center">
                    <div class="w-6 h-6 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
                </div>

                <!-- No previous meetings -->
                <div v-else-if="!h2h || h2h.total_meetings === 0" class="p-4 text-center">
                    <p class="text-sm text-slate-400 m-0">No previous meetings between these teams.</p>
                </div>

                <template v-else>
                    <!-- Summary bar -->
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-xs font-semibold text-slate-700 m-0 truncate flex-1">{{ h2h.team_a_name }}</p>
                            <p class="text-[11px] text-slate-400 m-0 px-2 flex-shrink-0">{{ h2h.total_meetings }} played</p>
                            <p class="text-xs font-semibold text-slate-700 m-0 truncate flex-1 text-right">{{ h2h.team_b_name }}</p>
                        </div>
                        <!-- Two-color win bar -->
                        <div class="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
                            <div class="h-full bg-blue-500 transition-all"
                                :style="{ width: h2hWinPct(h2h.team_a_wins, h2h.total_meetings) + '%' }"></div>
                            <div v-if="h2h.no_result > 0" class="h-full bg-slate-300 transition-all"
                                :style="{ width: h2hWinPct(h2h.no_result, h2h.total_meetings) + '%' }"></div>
                            <div class="h-full bg-red-400 transition-all flex-1"></div>
                        </div>
                        <div class="flex justify-between mt-1.5">
                            <span class="text-sm font-extrabold text-blue-500">{{ h2h.team_a_wins }}</span>
                            <span v-if="h2h.no_result > 0" class="text-xs text-slate-400">{{ h2h.no_result }} NR</span>
                            <span class="text-sm font-extrabold text-red-400">{{ h2h.team_b_wins }}</span>
                        </div>
                    </div>

                    <!-- Last 5 meetings -->
                    <div v-if="h2h.last_5_meetings?.length" class="border-t border-slate-50">
                        <p class="text-[11px] text-slate-400 uppercase tracking-wide font-semibold px-4 pt-3 pb-1 m-0">Last {{ h2h.last_5_meetings.length }} Meetings</p>
                        <div class="divide-y divide-slate-50">
                            <div v-for="(m, i) in h2h.last_5_meetings" :key="i"
                                class="px-4 py-2.5 flex items-center gap-3">
                                <span :class="['w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                                    m.winner_is_a ? 'bg-blue-500 text-white' : m.winner ? 'bg-red-400 text-white' : 'bg-slate-200 text-slate-500']">
                                    {{ m.winner_is_a ? 'A' : m.winner ? 'B' : '—' }}
                                </span>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs font-semibold text-slate-700 m-0 truncate">
                                        {{ m.winner ? m.winner + ' won' : 'No Result' }}
                                    </p>
                                    <p class="text-[11px] text-slate-400 m-0 truncate">
                                        {{ m.result_summary || m.tournament }}
                                    </p>
                                </div>
                                <span class="text-[10px] text-slate-400 flex-shrink-0">{{ m.match_date }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- ── Recent Form Card ── -->
            <div v-if="teamInfo.length" class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div class="px-4 py-2.5 bg-slate-800 flex items-center gap-2">
                    <span class="text-xs font-bold text-white uppercase tracking-wide">Recent Form</span>
                    <span class="text-[11px] text-slate-400 font-normal normal-case">last 5 matches</span>
                </div>
                <div class="p-4 space-y-4">
                    <div v-for="team in teamInfo" :key="team.id" class="flex items-center gap-3">
                        <div class="w-7 h-7 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <img v-if="team.team_logo" :src="team.team_logo" @error="imgErr" class="w-full h-full object-cover" />
                            <span v-else class="text-slate-600 font-bold text-[10px]">{{ abbr(team.team_name) }}</span>
                        </div>
                        <p class="text-xs font-semibold text-slate-700 m-0 w-28 truncate flex-shrink-0">{{ team.team_name }}</p>
                        <div class="flex gap-1 flex-1 justify-end">
                            <span v-for="(result, i) in team.form" :key="i"
                                :class="['w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                                    result === 'W' ? 'bg-emerald-500 text-white' :
                                    result === 'L' ? 'bg-red-400 text-white' :
                                                     'bg-slate-200 text-slate-500']">
                                {{ result === '-' ? '·' : result }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── Squad Tabs ── -->
            <div v-if="teamInfo.length" class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div class="px-4 py-2.5 bg-slate-800 flex items-center gap-2">
                    <span class="text-xs font-bold text-white uppercase tracking-wide">Squad</span>
                </div>
                <!-- Team switcher -->
                <div class="flex border-b border-slate-100">
                    <button v-for="(team, idx) in teamInfo" :key="idx"
                        @click="activeTeamTab = idx"
                        :class="['flex-1 py-2.5 text-xs font-semibold transition-colors',
                            activeTeamTab === idx
                                ? 'border-b-2 border-red-500 text-red-600 bg-red-50/50'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50']">
                        {{ team.team_name }}
                    </button>
                </div>
                <div v-if="teamInfo[activeTeamTab]" class="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div v-for="(player, idx) in teamInfo[activeTeamTab].players" :key="idx"
                        class="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <img :src="player.image || placeholder" @error="imgErr"
                            class="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-slate-200" />
                        <div class="min-w-0">
                            <p class="text-sm font-semibold text-slate-800 m-0 truncate">{{ player.name }}</p>
                            <p class="text-[11px] text-slate-400 m-0">{{ formatRole(player.role) }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchTeamInfo, fetchHeadToHead } from './../../api/matches'
import { getTeamAbbreviation } from './../../../helpers/MatchHelper'
import placeholderImg from './../../../assets/images/logo-placeholder.jpg'

const props = defineProps({
    tournament: { type: Object, default: null },
    match:      { type: Object, required: true }
})

const teamInfo      = ref([])
const activeTeamTab = ref(0)
const h2h           = ref(null)
const h2hLoading    = ref(false)
const route         = useRoute()
const placeholder   = placeholderImg

const abbr   = (name) => getTeamAbbreviation(name)
const imgErr = (e)    => { e.target.style.display = 'none' }

const formatRole = (role) => {
    if (!role) return ''
    return role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const formattedDate = computed(() => {
    if (!props.match?.match_date) return null
    try {
        const d = new Date(props.match.match_date)
        return d.toLocaleString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        })
    } catch { return props.match.match_date }
})

const tossInfo = computed(() => {
    const t = props.match?.toss
    if (!t || !props.match?.team_a || !props.match?.team_b) return null
    const winner   = props.match.team_a.id === t.toss_winner_team_id ? props.match.team_a.name : props.match.team_b.name
    const decision = (t.decision || t.toss_decision) === 'bat' ? 'batting' : 'bowling'
    return `${winner} won the toss & elected to bat ${decision} first`
})

const h2hWinPct = (wins, total) => {
    if (!total || total <= 0) return 0
    return Math.round((wins / total) * 100)
}

onMounted(async () => {
    const id = route.params.id
    if (!id) return

    // Team form
    try {
        const data = await fetchTeamInfo(id)
        if (Array.isArray(data)) teamInfo.value = data
    } catch (e) {
        console.error('Error fetching team form:', e)
    }

    // Head-to-head
    h2hLoading.value = true
    try {
        h2h.value = await fetchHeadToHead(id)
    } catch (e) {
        console.error('Error fetching H2H:', e)
    } finally {
        h2hLoading.value = false
    }
})
</script>
