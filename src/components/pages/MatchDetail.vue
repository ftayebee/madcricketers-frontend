<template>
    <!-- ─── Hero ─── -->
    <section class="relative overflow-hidden" style="background-color: #0f172a;">
        <div class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
            :style="{ backgroundImage: `url(${bgHome})` }"></div>

        <div class="relative z-10 pt-20">
            <div class="container mx-auto px-4 max-w-3xl">

                <!-- Loading skeleton -->
                <div v-if="!match?.id" class="animate-pulse py-8">
                    <div class="h-4 w-48 bg-white/10 rounded mb-5"></div>
                    <div class="h-16 bg-white/5 rounded-xl mb-2"></div>
                </div>

                <template v-else>
                    <!-- Breadcrumb: tournament · match title -->
                    <p class="text-slate-500 text-xs mb-4 truncate">
                        <span v-if="match.tournament?.name" class="text-slate-400">{{ match.tournament.name }}</span>
                        <span v-if="match.title" class="text-slate-600"> · {{ match.title }}</span>
                    </p>

                    <!-- ── LIVE / 1st innings: only batting team row ── -->
                    <template v-if="match.status === 'live' && currentInnings">
                        <div class="flex items-center gap-3 sm:gap-5 py-3 px-1">

                            <!-- Logo -->
                            <div class="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                                <img v-if="battingTeamObj?.logo && !battingTeamObj.logo.includes('team-dummy')"
                                    :src="battingTeamObj.logo" @error="imgErr" class="w-full h-full object-cover" />
                                <span v-else class="text-white font-bold text-sm">{{ getTeamAbbreviation(battingTeamObj?.name) }}</span>
                            </div>

                            <!-- Name + score + overs -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-baseline gap-2 flex-wrap">
                                    <span class="text-white text-sm sm:text-base font-semibold truncate">{{ battingTeamObj?.name }}</span>
                                    <!-- powerplay / death badge could go here -->
                                    <span class="text-slate-500 text-xs hidden sm:inline">Batting</span>
                                </div>
                                <div class="flex items-baseline gap-2 mt-0.5">
                                    <span class="text-white text-2xl sm:text-3xl font-extrabold leading-none tracking-tight">
                                        {{ currentInnings.runs ?? 0 }}-{{ currentInnings.wickets ?? 0 }}
                                    </span>
                                    <span class="text-slate-400 text-sm font-medium">{{ Number(currentInnings.overs ?? 0).toFixed(1) }} ov</span>
                                </div>
                                <!-- 1st innings: also show bowling team score if it exists -->
                                <p v-if="isSecondInningsLive && bowlingTeamFinished"
                                    class="text-slate-500 text-xs m-0 mt-0.5">
                                    {{ bowlingTeamObj?.name }}: {{ bowlingTeamFinished.score }} ({{ bowlingTeamFinished.overs }} ov)
                                </p>
                            </div>

                            <!-- Right stat block -->
                            <div class="text-right flex-shrink-0 space-y-0.5">
                                <!-- CRR -->
                                <div class="flex items-baseline justify-end gap-1.5">
                                    <span class="text-slate-500 text-xs">CRR</span>
                                    <span class="text-white text-sm font-bold">{{ crr ?? '—' }}</span>
                                </div>
                                <!-- RRR (only 2nd innings) -->
                                <div v-if="isSecondInningsLive" class="flex items-baseline justify-end gap-1.5">
                                    <span class="text-slate-500 text-xs">RRR</span>
                                    <span class="text-yellow-400 text-sm font-bold">{{ rrr }}</span>
                                </div>
                                <!-- Need X in Y balls -->
                                <p v-if="isSecondInningsLive && runsNeeded !== null"
                                    class="text-yellow-400 text-xs font-semibold m-0 whitespace-nowrap">
                                    Need {{ runsNeeded }} in {{ ballsRemaining }} balls
                                </p>
                                <!-- Projected (1st innings) -->
                                <p v-if="!isSecondInningsLive && projectedScore"
                                    class="text-slate-400 text-xs m-0">
                                    Proj: <span class="text-slate-300 font-semibold">{{ projectedScore.base }}</span>
                                </p>
                            </div>
                        </div>

                        <!-- Toss / target sub-line -->
                        <p v-if="tossInfo" class="text-slate-500 text-xs px-1 mb-1 mt-1 truncate">
                            {{ tossInfo }}
                        </p>
                    </template>

                    <!-- ── LIVE but no innings (toss pending / running) ── -->
                    <template v-else-if="match.status === 'live' && !currentInnings">
                        <div class="flex items-center gap-3 py-3 px-1">
                            <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span class="text-yellow-400 text-sm font-semibold">
                                {{ match.toss ? tossInfo : 'Toss Running…' }}
                            </span>
                        </div>
                        <!-- Both teams shown while waiting -->
                        <div class="flex gap-4 mt-1 px-1">
                            <div class="flex items-center gap-2">
                                <div class="w-7 h-7 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                                    <img v-if="match.team_a?.logo && !match.team_a.logo.includes('team-dummy')"
                                        :src="match.team_a.logo" @error="imgErr" class="w-full h-full object-cover" />
                                    <span v-else class="text-white text-[10px] font-bold">{{ getTeamAbbreviation(match.team_a?.name) }}</span>
                                </div>
                                <span class="text-white text-xs font-medium">{{ match.team_a?.name }}</span>
                            </div>
                            <span class="text-slate-600 text-xs self-center">vs</span>
                            <div class="flex items-center gap-2">
                                <div class="w-7 h-7 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                                    <img v-if="match.team_b?.logo && !match.team_b.logo.includes('team-dummy')"
                                        :src="match.team_b.logo" @error="imgErr" class="w-full h-full object-cover" />
                                    <span v-else class="text-white text-[10px] font-bold">{{ getTeamAbbreviation(match.team_b?.name) }}</span>
                                </div>
                                <span class="text-white text-xs font-medium">{{ match.team_b?.name }}</span>
                            </div>
                        </div>
                    </template>

                    <!-- ── COMPLETED: both teams ── -->
                    <template v-else-if="match.status === 'completed'">
                        <div class="space-y-0">
                            <!-- Team A -->
                            <div class="flex items-center gap-3 py-2.5 px-1 border-b border-white/5">
                                <div class="w-9 h-9 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                                    <img v-if="match.team_a?.logo && !match.team_a.logo.includes('team-dummy')"
                                        :src="match.team_a.logo" @error="imgErr" class="w-full h-full object-cover" />
                                    <span v-else class="text-white font-bold text-xs">{{ getTeamAbbreviation(match.team_a?.name) }}</span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-1.5">
                                        <p :class="['text-sm font-semibold m-0 truncate',
                                            match.winning_team === match.team_a?.name ? 'text-emerald-400' : 'text-white']">
                                            {{ match.team_a?.name }}
                                        </p>
                                        <span v-if="match.winning_team === match.team_a?.name"
                                            class="text-emerald-400 text-xs font-bold">✓ Won</span>
                                    </div>
                                </div>
                                <div class="text-right flex-shrink-0">
                                    <template v-if="teamScoreDisplay('team_a')">
                                        <p :class="['text-lg font-extrabold m-0 leading-none',
                                            match.winning_team === match.team_a?.name ? 'text-emerald-400' : 'text-white']">
                                            {{ teamScoreDisplay('team_a').score }}
                                        </p>
                                        <p class="text-slate-500 text-xs m-0">{{ teamScoreDisplay('team_a').overs }} ov</p>
                                    </template>
                                </div>
                            </div>
                            <!-- Team B -->
                            <div class="flex items-center gap-3 py-2.5 px-1">
                                <div class="w-9 h-9 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                                    <img v-if="match.team_b?.logo && !match.team_b.logo.includes('team-dummy')"
                                        :src="match.team_b.logo" @error="imgErr" class="w-full h-full object-cover" />
                                    <span v-else class="text-white font-bold text-xs">{{ getTeamAbbreviation(match.team_b?.name) }}</span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-1.5">
                                        <p :class="['text-sm font-semibold m-0 truncate',
                                            match.winning_team === match.team_b?.name ? 'text-emerald-400' : 'text-white']">
                                            {{ match.team_b?.name }}
                                        </p>
                                        <span v-if="match.winning_team === match.team_b?.name"
                                            class="text-emerald-400 text-xs font-bold">✓ Won</span>
                                    </div>
                                </div>
                                <div class="text-right flex-shrink-0">
                                    <template v-if="teamScoreDisplay('team_b')">
                                        <p :class="['text-lg font-extrabold m-0 leading-none',
                                            match.winning_team === match.team_b?.name ? 'text-emerald-400' : 'text-white']">
                                            {{ teamScoreDisplay('team_b').score }}
                                        </p>
                                        <p class="text-slate-500 text-xs m-0">{{ teamScoreDisplay('team_b').overs }} ov</p>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <!-- Result strip -->
                        <div v-if="match.result_summary"
                            class="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                            <p class="text-emerald-400 text-xs font-semibold m-0 text-center">{{ match.result_summary }}</p>
                        </div>
                    </template>

                    <!-- ── UPCOMING ── -->
                    <template v-else-if="match.status === 'upcoming'">
                        <div class="flex items-center justify-between py-3 px-1">
                            <div class="flex items-center gap-2">
                                <div class="w-9 h-9 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                                    <img v-if="match.team_a?.logo && !match.team_a.logo.includes('team-dummy')"
                                        :src="match.team_a.logo" @error="imgErr" class="w-full h-full object-cover" />
                                    <span v-else class="text-white text-xs font-bold">{{ getTeamAbbreviation(match.team_a?.name) }}</span>
                                </div>
                                <span class="text-white text-sm font-semibold">{{ match.team_a?.name }}</span>
                            </div>
                            <div class="text-center px-3">
                                <p class="text-slate-400 text-xs m-0">{{ match.match_date }}</p>
                                <p class="text-white text-sm font-bold m-0">{{ match.match_time || 'TBD' }}</p>
                                <p class="text-slate-600 text-xs m-0">{{ match.venue }}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-white text-sm font-semibold">{{ match.team_b?.name }}</span>
                                <div class="w-9 h-9 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                                    <img v-if="match.team_b?.logo && !match.team_b.logo.includes('team-dummy')"
                                        :src="match.team_b.logo" @error="imgErr" class="w-full h-full object-cover" />
                                    <span v-else class="text-white text-xs font-bold">{{ getTeamAbbreviation(match.team_b?.name) }}</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Status badge row -->
                    <div class="flex items-center gap-2 mt-2 px-1 pb-3">
                        <span :class="['inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide',
                            match.status === 'live'      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            match.status === 'completed' ? 'bg-slate-500/20   text-slate-400   border-slate-500/30'  :
                                                           'bg-blue-500/20    text-blue-400    border-blue-500/30']">
                            <span v-if="match.status === 'live'" class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            {{ match.status || 'Upcoming' }}
                        </span>
                        <span v-if="match.format" class="text-slate-600 text-[11px] uppercase tracking-wide">{{ match.format }}</span>
                        <span v-if="match.venue && match.status !== 'upcoming'" class="text-slate-600 text-[11px] hidden sm:inline truncate">· {{ match.venue }}</span>
                    </div>

                </template>
            </div>

            <!-- Tab bar: 3 equal cols, no scroll ever -->
            <div class="border-t border-white/10">
                <div class="container mx-auto px-0 max-w-3xl">
                    <div :class="tabs.length === 3 ? 'grid grid-cols-3' : 'grid grid-cols-2'">
                        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
                            :class="['py-3 text-xs sm:text-sm font-semibold text-center transition border-b-2 flex items-center justify-center gap-1.5',
                                activeTab === tab
                                    ? 'border-red-500 text-white bg-white/5'
                                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5']">
                            {{ tab }}
                            <span v-if="tab === 'Live' && match?.status === 'live'"
                                class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Tab content -->
    <div class="min-h-screen">
        <div v-if="match?.id">
            <MatchInfo  v-if="activeTab === 'Match Info'" :tournament="match?.tournament ?? null" :match="match" />
            <LiveScore  v-if="activeTab === 'Live'"
                :match="match"
                :striker="striker"
                :nonStriker="nonStriker"
                :bowler="bowler"
                :currentOver="currentOver"
                :scoreboard="scoreboard"
                :probability="probability"
                :crr="crr"
                :rrr="rrr"
                :target="target"
                :runsNeeded="runsNeeded"
                :ballsRemaining="ballsRemaining"
                :projectedScore="projectedScore"
                :winProb="winProb"
                :totalOvers="totalOvers"
                :isSecondInningsLive="isSecondInningsLive"
                :currentInnings="currentInnings" />
            <ScoreCard  v-if="activeTab === 'Scorecard'"  :match="match" :yetToBatList="yetToBatList" :scoreboard="match?.scoreboard" />
        </div>
    </div>
