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
                        <button v-for="(team, index) in teamInfo" :key="index" @click="activeTab = index"
                            class="px-4 py-2 text-sm font-medium border-b-2" :class="activeTab === index
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'">
                            {{ team.team_name }}
                        </button>
                    </div>
                </div>

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
                                <tr v-for="(batsman, i) in teamInfo[activeTab].batting" :key="i" class="border-t">
                                    <td class="p-2">{{ batsman.name }}</td>
                                    <td class="text-center">{{ batsman.runs }}</td>
                                    <td class="text-center">{{ batsman.balls }}</td>
                                    <td class="text-center">{{ batsman.fours }}</td>
                                    <td class="text-center">{{ batsman.sixes }}</td>
                                    <td class="text-center">{{ batsman.sr }}</td>
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
                                <tr v-for="(bowler, i) in teamInfo[activeTab].bowling" :key="i" class="border-t">
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
                <div>
                    <h4 class="font-semibold text-gray-700 mb-2">Fall of Wickets</h4>
                    <ul class="text-sm space-y-1">
                        <li v-for="(wicket, i) in teamInfo[activeTab].fallOfWickets" :key="i">
                            {{ wicket.player }} – {{ wicket.score }} ({{ wicket.over }})
                        </li>
                    </ul>
                </div>

                <!-- Partnerships -->
                <div>
                    <h4 class="font-semibold text-gray-700 mb-2">Partnerships</h4>
                    <PartnershipRow v-for="(partnership, i) in teamInfo[activeTab].partnerships" :key="i"
                        :data="partnership" />
                </div>

            </div>

            <!-- Sidebar -->
            <div class="space-y-4">
                <h4 class="text-lg font-semibold mb-3">Yet To Bat</h4>
                <div v-for="(player, idx) in yetToBatList" :key="idx"
                    class="bg-gray-100 p-2 rounded flex items-center gap-3 border border-gray-400">
                    <img :src="player.image || 'https://via.placeholder.com/40'" alt="Player Image"
                        class="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <p class="text-sm font-medium text-gray-800 mb-1">{{ player.name }}</p>
                        <p class="text-xs text-gray-600 m-0">{{ formatRole(player.role) }}</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PartnershipRow from './../../includes/PartnershipRow.vue';

const props = defineProps({
    match: { type: Object, required: true },
    yetToBatList: { type: Array, default: () => [] },
    scoreboard: { type: Object, default: () => ({}) },
});


console.log(props.scoreboard)

const activeTab = ref(0);

// Assuming scoreboard has innings data
const teamInfo = computed(() => {
    return props.scoreboard.scoreboards.map(team => ({
        team_name: team.team_name,
        batting: team.batting,
        bowling: team.bowling,
        fallOfWickets: team.fallOfWickets,
        partnerships: team.partnerships,
    }));
});

// Format player role
function formatRole(role) {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
}
</script>
