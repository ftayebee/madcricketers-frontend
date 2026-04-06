<template>
    <div class="container mx-auto bg-white min-h-screen py-6 px-4">
        <div v-if="isMatchNotStarted" class="flex items-center justify-center min-h-[60vh]">
            <div class="text-center bg-yellow-50 border border-yellow-300 px-6 py-4 rounded">
                <p class="text-lg font-semibold text-yellow-800">
                    Match will start soon 🏏
                </p>
                <p class="text-sm text-yellow-700 mt-1">
                    Stay tuned for live updates
                </p>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- LEFT: Batting & Over Info -->
            <div class="lg:col-span-2 space-y-6">

                <!-- Batters -->
                <div class="flex flex-col sm:flex-row justify-between gap-4">
                    <!-- Striker -->
                    <div class="flex-1 bg-gray-100 p-3 rounded flex items-center gap-3">
                        <img :src="striker?.image || placeholder" class="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5">
                                <p class="text-sm font-semibold m-0 truncate">
                                    {{ striker?.name }}
                                </p>
                                <span v-if="striker?.status === 'on-strike'" class="w-2 h-2 bg-blue-500 rounded-full inline-block flex-shrink-0"></span>
                            </div>
                            <p class="text-sm m-0 text-gray-600 whitespace-nowrap">
                                {{ striker?.runs }} <span v-if="striker?.balls">({{ striker?.balls }})</span>
                            </p>
                        </div>
                    </div>

                    <!-- Non-Striker -->
                    <div class="flex-1 bg-gray-100 p-3 rounded flex items-center gap-3">
                        <img :src="nonStriker?.image || placeholder" class="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5">
                                <p class="text-sm font-semibold m-0 truncate">
                                    {{ nonStriker?.name }}
                                </p>
                                <span v-if="nonStriker?.status === 'on-strike'" class="w-2 h-2 bg-blue-500 rounded-full inline-block flex-shrink-0"></span>
                            </div>
                            <p class="text-xs text-gray-600 whitespace-nowrap m-0">
                                {{ nonStriker?.runs }} <span v-if="nonStriker?.balls">({{ nonStriker?.balls }})</span>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Bowler -->
                <div class="bg-gray-100 p-3 rounded flex items-center gap-3">
                    <img :src="bowler?.image || placeholder" class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    <div class="min-w-0 flex-1">
                        <p class="text-sm font-semibold truncate">{{ bowler?.name }}</p>
                        <p class="text-xs text-gray-600 whitespace-nowrap">
                            {{ bowler?.overs }} - {{ bowler?.runs }} - {{ bowler?.wickets }}
                        </p>
                    </div>
                </div>

                <!-- Current Over -->
                <div class="bg-gray-50 p-4 rounded" v-if="currentOver?.balls?.length > 0">
                    <p class="text-sm font-medium mb-2">
                        Current Over
                    </p>

                    <div class="flex gap-2" >
                        <span v-for="(ball, i) in currentOver?.balls" :key="i"
                            class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold"
                            :class="ballClass(ball)">
                            {{ ball?.ball }}
                        </span>
                    </div>
                </div>

            </div>

            <!-- RIGHT: Scoreboard & Probability -->
            <div class="space-y-6">

                <!-- Scoreboard -->
                <div class="bg-gray-50 p-4 rounded">
                    <p class="text-lg font-semibold mb-2">Score</p>
                    <p class="text-2xl font-bold">
                        {{ scoreboard?.runs }}/{{ scoreboard?.wickets }}
                    </p>
                    <p class="text-sm text-gray-600">
                        Overs: {{ scoreboard?.overs }}
                    </p>
                </div>

                <!-- Projected Score -->
                <div class="bg-gray-50 p-4 rounded">
                    <p class="text-lg font-semibold mb-2">
                        Projected Score
                        <span class="text-sm text-gray-500">(as per RR)</span>
                    </p>
                    <p class="text-xl font-bold">
                        {{ scoreboard?.projected_score }}
                    </p>
                </div>

                <!-- Win Probability -->
                <div class="bg-gray-50 p-4 rounded">
                    <p class="text-lg font-semibold mb-3">Win Probability</p>

                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span>{{ probability?.team_a?.name }}</span>
                            <span>{{ probability?.team_a?.percent }}%</span>
                        </div>

                        <div class="w-full h-2 bg-gray-200 rounded overflow-hidden">
                            <div class="h-full bg-green-500" :style="{ width: probability?.team_a?.percent + '%' }">
                            </div>
                        </div>

                        <div class="flex justify-between text-sm mt-2">
                            <span>{{ probability?.team_b?.name }}</span>
                            <span>{{ probability?.team_b?.percent }}%</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>


<script setup>
import { computed } from 'vue'


const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;

const props = defineProps({
    striker: Object,
    nonStriker: Object,
    bowler: Object,
    currentOver: Object,
    scoreboard: Object,
    probability: Object,
})

const placeholder = 'https://cricketvectors.akamaized.net/players/org/CD.png'

const isMatchNotStarted = computed(() => {
    return (
        isEmptyObject(props.striker) &&
        isEmptyObject(props.nonStriker) &&
        isEmptyObject(props.bowler) &&
        isEmptyObject(props.currentOver) &&
        isEmptyObject(props.scoreboard) &&
        isEmptyObject(props.probability)
    )
});

const ballClass = (ballObj) => {
    if (!ballObj) return 'bg-gray-200 text-gray-800';
    const val = typeof ballObj === 'object' ? ballObj.ball : ballObj;
    if (!val) return 'bg-gray-200 text-gray-800';
    
    const label = String(val).toUpperCase();
    
    if (label.includes('W') && !label.includes('WD')) return 'bg-red-500 text-white';
    if (label === '6') return 'bg-green-500 text-white';
    if (label === '4') return 'bg-blue-500 text-white';
    if (label.includes('NB')) return 'bg-amber-500 text-white';
    if (label.includes('LB')) return 'bg-purple-500 text-white';
    if (label.includes('WD')) return 'bg-yellow-500 text-gray-800';
    if (label.includes('B') && !label.includes('NB') && !label.includes('LB')) return 'bg-teal-500 text-white';
    
    if (label === '0') return 'bg-gray-300 text-gray-700';
    return 'bg-gray-100 text-gray-800';
}
</script>