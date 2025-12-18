<template>
    <section id="home" class="bg-home" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center" style="padding-top: 9rem;">
            <div class="container mx-auto px-4">
                <div class="w-full lg:w-12/12 px-4">
                    <!-- Match Header -->
                    <div class="flex flex-wrap -mx-4 justify-between items-center pb-12">
                        <!-- Team A -->
                        <div class="w-full lg:w-5/12 px-4 mb-6 lg:mb-0">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <img v-if="match?.team_a?.logo && !match?.team_a?.logo.includes('team-dummy')"
                                        :src="match?.team_a?.logo" @error="onImageError($event, 'team_a')"
                                        :alt="match?.team_a?.name"
                                        class="w-16 h-16 rounded-full border-2 border-white/20" />
                                    <div v-else
                                        class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                                        <span class="font-bold text-blue-700 text-xl">{{
                                            getTeamAbbreviation(match?.team_a?.name)
                                        }}</span>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-lg font-semibold text-gray-100 mb-1">{{ match?.team_a?.name }}</h4>
                                    <div v-if="currentInnings && currentInnings.batting_team_id === match?.team_a?.id">
                                        <div class="flex items-center">
                                            <span class="text-2xl font-bold text-white">{{
                                                getCurrentInningsScore('team_a') }}</span>
                                            <span class="text-sm text-gray-300 ml-2">({{
                                                getCurrentInningsOvers('team_a') }})</span>
                                        </div>
                                        <div class="text-xs text-gray-400 mt-1">
                                            CRR: {{ getCurrentRunRate('team_a') }}
                                        </div>
                                    </div>
                                    <div v-else-if="match?.status === 'completed'">
                                        <div class="flex items-center">
                                            <span class="text-2xl font-bold text-white">{{ getTotalScore('team_a')
                                                }}</span>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="text-lg text-gray-400">Yet to Bat</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Match Status & Info -->
                        <div class="w-full lg:w-2/12 px-4 mb-6 lg:mb-0">
                            <div class="text-center">
                                <div class="mb-3">
                                    <span :class="[
                                        'inline-block px-3 py-1 text-xs font-semibold rounded-full',
                                        match.status === 'live' ? 'bg-red-500 text-white' :
                                            match.status === 'completed' ? 'bg-green-500 text-white' :
                                                'bg-yellow-500 text-white'
                                    ]">
                                        {{ match.status?.toUpperCase() || 'UPCOMING' }}
                                    </span>
                                </div>

                                <div v-if="match.status === 'live' && currentInnings">
                                    <div class="text-lg font-bold text-yellow-300 mb-1">
                                        {{ getRequiredRunRate() }} RRR
                                    </div>
                                    <div class="text-sm text-gray-300">
                                        {{ getTarget() }} runs to win
                                    </div>
                                </div>

                                <div v-else-if="match.status === 'live'">
                                    <div class="text-lg font-bold text-yellow-300">
                                        Innings Break
                                    </div>
                                </div>

                                <div v-else-if="match.status === 'completed'">
                                    <div class="text-lg font-bold text-green-300">
                                        {{ getMatchResult() }}
                                    </div>
                                </div>

                                <div v-else>
                                    <div class="text-sm text-gray-300">
                                        {{ formatMatchDateTime(match.date, match.match_time) }}
                                    </div>
                                </div>

                                <div class="text-xs text-gray-400 mt-2">
                                    {{ match.venue || 'Venue TBD' }}
                                </div>
                            </div>
                        </div>

                        <!-- Team B -->
                        <div class="w-full lg:w-5/12 px-4">
                            <div class="flex items-center justify-end">
                                <div class="text-right mr-4">
                                    <h4 class="text-lg font-semibold text-gray-100 mb-1">{{ match?.team_b?.name }}</h4>
                                    <div v-if="currentInnings && currentInnings.batting_team_id === match?.team_b?.id">
                                        <div class="flex items-center justify-end">
                                            <span class="text-sm text-gray-300 mr-2">({{
                                                getCurrentInningsOvers('team_b') }})</span>
                                            <span class="text-2xl font-bold text-white">{{
                                                getCurrentInningsScore('team_b') }}</span>
                                        </div>
                                        <div class="text-xs text-gray-400 mt-1 text-right">
                                            CRR: {{ getCurrentRunRate('team_b') }}
                                        </div>
                                    </div>
                                    <div v-else-if="match?.status === 'completed'">
                                        <div class="flex items-center justify-end">
                                            <span class="text-2xl font-bold text-white">{{ getTotalScore('team_b')
                                                }}</span>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="text-lg text-gray-400 text-right">Yet to Bat</div>
                                    </div>
                                </div>
                                <div class="flex-shrink-0">
                                    <img v-if="match?.team_b?.logo && !match?.team_b?.logo.includes('team-dummy')"
                                        :src="match?.team_b?.logo" @error="onImageError($event, 'team_b')"
                                        :alt="match?.team_b?.name"
                                        class="w-16 h-16 rounded-full border-2 border-white/20" />
                                    <div v-else
                                        class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-100">
                                        <span class="font-bold text-red-700 text-xl">{{
                                            getTeamAbbreviation(match?.team_b?.name)
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs Navigation -->
                    <div class="mb-0 flex space-x-4 w-full lg:w-12/12 border-b border-gray-700">
                        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="['px-4 py-2 font-medium transition-all duration-200',
                            activeTab === tab
                                ? 'border-b-2 border-green-500 text-green-500'
                                : 'text-gray-200 hover:text-gray-300'
                        ]">
                            {{ tab }}
                            <span v-if="tab === 'Live' && match.status === 'live'"
                                class="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block animate-pulse"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="min-h-screen">
        <!-- Tab Content -->
        <div>
            <MatchInfo v-if="activeTab === 'Match Info'" :tournament="match.tournament" :match="match" />
            <LiveScore v-if="activeTab === 'Live'" :match="match" :currentInnings="currentInnings" />
            <ScoreCard v-if="activeTab === 'Scorecard'" :match="match" />
        </div>
    </div>
</template>

<script setup>
import bgHome from './../../assets/bg/bg-home.png'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMatchBySlug } from './../api/matches'
import MatchInfo from '../includes/tabs/MatchInfo.vue'
import LiveScore from '../includes/tabs/LiveScore.vue'
import ScoreCard from '../includes/tabs/ScoreCard.vue'
import {
    getTeamAbbreviation,
    formatMatchDateTime,
    getMatchResult
} from './../../helpers/MatchHelper'