</template>

<script setup>
import bgHome from './../../assets/bg/bg-home.png'
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMatchBySlug, fetchCricketMatchData, fetchYetToBat } from './../api/matches'
import MatchInfo  from '../includes/tabs/MatchInfo.vue'
import LiveScore  from '../includes/tabs/LiveScore.vue'
import ScoreCard  from '../includes/tabs/ScoreCard.vue'
import { getTeamAbbreviation } from './../../helpers/MatchHelper'
import { useToast } from "vue-toastification"

const toast        = useToast()
const route        = useRoute()
const match        = ref({})
const battingTeam  = ref({})
const bowlingTeam  = ref({})
const scoreboard   = ref({})
const striker      = ref({})
const nonStriker   = ref({})
const bowler       = ref({})
const currentOver  = ref({})
const probability  = ref({})
const yetToBatList = ref({})
// Live tab is only shown when match is live
const tabs = computed(() => {
    const base = ['Match Info', 'Scorecard']
    if (match.value?.status === 'live') return ['Match Info', 'Live', 'Scorecard']
    return base
})
const activeTab    = ref('Match Info')
const channel      = ref(null)
const match_id     = route.params.id
const tossNotified = ref(false)
const loadingLiveData = ref(false)

// ── Total overs for the match format ──────────────────────────────
// max_overs is the actual CricketMatch model field (default 20 in DB)
const totalOvers = computed(() => Number(
    match.value?.max_overs ||
    match.value?.total_overs ||
    match.value?.overs ||
    20
))

