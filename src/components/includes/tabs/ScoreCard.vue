<template>
    <div class="container bg-white min-h-screen">
        <div class="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8">

                <!-- Scorecard Header -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Scorecard</h3>

                <!-- Innings Tabs -->
                <div class="flex gap-2 border-b">
                    <button v-for="(inning, index) in inningsData" :key="index" @click="activeTab = index"
                        class="px-4 py-2 text-sm font-medium border-b-2" :class="activeTab === index
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'">
                        {{ inning.team_name }}
                    </button>
                </div>
            </div>

            <!-- Inning Content -->
            <div v-if="inningsData[activeTab]" class="space-y-8">
                <!-- Batting Table -->
                <div>
                    <h4 class="font-semibold text-gray-700 mb-2">Batting</h4>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm border">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="text-left p-2">Batsman</th>
                                    <th class="p-2">R</th>
                                    <th class="p-2">B</th>
                                    <th class="p-2">4s</th>
                                    <th class="p-2">6s</th>
                                    <th class="p-2">SR</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(batsman, i) in inningsData[activeTab].batting" :key="i" class="border-t">
                                    <td class="p-2">{{ batsman.name }}</td>
                                    <td class="text-center">{{ batsman.runs }}</td>
                                    <td class="text-center">{{ batsman.balls }}</td>
                                    <td class="text-center">{{ batsman.fours }}</td>
                                    <td class="text-center">{{ batsman.sixes }}</td>
                                    <td class="text-center">{{ batsman.sr }}</td>
                                </tr>
                                <tr class="bg-gray-50 font-bold">
                                    <td class="p-2">TOTAL</td>
                                    <td class="text-center" colspan="5">
                                        {{ inningsData[activeTab].total_runs }}/{{ inningsData[activeTab].total_wickets }}
                                        ({{ inningsData[activeTab].total_overs }} Ov)
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Bowling Table -->
                <div>
                    <h4 class="font-semibold text-gray-700 mb-2">Bowling</h4>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm border">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="text-left p-2">Bowler</th>
                                    <th class="p-2">O</th>
                                    <th class="p-2">M</th>
                                    <th class="p-2">R</th>
                                    <th class="p-2">W</th>
                                    <th class="p-2">ER</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(bowler, i) in inningsData[activeTab].bowling" :key="i" class="border-t">
                                    <td class="p-2">{{ bowler.name }}</td>
                                    <td class="text-center">{{ bowler.overs }}</td>
                                    <td class="text-center">{{ bowler.maidens }}</td>
                                    <td class="text-center">{{ bowler.runs }}</td>
                                    <td class="text-center">{{ bowler.wickets }}</td>
                                    <td class="text-center">{{ bowler.economy }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Fall Of Wickets -->
                <div v-if="inningsData[activeTab].fallOfWickets?.length">
                    <h4 class="font-semibold text-gray-700 mb-2">Fall of Wickets</h4>
                    <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                        <span v-for="(wicket, i) in inningsData[activeTab].fallOfWickets" :key="i" class="whitespace-nowrap">
                            {{ i + 1 }}-{{ wicket.score }} ({{ wicket.player }}, {{ wicket.over }}){{ i < inningsData[activeTab].fallOfWickets.length - 1 ? ',' : '' }}
                        </span>
                    </div>
                </div>

                <!-- Partnerships -->
                <div v-if="inningsData[activeTab].partnerships?.length">
                    <h4 class="font-semibold text-gray-700 mb-2">Partnerships</h4>
                    <div class="space-y-2">
                        <div v-for="(partnership, i) in inningsData[activeTab].partnerships" :key="i"
                             class="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100 text-sm">
                            <div class="flex-1 text-left font-medium">{{ partnership.batter1 }}</div>
                            <div class="flex-1 text-center bg-blue-100 text-blue-800 rounded-full py-1 text-xs font-bold mx-4">
                                {{ partnership.runs }} ({{ partnership.balls }})
                            </div>
                            <div class="flex-1 text-right font-medium">{{ partnership.batter2 }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex items-center justify-center h-64 text-gray-400">
                Innings data not available yet.
            </div>

        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
            <h4 class="text-lg font-semibold mb-3">Yet To Bat</h4>
            <div v-if="yetToBatList?.length">
                <div v-for="(player, idx) in yetToBatList" :key="idx"
                    class="bg-gray-100 p-2 rounded flex items-center gap-3 border border-gray-400 mb-2">
                    <img :src="player.player?.image || 'https://via.placeholder.com/40'" alt="Player Image"
                        class="w-10 h-10 rounded-full object-cover" @error="$event.target.src = 'https://via.placeholder.com/40'"/>
                    <div>
                        <p class="text-sm font-medium text-gray-800 mb-1">{{ player.player?.user?.full_name || player.name }}</p>
                        <p class="text-xs text-gray-600 m-0">{{ formatRole(player.player?.player_role || player.role) }}</p>
                    </div>
                </div>
            </div>
            <div v-else class="text-sm text-gray-400 italic">
                No players listed.
            </div>
        </div>

    </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    match: { type: Object, required: true },
    yetToBatList: { type: Array, default: () => [] },
});

