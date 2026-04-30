<template>
    <div class="bg-slate-50 min-h-screen py-5">
        <div class="container mx-auto px-4 max-w-3xl space-y-4">

            <!-- ── Innings tab switcher ── -->
            <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div class="flex overflow-x-auto hide-scrollbar">
                    <button v-for="(inning, idx) in inningsData" :key="idx"
                        @click="activeTab = idx"
                        :class="['flex-shrink-0 flex-1 min-w-[120px] py-3 px-4 text-sm font-semibold text-center transition-colors border-b-2',
                            activeTab === idx
                                ? 'border-red-500 text-red-600 bg-red-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50']">
                        {{ inning.team_name || `Innings ${idx + 1}` }}
                    </button>
                </div>
            </div>

            <!-- ── No data state ── -->
            <div v-if="!inningsData.length"
                class="bg-white rounded-xl border border-slate-100 p-10 text-center">
                <p class="text-slate-400 text-sm m-0">Scorecard not available yet.</p>
            </div>

            <template v-else-if="inningsData[activeTab]">

                <!-- ── Batting Table ── -->
                <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div class="px-4 py-2.5 bg-slate-800 flex items-center justify-between">
                        <span class="text-xs font-bold text-white uppercase tracking-wide">Batting</span>
                        <span class="text-[11px] text-slate-400">R &nbsp; B &nbsp; 4s &nbsp; 6s &nbsp; SR</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <tbody class="divide-y divide-slate-50">
                                <tr v-for="(bat, i) in inningsData[activeTab].batting" :key="i"
                                    class="hover:bg-slate-50/60 transition-colors">
                                    <td class="px-4 py-3 font-semibold text-slate-800 min-w-[130px]">{{ bat.name }}</td>
                                    <td class="px-3 py-3 text-center font-bold text-slate-900 w-10">{{ bat.runs }}</td>
                                    <td class="px-3 py-3 text-center text-slate-500 w-10">{{ bat.balls }}</td>
                                    <td class="px-3 py-3 text-center text-slate-500 w-10">{{ bat.fours }}</td>
                                    <td class="px-3 py-3 text-center text-slate-500 w-10">{{ bat.sixes }}</td>
                                    <td class="px-3 py-3 text-center text-slate-500 w-16">{{ bat.sr }}</td>
                                </tr>
                                <!-- Extras row -->
                                <tr v-if="inningsData[activeTab].extras != null" class="bg-slate-50/40">
                                    <td class="px-4 py-2 text-xs text-slate-400 italic" colspan="2">
                                        Extras: {{ inningsData[activeTab].extras }}
                                    </td>
                                    <td colspan="4"></td>
                                </tr>
                                <!-- Total row -->
                                <tr class="bg-slate-800 text-white">
                                    <td class="px-4 py-2.5 text-xs font-bold uppercase tracking-wide">Total</td>
                                    <td colspan="5" class="px-3 py-2.5 text-sm font-bold text-right pr-4">
                                        {{ inningsData[activeTab].total_runs }}/{{ inningsData[activeTab].total_wickets }}
                                        <span class="text-slate-400 font-normal ml-1 text-xs">
                                            ({{ inningsData[activeTab].total_overs }} Ov)
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ── Bowling Table ── -->
                <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div class="px-4 py-2.5 bg-slate-800 flex items-center justify-between">
                        <span class="text-xs font-bold text-white uppercase tracking-wide">Bowling</span>
                        <span class="text-[11px] text-slate-400">O &nbsp; M &nbsp; R &nbsp; W &nbsp; ER</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <tbody class="divide-y divide-slate-50">
                                <tr v-for="(bwl, i) in inningsData[activeTab].bowling" :key="i"
                                    class="hover:bg-slate-50/60 transition-colors">
                                    <td class="px-4 py-3 font-semibold text-slate-800 min-w-[130px]">{{ bwl.name }}</td>
                                    <td class="px-3 py-3 text-center text-slate-500 w-10">{{ bwl.overs }}</td>
                                    <td class="px-3 py-3 text-center text-slate-500 w-10">{{ bwl.maidens }}</td>
                                    <td class="px-3 py-3 text-center text-slate-500 w-10">{{ bwl.runs }}</td>
                                    <td class="px-3 py-3 text-center font-bold text-slate-900 w-10">{{ bwl.wickets }}</td>
                                    <td class="px-3 py-3 text-center text-slate-500 w-14">{{ bwl.economy }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ── Fall of Wickets ── -->
                <div v-if="inningsData[activeTab].fallOfWickets?.length"
                    class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div class="px-4 py-2.5 bg-slate-800 flex items-center gap-2">
                        <span class="text-xs font-bold text-white uppercase tracking-wide">Fall of Wickets</span>
                    </div>
                    <div class="p-4 flex flex-wrap gap-2">
                        <div v-for="(w, i) in inningsData[activeTab].fallOfWickets" :key="i"
                            class="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                            <!-- Wicket number badge -->
                            <span class="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                {{ i + 1 }}
                            </span>
                            <div>
                                <p class="text-sm font-bold text-slate-800 m-0 leading-tight">{{ w.score }}</p>
                                <p class="text-[11px] text-slate-400 m-0 leading-tight truncate max-w-[100px]">
                                    {{ w.player }}, {{ w.over }} ov
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="bg-white rounded-xl border border-slate-100 px-4 py-3 text-xs text-slate-400 italic">
                    No wickets fallen yet.
                </div>

                <!-- ── Partnerships ── -->
                <div v-if="inningsData[activeTab].partnerships?.length"
                    class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div class="px-4 py-2.5 bg-slate-800 flex items-center gap-2">
                        <span class="text-xs font-bold text-white uppercase tracking-wide">Partnerships</span>
                    </div>
                    <div class="divide-y divide-slate-50">
                        <div v-for="(p, i) in inningsData[activeTab].partnerships" :key="i" class="px-4 py-3">
                            <!-- Batter names + runs/balls -->
                            <div class="flex items-center justify-between mb-2 gap-2">
                                <p class="text-xs font-semibold text-slate-700 m-0 truncate flex-1">{{ p.batter1 }}</p>
                                <div class="flex-shrink-0 text-center px-3">
                                    <p class="text-sm font-extrabold text-slate-900 m-0 leading-tight">{{ p.runs }}</p>
                                    <p class="text-[10px] text-slate-400 m-0 leading-tight">({{ p.balls }} balls)</p>
                                </div>
                                <p class="text-xs font-semibold text-slate-700 m-0 truncate flex-1 text-right">{{ p.batter2 }}</p>
                            </div>
                            <!-- Two-color progress bar -->
                            <div class="w-full h-2 rounded-full overflow-hidden flex bg-slate-100">
                                <template v-if="p.runs > 0">
                                    <!-- batter1 contribution (blue), batter2 (red) -->
                                    <div class="h-full bg-blue-500 transition-all"
                                        :style="{ width: pct(p.batter1Runs, p.runs) + '%' }"></div>
                                    <div class="h-full bg-red-400 transition-all flex-1"></div>
                                </template>
                                <!-- Zero-run partnership -->
                                <div v-else class="h-full bg-slate-200 w-full rounded-full"></div>
                            </div>
                            <!-- Batter run labels -->
                            <div v-if="p.runs > 0" class="flex justify-between mt-1">
                                <span class="text-[10px] text-blue-500 font-semibold">
                                    {{ p.batter1Runs ?? '—' }} <span class="text-slate-400 font-normal">({{ p.batter1Balls ?? '—' }}b)</span>
                                </span>
                                <span class="text-[10px] text-red-400 font-semibold">
                                    {{ p.batter2Runs ?? '—' }} <span class="text-slate-400 font-normal">({{ p.batter2Balls ?? '—' }}b)</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── Yet to Bat ── -->
                <div v-if="yetToBatList?.length" class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div class="px-4 py-2.5 bg-slate-800 flex items-center gap-2">
                        <span class="text-xs font-bold text-white uppercase tracking-wide">Yet to Bat</span>
                    </div>
                    <div class="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div v-for="(player, idx) in yetToBatList" :key="idx"
                            class="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <img :src="playerImg(player)" @error="imgErr"
                                class="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200" />
                            <div class="min-w-0">
                                <p class="text-xs font-semibold text-slate-800 m-0 truncate">
                                    {{ player.player?.user?.full_name || player.user?.full_name || player.full_name || player.name || '—' }}
                                </p>
                                <p class="text-[10px] text-slate-400 m-0">
                                    {{ formatRole(player.player?.player_role || player.player_role || player.role) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </template>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    match:       { type: Object, required: true },
    yetToBatList: { type: Array, default: () => [] },
    scoreboard:  { type: [Array, Object], default: null },
})

const activeTab = ref(0)

const placeholder = 'https://cricketvectors.akamaized.net/players/org/CD.png'

const imgErr     = (e) => { e.target.src = placeholder }
const playerImg  = (p) => p?.player?.image || p?.image || placeholder

const pct = (part, total) => {
    if (!total || total <= 0) return 50
    return Math.max(0, Math.min(100, Math.round((part / total) * 100)))
}

const formatRole = (role) => {
    if (!role) return ''
    return role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Build per-innings data from match.scoreboard + match.players + match.wickets + match.partnerships
const inningsData = computed(() => {
    if (!props.match?.scoreboard || !Array.isArray(props.match.scoreboard)) return []

    const scoreboards = [...props.match.scoreboard].sort((a, b) => a.innings - b.innings)

    return scoreboards.map(sb => {
        const teamId    = sb.team_id ?? sb.batting_team_id
        const oppId     = teamId === props.match.team_a_id ? props.match.team_b_id : props.match.team_a_id
        const teamObj   = teamId === props.match.team_a_id ? (props.match.teamA ?? props.match.team_a) : (props.match.teamB ?? props.match.team_b)
        const teamName  = teamObj?.name ?? sb.team?.name ?? `Innings ${sb.innings}`

        // ── Batting ──
        const batting = (props.match.players || [])
            .filter(mp => mp.team_id === teamId &&
                (mp.balls_faced > 0 || (mp.status && !['ready', 'fielding'].includes(mp.status))))
            .map(mp => ({
                name:   mp.player?.user?.full_name || '—',
                runs:   mp.runs_scored  ?? 0,
                balls:  mp.balls_faced  ?? 0,
                fours:  mp.fours        ?? 0,
                sixes:  mp.sixes        ?? 0,
                sr:     mp.balls_faced > 0
                    ? ((mp.runs_scored / mp.balls_faced) * 100).toFixed(1)
                    : '0.0',
            }))

        // ── Bowling ──
        const bowling = (props.match.players || [])
            .filter(mp => mp.team_id === oppId &&
                (parseFloat(mp.overs_bowled) > 0 || mp.runs_conceded > 0))
            .map(mp => ({
                name:    mp.player?.user?.full_name || '—',
                overs:   mp.overs_bowled   ?? '0.0',
                maidens: mp.maidens        ?? 0,
                runs:    mp.runs_conceded  ?? 0,
                wickets: mp.wickets_taken  ?? 0,
                economy: parseFloat(mp.overs_bowled) > 0
                    ? (mp.runs_conceded / parseFloat(mp.overs_bowled)).toFixed(2)
                    : '0.00',
            }))

        // ── Fall of Wickets ──
        const fallOfWickets = (props.match.wickets || [])
            .filter(w => w.team_id === teamId)
            .sort((a, b) => a.wicket_number - b.wicket_number)
            .map(w => ({
                player: w.batter?.user?.full_name || '—',
                score:  w.runs ?? '—',
                over:   w.overs ?? '—',
            }))

        // ── Partnerships ──
        // Build a lookup of player id → runs/balls from match.players
        const playerStats = {}
        ;(props.match.players || []).forEach(mp => {
            playerStats[mp.player_id] = { runs: mp.runs_scored ?? 0, balls: mp.balls_faced ?? 0 }
        })

        const partnerships = (props.match.partnerships || [])
            .filter(p => p.team_id === teamId)
            .map(p => {
                const b1Runs  = p.batter1_runs  ?? p.batter1?.runs  ?? null
                const b2Runs  = p.batter2_runs  ?? p.batter2?.runs  ?? null
                const b1Balls = p.batter1_balls ?? p.batter1?.balls ?? null
                const b2Balls = p.batter2_balls ?? p.batter2?.balls ?? null
                return {
                    batter1:     p.batter1?.user?.full_name || '—',
                    batter2:     p.batter2?.user?.full_name || '—',
                    runs:        p.runs  ?? 0,
                    balls:       p.balls ?? 0,
                    batter1Runs: b1Runs,
                    batter2Runs: b2Runs,
                    batter1Balls: b1Balls,
                    batter2Balls: b2Balls,
                }
            })

        return {
            team_name:      teamName,
            batting,
            bowling,
            fallOfWickets,
            partnerships,
            extras:         sb.extras ?? null,
            total_runs:     sb.runs     ?? 0,
            total_wickets:  sb.wickets  ?? 0,
            total_overs:    sb.overs    ?? 0,
        }
    })
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