// ── Current running innings ───────────────────────────────────────
const currentInnings = computed(() => {
    const sb = match.value?.scoreboard
    if (!Array.isArray(sb)) return null
    return sb.find(i => ['running', 'in_progress'].includes(i.status)) ?? null
})

const isInningsStarted = computed(() => (currentInnings.value?.overs ?? 0) > 0)

const isSecondInningsLive = computed(() =>
    match.value?.status === 'live' &&
    Array.isArray(match.value?.scoreboard) &&
    match.value.scoreboard.length >= 2 &&
    !!currentInnings.value
)

// ── Which team is currently batting ──────────────────────────────
const battingTeamObj = computed(() => {
    if (!currentInnings.value) return null
    const id = currentInnings.value.batting_team_id
    if (match.value?.team_a?.id === id) return match.value.team_a
    if (match.value?.team_b?.id === id) return match.value.team_b
    return null
})

const bowlingTeamObj = computed(() => {
    if (!battingTeamObj.value) return null
    return battingTeamObj.value === match.value?.team_a ? match.value?.team_b : match.value?.team_a
})

// ── Finished innings of the team that bowled 1st (for 2nd innings display) ──
const bowlingTeamFinished = computed(() => {
    if (!isSecondInningsLive.value || !bowlingTeamObj.value) return null
    const sb = match.value?.scoreboard
    const teamId = bowlingTeamObj.value.id
    const innings = sb.filter(i => i.batting_team_id === teamId && !['running', 'in_progress'].includes(i.status))
    if (!innings.length) return null
    const last = innings[innings.length - 1]
    return { score: `${last.runs ?? 0}/${last.wickets ?? 0}`, overs: Number(last.overs ?? 0).toFixed(1) }
})