const activeTab = ref(0);

// Group data by innings
const inningsData = computed(() => {
    if (!props.match || !props.match.scoreboard || !Array.isArray(props.match.scoreboard)) return [];

    // Sort scoreboard by innings
    const scoreboards = [...props.match.scoreboard].sort((a, b) => a.innings - b.innings);

    return scoreboards.map(sb => {
        const teamId = sb.team_id;
        const opponentId = (teamId === props.match.team_a_id) ? props.match.team_b_id : props.match.team_a_id;
        const teamName = (teamId === props.match.team_a_id) ? props.match.teamA?.name : props.match.teamB?.name;

        // Batting stats for this team
        const batting = (props.match.players || [])
            .filter(mp => mp.team_id === teamId && (mp.balls_faced > 0 || (mp.status && !['ready', 'fielding'].includes(mp.status))))
            .map(mp => ({
                name: mp.player?.user?.full_name || '---',
                runs: mp.runs_scored || 0,
                balls: mp.balls_faced || 0,
                fours: mp.fours || 0,
                sixes: mp.sixes || 0,
                sr: mp.balls_faced > 0 ? ((mp.runs_scored / mp.balls_faced) * 100).toFixed(2) : '0.00'
            }));

        // Bowling stats (opposing team bowlers)
        const bowling = (props.match.players || [])
            .filter(mp => mp.team_id === opponentId && (parseFloat(mp.overs_bowled) > 0 || mp.runs_conceded > 0))
            .map(mp => ({
                name: mp.player?.user?.full_name || '---',
                overs: mp.overs_bowled || '0.0',
                maidens: mp.maidens || 0,
                runs: mp.runs_conceded || 0,
                wickets: mp.wickets_taken || 0,
                economy: parseFloat(mp.overs_bowled) > 0 ? (mp.runs_conceded / parseFloat(mp.overs_bowled)).toFixed(2) : '0.00'
            }));

        // Fall of wickets
        const fallOfWickets = (props.match.wickets || [])
            .filter(w => w.team_id === teamId)
            .map(w => ({
                player: w.batter?.user?.full_name || '---',
                score: w.runs,
                over: w.overs
            }));

        // Partnerships
        const partnerships = (props.match.partnerships || [])
            .filter(p => p.team_id === teamId)
            .map(p => ({
                batter1: p.batter1?.user?.full_name || '---',
                batter2: p.batter2?.user?.full_name || '---',
                runs: p.runs,
                balls: p.balls
            }));

        return {
            team_name: teamName,
            batting,
            bowling,
            fallOfWickets,
            partnerships,
            total_runs: sb.runs,
            total_wickets: sb.wickets,
            total_overs: sb.overs
        };
    });
});

// Format player role
function formatRole(role) {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
}
</script>