const route = useRoute()
const match = ref({})
const tabs = ['Match Info', 'Live', 'Scorecard']
const activeTab = ref('Match Info')

// Computed properties for dynamic data
const currentInnings = computed(() => {
    if (!match.value.innings || !Array.isArray(match.value.innings)) return null;

    // Find the innings that is currently in progress
    return match.value.innings.find(innings => innings.status === 'in_progress') ||
        match.value.innings[match.value.innings.length - 1]; // Last innings if none in progress
});

const inningsByTeam = computed(() => {
    const innings = {};
    if (match.value.innings && Array.isArray(match.value.innings)) {
        match.value.innings.forEach(inning => {
            if (inning.batting_team_id) {
                innings[inning.batting_team_id] = inning;
            }
        });
    }
    return innings;
});

// Methods for dynamic data display
const getCurrentInningsScore = (teamType) => {
    if (!currentInnings.value) return '0/0';

    const teamId = teamType === 'team_a' ? match.value.team_a?.id : match.value.team_b?.id;

    if (currentInnings.value.batting_team_id === teamId) {
        return `${currentInnings.value.runs || 0}/${currentInnings.value.wickets || 0}`;
    }
    return '0/0';
};

const getCurrentInningsOvers = (teamType) => {
    if (!currentInnings.value) return '0.0';

    const teamId = teamType === 'team_a' ? match.value.team_a?.id : match.value.team_b?.id;

    if (currentInnings.value.batting_team_id === teamId) {
        return (currentInnings.value.overs || 0).toFixed(1);
    }
    return '0.0';
};

const getCurrentRunRate = (teamType) => {
    if (!currentInnings.value) return '0.0';

    const teamId = teamType === 'team_a' ? match.value.team_a?.id : match.value.team_b?.id;

    if (currentInnings.value.batting_team_id === teamId && currentInnings.value.overs > 0) {
        return ((currentInnings.value.runs || 0) / currentInnings.value.overs).toFixed(2);
    }
    return '0.0';
};

const getTotalScore = (teamType) => {
    if (!match.value.innings || !Array.isArray(match.value.innings)) return '0';

    const teamId = teamType === 'team_a' ? match.value.team_a?.id : match.value.team_b?.id;
    const teamInnings = match.value.innings.filter(inning => inning.batting_team_id === teamId);

    if (teamInnings.length === 0) return '0';

    // For completed matches, show the final score
    const lastInnings = teamInnings[teamInnings.length - 1];
    return `${lastInnings.runs || 0}/${lastInnings.wickets || 0}`;
};

const getRequiredRunRate = () => {
    if (!currentInnings.value || !match.value.innings || match.value.innings.length < 2) return '0.0';

    // RRR calculation for chasing team
    const firstInnings = match.value.innings[0];
    const target = (firstInnings.runs || 0) + 1;
    const currentRuns = currentInnings.value.runs || 0;
    const remainingRuns = target - currentRuns;
    const remainingOvers = 20 - (currentInnings.value.overs || 0);

    if (remainingRuns <= 0 || remainingOvers <= 0) return '0.0';

    return (remainingRuns / remainingOvers).toFixed(2);
};

const getTarget = () => {
    if (!match.value.innings || match.value.innings.length < 2) return 0;

    const firstInnings = match.value.innings[0];
    return (firstInnings.runs || 0) + 1;
};

const onImageError = (event, teamType) => {
    // Set a default image or show placeholder
    event.target.style.display = 'none';
    // The fallback div will show because of v-else
};

onMounted(async () => {
    const id = route.params.id

    if (!id) {
        console.error('ID not found in route params')
        return
    }

    try {
        match.value = await fetchMatchBySlug(id);

        if (!match.value) {
            console.error('Match not found for id:', route.params.id)
            return;
        }

        // Auto-select Live tab if match is live
        if (match.value.status === 'live') {
            activeTab.value = 'Live';
        }
    } catch (error) {
        console.error('Error fetching match:', error);
    }
});

// Watch for match status changes
watch(() => match.value.status, (newStatus) => {
    if (newStatus === 'live') {
        activeTab.value = 'Live';
    }
});

</script>

<style scoped>
.bg-home {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #1a202c;
    /* Fallback color */
}

/* Smooth transitions */
button {
    transition: all 0.2s ease;
}
</style>