// ── Unified score display (for completed match) ───────────────────
const teamScoreDisplay = (teamType) => {
    if (!match.value) return null
    const teamId = teamType === 'team_a' ? match.value.team_a?.id : match.value.team_b?.id
    const sb = match.value?.scoreboard
    if (!teamId || !Array.isArray(sb)) return null
    if (currentInnings.value?.batting_team_id === teamId) {
        return {
            score: `${currentInnings.value.runs ?? 0}/${currentInnings.value.wickets ?? 0}`,
            overs: Number(currentInnings.value.overs ?? 0).toFixed(1),
        }
    }
    const teamInnings = sb.filter(i => i.batting_team_id === teamId)
    if (!teamInnings.length) return null
    const last = teamInnings[teamInnings.length - 1]
    return { score: `${last.runs ?? 0}/${last.wickets ?? 0}`, overs: Number(last.overs ?? 0).toFixed(1) }
}

// ── Live rate stats ───────────────────────────────────────────────
const crr = computed(() => {
    const inn = currentInnings.value
    if (!inn || !inn.overs || inn.overs <= 0) return null
    return (inn.runs / inn.overs).toFixed(2)
})

const target = computed(() => {
    const sb = match.value?.scoreboard
    if (!Array.isArray(sb) || sb.length < 2) return null
    const first = sb.find(i => !['running', 'in_progress'].includes(i.status)) ?? sb[0]
    return (first?.runs ?? 0) + 1
})

