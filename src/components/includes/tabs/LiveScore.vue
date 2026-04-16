<template>
    <div class="bg-slate-50 min-h-screen py-5">
        <div class="container mx-auto px-4 max-w-3xl">

            <!-- Not started -->
            <div v-if="isMatchNotStarted"
                class="bg-white rounded-xl border border-slate-100 p-10 text-center mt-2">
                <div class="w-12 h-12 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p class="text-slate-700 font-semibold m-0">Match will start soon</p>
                <p class="text-slate-400 text-sm mt-1 m-0">Stay tuned for live updates</p>
            </div>

            <div v-else class="space-y-4">

                <!-- ── Batters ── -->
                <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div class="px-4 py-2 bg-slate-800 flex items-center justify-between">
                        <span class="text-xs font-bold text-white uppercase tracking-wide">Batting</span>
                        <span class="text-[11px] text-slate-400">R (B) · 4s · 6s · SR</span>
                    </div>
                    <div class="divide-y divide-slate-50">
                        <div v-for="(bat, idx) in [striker, nonStriker]" :key="idx"
                            :class="['flex items-center gap-3 px-4 py-3', idx === 1 ? 'bg-slate-50/40' : '']">
                            <img :src="bat?.image || placeholder" @error="imgErr"
                                class="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-slate-100" />
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1.5">
                                    <p class="text-sm font-semibold text-slate-900 m-0 truncate">{{ bat?.name || '—' }}</p>
                                    <span v-if="bat?.status === 'on-strike'"
                                        class="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" title="On Strike"></span>
                                </div>
                                <p class="text-[11px] text-slate-400 m-0">{{ idx === 0 ? 'Striker' : 'Non-Striker' }}</p>
                            </div>
                            <div class="text-right flex-shrink-0">
                                <p class="text-sm font-bold text-slate-900 m-0">
                                    {{ bat?.runs ?? '—' }}
                                    <span v-if="bat?.balls" class="text-slate-400 font-normal text-xs">({{ bat.balls }})</span>
                                </p>
                                <p class="text-[11px] text-slate-500 m-0">
                                    <span v-if="bat?.fours != null">4s: {{ bat.fours }}</span>
                                    <span v-if="bat?.sixes != null" class="ml-2">6s: {{ bat.sixes }}</span>
                                    <span v-if="bat?.strike_rate != null" class="ml-2">SR: {{ bat.strike_rate }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── Bowler ── -->
                <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div class="px-4 py-2 bg-slate-800">
                        <span class="text-xs font-bold text-white uppercase tracking-wide">Bowling</span>
                    </div>
                    <div class="flex items-center gap-3 px-4 py-3">
                        <img :src="bowler?.image || placeholder" @error="imgErr"
                            class="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-slate-100" />
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-slate-900 m-0 truncate">{{ bowler?.name || '—' }}</p>
                            <p class="text-[11px] text-slate-400 m-0">Current Bowler</p>
                        </div>
                        <div class="text-right flex-shrink-0">
                            <p class="text-sm font-bold text-slate-900 m-0">
                                {{ bowler?.overs ?? '—' }}-{{ bowler?.runs ?? '—' }}-{{ bowler?.wickets ?? '—' }}
                            </p>
                            <p class="text-[11px] text-slate-500 m-0">O–R–W</p>
                        </div>
                    </div>
                </div>

                <!-- ── Current Over ── -->
                <div v-if="currentOver?.balls?.length" class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div class="px-4 py-2 bg-slate-800 flex items-center justify-between">
                        <span class="text-xs font-bold text-white uppercase tracking-wide">
                            This Over · Over {{ currentOver.over_number }}
                        </span>
                        <span class="text-[11px] text-slate-400">{{ overRunsTotal }} runs</span>
                    </div>
                    <div class="px-4 py-3 flex items-center gap-2 flex-wrap">
                        <span v-for="(ball, i) in currentOver.balls" :key="i"
                            :class="['w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', ballClass(ball)]">
                            {{ typeof ball === 'object' ? ball.ball : ball }}
                        </span>
                        <span v-for="i in Math.max(0, 6 - currentOver.balls.length)" :key="'e' + i"
                            class="w-9 h-9 rounded-full border-2 border-dashed border-slate-200 flex-shrink-0">
                        </span>
                    </div>
                </div>

                <!-- ── Projected Score Table (crex style) — 1st innings only ── -->
                <div v-if="projectedScore && !isSecondInningsLive"
                    class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div class="px-4 py-2 bg-slate-800 flex items-center gap-2">
                        <span class="text-xs font-bold text-white uppercase tracking-wide">Projected Score</span>
                        <span class="text-[11px] text-slate-400 font-normal normal-case">as per RR</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b border-slate-100">
                                    <th class="px-4 py-2 text-left text-[11px] font-semibold text-slate-500 w-24">Run Rate</th>
                                    <th v-for="col in projectionTable.rates" :key="col"
                                        :class="['px-4 py-2 text-center text-[11px] font-semibold',
                                            col.current ? 'text-yellow-500' : 'text-slate-400']">
                                        {{ col.label }}{{ col.current ? '*' : '' }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in projectionTable.rows" :key="row.overs"
                                    class="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                                    <td class="px-4 py-2.5 text-xs font-semibold text-slate-600">{{ row.overs }} Overs</td>
                                    <td v-for="(val, ci) in row.values" :key="ci"
                                        :class="['px-4 py-2.5 text-center text-sm font-semibold',
                                            projectionTable.rates[ci].current ? 'text-slate-900' : 'text-slate-500']">
                                        {{ val }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ── Win Probability ── -->
                <div v-if="winProb" class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div class="px-4 py-2 bg-slate-800 flex items-center gap-2">
                        <span class="text-xs font-bold text-white uppercase tracking-wide">Win Probability</span>
                        <span class="text-[11px] text-slate-400">
                            {{ isSecondInningsLive ? 'resource model' : 'run-rate model' }}
                        </span>
                    </div>
                    <div class="px-4 py-4">
                        <!-- Team name + pct row -->
                        <div class="flex justify-between items-baseline mb-2">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                <span class="text-sm font-semibold text-slate-800 truncate max-w-[110px] sm:max-w-none">
                                    {{ match?.team_a?.name }}
                                </span>
                            </div>
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="text-sm font-semibold text-slate-800 truncate max-w-[110px] sm:max-w-none text-right">
                                    {{ match?.team_b?.name }}
                                </span>
                                <span class="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></span>
                            </div>
                        </div>

                        <!-- Split bar -->
                        <div class="w-full h-4 rounded-full overflow-hidden flex bg-slate-100">
                            <div class="h-full bg-blue-500 transition-all duration-700"
                                :style="{ width: winProb.teamA + '%' }"></div>
                            <div class="h-full bg-red-500 transition-all duration-700 flex-1"></div>
                        </div>

                        <!-- Percentages -->
                        <div class="flex justify-between mt-2">
                            <span :class="['text-xl font-extrabold', winProb.teamA >= winProb.teamB ? 'text-blue-600' : 'text-slate-400']">
                                {{ winProb.teamA }}%
                            </span>
                            <span :class="['text-xl font-extrabold', winProb.teamB > winProb.teamA ? 'text-red-500' : 'text-slate-400']">
                                {{ winProb.teamB }}%
                            </span>
                        </div>

                        <!-- Favourite label -->
                        <p class="text-center text-xs text-slate-500 m-0 mt-1.5">
                            <span :class="winProb.teamA >= winProb.teamB ? 'text-blue-500 font-semibold' : 'text-red-500 font-semibold'">
                                {{ winProb.teamA >= winProb.teamB ? match?.team_a?.name : match?.team_b?.name }}
                            </span>
                            {{ ' are favourites' }}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    match:              Object,
    striker:            Object,
    nonStriker:         Object,
    bowler:             Object,
    currentOver:        Object,
    scoreboard:         Object,
    probability:        Object,
    crr:                [String, Number],
    rrr:                [String, Number],
    target:             Number,
    runsNeeded:         Number,
    ballsRemaining:     Number,
    projectedScore:     Object,   // { base, low, high }
    winProb:            Object,   // { teamA, teamB }
    totalOvers:         Number,
    isSecondInningsLive: Boolean,
    currentInnings:     Object,
})