const runsNeeded = computed(() => {
    if (!target.value || !currentInnings.value) return null
    return Math.max(0, target.value - (currentInnings.value.runs ?? 0))
})

const ballsRemaining = computed(() => {
    const inn = currentInnings.value
    if (!inn) return null
    const completedOvers = Math.floor(inn.overs ?? 0)
    const ballsInOver    = Math.round(((inn.overs ?? 0) % 1) * 10)
    return Math.max(0, totalOvers.value * 6 - (completedOvers * 6 + ballsInOver))
})

const rrr = computed(() => {
    if (!runsNeeded.value || !ballsRemaining.value || ballsRemaining.value <= 0) return '—'
    return ((runsNeeded.value / ballsRemaining.value) * 6).toFixed(2)
})

// ── Toss info ─────────────────────────────────────────────────────
const tossInfo = computed(() => {
    const t = match.value?.toss
    if (!t || !match.value?.team_a || !match.value?.team_b) return null
    const winner   = match.value.team_a.id === t.toss_winner_team_id ? match.value.team_a.name : match.value.team_b.name
    const decision = (t.decision || t.toss_decision) === 'bat' ? 'batting' : 'bowling'
    return `${winner} won the toss & elected to bat ${decision} first`
})

// ── Projected Score (1st innings) ─────────────────────────────────
// CRR × totalOvers, powerplay-adjusted, ±8% range
const projectedScore = computed(() => {
    const inn = currentInnings.value
    if (!inn || !isInningsStarted.value || isSecondInningsLive.value) return null
    const overs = inn.overs ?? 0
    const runs  = inn.runs  ?? 0
    if (overs < 1) return null
    const crrVal = runs / overs
    const corrected = overs <= 6 ? crrVal * 0.95 : crrVal
    const base = Math.round(corrected * totalOvers.value)
    return { base, low: Math.round(base * 0.92), high: Math.round(base * 1.08) }
})

// ── Win Probability ───────────────────────────────────────────────
const winProb = computed(() => {
    const inn = currentInnings.value
    if (!inn || !isInningsStarted.value) return null
    const overs   = inn.overs   ?? 0
    const runs    = inn.runs    ?? 0
    const wickets = inn.wickets ?? 0
    if (overs <= 0) return null

    let teamA_pct
    if (!isSecondInningsLive.value) {
        const par = totalOvers.value === 50 ? 280 : totalOvers.value === 40 ? 230 : 160
        const proj = (runs / overs) * totalOvers.value
        const delta = ((proj - par) / par) * 50
        const pct = Math.min(90, Math.max(10, 50 + delta))
        const battingIsA = inn.batting_team_id === match.value?.team_a?.id
        teamA_pct = battingIsA ? pct : 100 - pct
    } else {
        const totalBalls  = totalOvers.value * 6
        const balls       = ballsRemaining.value ?? 0
        const wicketsLeft = 10 - wickets
        const resourcePct = ((balls / totalBalls) * 0.6 + (wicketsLeft / 10) * 0.4) * 100
        const tgt         = target.value ?? 1
        const needed      = runsNeeded.value ?? tgt
        const ratio       = resourcePct / Math.max((needed / tgt) * 100, 1)
        const chasingPct  = Math.min(92, Math.max(8, ratio * 50))
        const chasingIsA  = inn.batting_team_id === match.value?.team_a?.id
        teamA_pct = chasingIsA ? chasingPct : 100 - chasingPct
    }

    const a = Math.round(teamA_pct)
    return { teamA: a, teamB: 100 - a }
})

// ── Helpers ───────────────────────────────────────────────────────
const imgErr = (e) => { e.target.style.display = 'none' }

// ── Live data fetch ───────────────────────────────────────────────
const updateMatchData = async (tossData = null) => {
    if (!match.value?.id) return
    let battingTeamId = null, bowlingTeamId = null

    if (tossData) {
        battingTeamId = tossData.batting_first_team_id
        bowlingTeamId = tossData.bowling_first_team_id
    } else if (match.value.toss) {
        const wId = match.value.toss.toss_winner_team_id
        const dec = match.value.toss.decision || match.value.toss.toss_decision
        battingTeamId = dec === 'bat'
            ? (wId === match.value.team_a_id ? match.value.team_a_id : match.value.team_b_id)
            : (wId === match.value.team_a_id ? match.value.team_b_id : match.value.team_a_id)
        bowlingTeamId = battingTeamId === match.value.team_a_id ? match.value.team_b_id : match.value.team_a_id
    } else if (currentInnings.value) {
        battingTeamId = currentInnings.value.batting_team_id
        bowlingTeamId = battingTeamId === match.value.team_a_id ? match.value.team_b_id : match.value.team_a_id
    }

    if (!battingTeamId || !bowlingTeamId) return
    loadingLiveData.value = true
    try {
        const res = await fetchCricketMatchData({ match_id: match.value.id, batting_team: battingTeamId, bowling_team: bowlingTeamId })
        if (res?.success) {
            battingTeam.value  = res.matchData.battingTeam
            bowlingTeam.value  = res.matchData.bowlingTeam
            scoreboard.value   = res.matchData.scoreboard
            striker.value      = res.matchData.striker
            nonStriker.value   = res.matchData.nonStriker
            bowler.value       = res.matchData.bowler
            currentOver.value  = res.matchData.currentOver
            probability.value  = res.matchData.probability
            yetToBatList.value = res.matchData.yetToBatList
        }
    } catch (err) {
        console.error('Error updating live match data:', err)
    } finally {
        loadingLiveData.value = false
    }
}