const placeholder = 'https://cricketvectors.akamaized.net/players/org/CD.png'

const isEmptyObject = (o) => !o || Object.keys(o).length === 0

const isMatchNotStarted = computed(() =>
    isEmptyObject(props.striker) &&
    isEmptyObject(props.nonStriker) &&
    isEmptyObject(props.bowler) &&
    isEmptyObject(props.currentOver) &&
    isEmptyObject(props.scoreboard)
)

// ── Projected score table (crex-style: runs at different milestones × run-rates) ──
// Shows 4 run-rate columns: CRR−0.5, CRR, CRR+0.5, CRR+1 (matching image)
// Rows: every 5 overs up to totalOvers
const projectionTable = computed(() => {
    const ps = props.projectedScore
    const crr = ps ? (ps.base / (props.totalOvers ?? 20)) : 0
    if (!crr || crr <= 0) return { rates: [], rows: [] }

    const total = props.totalOvers ?? 20
    const baseRates = [
        Math.max(0, crr - 0.5),
        crr,
        crr + 0.5,
        crr + 1,
    ]

    const rates = baseRates.map((r, i) => ({
        label: r.toFixed(2),
        current: i === 1,
    }))

    // Milestone overs
    const milestones = []
    for (let o = 5; o <= total; o += 5) milestones.push(o)
    if (!milestones.includes(total)) milestones.push(total)

    const rows = milestones.map(ov => ({
        overs: ov,
        values: baseRates.map(r => Math.round(r * ov)),
    }))

    return { rates, rows }
})

const overRunsTotal = computed(() => {
    if (!props.currentOver?.balls?.length) return 0
    return props.currentOver.balls.reduce((sum, b) => {
        const val = typeof b === 'object' ? b.ball : b
        const n = parseInt(val)
        return sum + (isNaN(n) ? 0 : n)
    }, 0)
})

const imgErr = (e) => { e.target.src = placeholder }

const ballClass = (ballObj) => {
    const val = typeof ballObj === 'object' ? ballObj?.ball : ballObj
    if (val == null) return 'bg-slate-100 text-slate-500'
    const label = String(val).toUpperCase()
    if (label.includes('W') && !label.includes('WD')) return 'bg-red-500 text-white'
    if (label === '6')           return 'bg-emerald-500 text-white'
    if (label === '4')           return 'bg-blue-500 text-white'
    if (label.includes('NB'))    return 'bg-amber-500 text-white'
    if (label.includes('LB'))    return 'bg-purple-500 text-white'
    if (label.includes('WD'))    return 'bg-yellow-400 text-slate-800'
    if (label === '0')           return 'bg-slate-200 text-slate-600'
    return 'bg-slate-100 text-slate-800'
}
</script>