// ── Pusher ────────────────────────────────────────────────────────
const setupRealTimeListeners = () => {
    if (!window.Echo || !match.value?.id) return
    const ch = `cricket-match.${match.value.id}`
    if (channel.value) { window.Echo.leave(ch); channel.value = null }
    channel.value = window.Echo.channel(ch)
        .listen('.toss-updated',  d => { handleTossEvent(d); showTossNotification(d) })
        .listen('.match-updated', d => { handleMatchUpdate(d) })
}

const handleMatchUpdate = (data) => {
    if (!data) return
    if (data.match) match.value.status = data.match.status || match.value.status
    if (data.scoreboard) {
        scoreboard.value = { ...scoreboard.value, ...data.scoreboard }
        if (Array.isArray(match.value?.scoreboard)) {
            const idx = match.value.scoreboard.findIndex(i => i.id === data.scoreboard.id || i.innings === data.scoreboard.innings)
            if (idx !== -1) match.value.scoreboard[idx] = { ...match.value.scoreboard[idx], ...data.scoreboard }
            else            match.value.scoreboard.push(data.scoreboard)
        } else { match.value.scoreboard = [data.scoreboard] }
    }
    if (data.striker)       striker.value      = data.striker
    if (data.nonStriker)    nonStriker.value   = data.nonStriker
    if (data.currentBowler) bowler.value       = data.currentBowler
    if (data.currentOver)   currentOver.value  = data.currentOver
    if (data.yetToBatList)  yetToBatList.value = data.yetToBatList
}

const handleTossEvent = (data) => {
    if (data.match) {
        match.value.status = data.match.status || match.value.status
        match.value.toss   = data.match.toss || data
    }
    match.value.toss_winner_team_id   = data.toss_winner_team_id
    match.value.toss_decision         = data.toss_decision
    match.value.batting_first_team_id = data.batting_first_team_id
    match.value.bowling_first_team_id = data.bowling_first_team_id
}

const showTossNotification = (tossData) => {
    if (tossNotified.value) return
    tossNotified.value = true
    updateMatchData(tossData)
    const w = tossData.toss_winner_team_id === match.value.team_a?.id ? match.value.team_a?.name : match.value.team_b?.name
    const d = tossData.toss_decision === 'bat' ? 'batting' : 'bowling'
    toast.success(`${w} won the toss and elected to bat ${d} first!`, { position: 'top-right', timeout: 5000 })
}

const cleanupRealTimeListeners = () => {
    if (channel.value) { channel.value.unsubscribe(); channel.value = null }
}

// ── Lifecycle ─────────────────────────────────────────────────────
onMounted(async () => {
    if (!match_id) return
    try {
        match.value = await fetchMatchBySlug(match_id)
        if (!match.value) return
        if (match.value.status === 'live') {
            activeTab.value = 'Live'
            updateMatchData()
        } else {
            const res = await fetchYetToBat(match.value.id)
            if (res?.success) yetToBatList.value = res.players
        }
        setupRealTimeListeners()
    } catch (err) { console.error('Error fetching match:', err) }
})

watch(() => match.value?.id,     (id) => { if (id) setupRealTimeListeners() })
watch(() => match.value?.status, (s)  => {
    if (s === 'live') activeTab.value = 'Live'
    // If status changes away from live and current tab is Live, fall back gracefully
    else if (activeTab.value === 'Live') activeTab.value = 'Scorecard'
})
// Guard: if someone deep-links to Live tab for a non-live match, redirect to Scorecard
watch(tabs, (newTabs) => {
    if (!newTabs.includes(activeTab.value)) activeTab.value = newTabs[0]
})
onUnmounted(cleanupRealTimeListeners)
</script>

<style scoped>
/* no styles needed — all Tailwind */
</style>
