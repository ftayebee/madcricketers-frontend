<template>
    <section id="home" class="bg-home" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center" style="padding-top: 9rem;">
            <div class="container mx-auto px-4">
                <div class="w-full lg:w-12/12 px-4">
                    <!-- Match Header -->
                    <div class="flex flex-wrap -mx-4 justify-between items-center pb-12">
                        <!-- Team A -->
                        <div class="w-full lg:w-4/12 px-4 mb-6 lg:mb-0">
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
                        <div class="w-full lg:w-4/12 px-4 mb-6 lg:mb-0">
                            <div class="text-center">
                                <div class="mb-3">
                                    <span :class="[
                                        'inline-block px-3 py-1 text-xs font-semibold rounded-full',
                                        match?.status === 'live' ? 'bg-red-500 text-white' :
                                            match?.status === 'completed' ? 'bg-green-500 text-white' :
                                                'bg-yellow-500 text-white'
                                    ]">
                                        {{ match?.status?.toUpperCase() || 'UPCOMING' }}
                                    </span>
                                </div>

                                <!-- Innings started -->
                                <div v-if="match?.status === 'live' && isInningsStarted">
                                    <div class="text-lg font-bold text-yellow-300 mb-1">
                                        {{ getRequiredRunRate() }} RRR
                                    </div>
                                    <div class="text-sm text-gray-300">
                                        {{ getTarget() }} runs to win
                                    </div>
                                </div>

                                <!-- Toss completed but innings not started -->
                                <div v-else-if="match?.status === 'live' && match?.toss">
                                    <div class="text-sm text-yellow-300 font-medium toss-indicator">
                                        {{ tossInfo }}
                                    </div>
                                    <div class="text-xs text-gray-300 mt-1">
                                        {{ battingFirstTeam === 'team_a'
                                            ? match.team_a?.name
                                            : match.team_b?.name
                                        }} batting first
                                    </div>
                                </div>

                                <!-- Toss running -->
                                <div v-else-if="match?.status === 'live'">
                                    <div class="text-lg font-bold text-yellow-300">
                                        Toss Running
                                    </div>
                                </div>

                                <div v-else-if="match?.status === 'completed'">
                                    <div class="text-lg font-bold text-green-300">
                                        {{ getMatchResult() }}
                                    </div>
                                </div>

                                <div v-else>
                                    <div class="text-sm text-gray-300">
                                        {{ formatMatchDateTime(match?.date, match?.match_time) }}
                                    </div>
                                </div>

                                <div class="text-xs text-gray-400 mt-2">
                                    {{ match?.venue || 'Rajshahi' }}
                                </div>
                            </div>
                        </div>

                        <!-- Team B -->
                        <div class="w-full lg:w-4/12 px-4">
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
                            <span v-if="tab === 'Live' && match?.status === 'live'"
                                class="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block animate-pulse"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="min-h-screen">
        <div v-if="match">
            <MatchInfo v-if="activeTab === 'Match Info'" :tournament="match?.tournament ?? null" :match="match" />
            <LiveScore v-if="activeTab === 'Live'" :striker="striker" :nonStriker="nonStriker" :bowler="bowler" :currentOver="currentOver" :scoreboard="scoreboard" :probability="probability"/>
            <ScoreCard v-if="activeTab === 'Scorecard'" :match="match" :yetToBatList="yetToBatList" :scoreboard="match?.scoreboard"/>
        </div>
    </div>
</template>

<script setup>
import bgHome from './../../assets/bg/bg-home.png'
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMatchBySlug, fetchCricketMatchData } from './../api/matches'
import MatchInfo from '../includes/tabs/MatchInfo.vue'
import LiveScore from '../includes/tabs/LiveScore.vue'
import ScoreCard from '../includes/tabs/ScoreCard.vue'
import {
    getTeamAbbreviation,
    formatMatchDateTime,
    getMatchResult
} from './../../helpers/MatchHelper'
import echo from '../../plugins/echo'
import { useToast } from "vue-toastification";

const toast         = useToast();
const route         = useRoute();
const match         = ref({});
const battingTeam   = ref({});
const bowlingTeam   = ref({});
const scoreboard    = ref({});
const striker       = ref({});
const nonStriker    = ref({});
const bowler        = ref({});
const currentOver   = ref({});
const probability   = ref({});
const yetToBatList  = ref({});
const tabs          = ['Match Info', 'Live', 'Scorecard'];
const activeTab     = ref('Match Info');
const channel       = ref(null);
const match_id      = route.params.id;
const tossNotified  = ref(false);
const loadingLiveData = ref(false);

const isInningsStarted = computed(() => {
    if (!match.value || !currentInnings.value) return false;
    return (currentInnings.value.overs || 0) > 0;
});

const currentInnings = computed(() => {
    if (!match.value || !match.value.scoreboard || !Array.isArray(match.value.scoreboard)) return null;

    const running = match.value.scoreboard.find(i =>
        ['running', 'in_progress'].includes(i.status)
    );

    return running || null;
});

const battingFirstTeam = computed(() => {
    if (!match.value || !match.value.toss || !match.value.team_a || !match.value.team_b) return null;

    const tossDecision = match.value.toss.decision || match.value.toss.toss_decision;
    const tossWinnerId = match.value.toss.toss_winner_team_id;

    if (tossDecision === 'bat') {
        return match.value.team_a.id === tossWinnerId ? 'team_a' : 'team_b';
    } else {
        // If toss winner chose to bowl, the other team bats first
        return match.value.team_a.id === tossWinnerId ? 'team_b' : 'team_a';
    }
});

const bowlingFirstTeam = computed(() => {
    return battingFirstTeam.value === 'team_a' ? 'team_b' : 'team_a';
});

const tossInfo = computed(() => {
    if (!match.value || !match.value.toss || !match.value.team_a || !match.value.team_b) return null;

    const tossWinner = match.value.team_a.id === match.value.toss.toss_winner_team_id
        ? match.value.team_a.name
        : match.value.team_b.name;

    const tossDecision = match.value.toss.decision || match.value.toss.toss_decision;
    const decision = tossDecision === 'bat' ? 'batting' : 'bowling';

    return `${tossWinner} won the toss & chose to ${decision}`;
});

// Methods for dynamic data display
const getCurrentInningsScore = (teamType) => {
    if (!match.value || !currentInnings.value) return '0/0';

    const teamId = teamType === 'team_a' ? match.value.team_a?.id : match.value.team_b?.id;

    if (currentInnings.value.batting_team_id === teamId) {
        return `${currentInnings.value.runs || 0}/${currentInnings.value.wickets || 0}`;
    }
    return '0/0';
};

const getCurrentInningsOvers = (teamType) => {
    if (!match.value || !currentInnings.value) return '0.0';

    const teamId = teamType === 'team_a' ? match.value.team_a?.id : match.value.team_b?.id;

    if (currentInnings.value.batting_team_id === teamId) {
        return (currentInnings.value.overs || 0).toFixed(1);
    }
    return '0.0';
};

const getCurrentRunRate = (teamType) => {
    if (!match.value || !currentInnings.value) return '0.0';

    const teamId = teamType === 'team_a' ? match.value.team_a?.id : match.value.team_b?.id;

    if (currentInnings.value.batting_team_id === teamId && currentInnings.value.overs > 0) {
        return ((currentInnings.value.runs || 0) / currentInnings.value.overs).toFixed(2);
    }
    return '0.0';
};

const getTotalScore = (teamType) => {
    if (!match.value || !match.value.scoreboard || !Array.isArray(match.value.scoreboard)) return '0';

    const teamId = teamType === 'team_a' ? match.value.team_a?.id : match.value.team_b?.id;
    const teamInnings = match.value.scoreboard.filter(inning => inning.batting_team_id === teamId);

    if (teamInnings.length === 0) return '0';

    const lastInnings = teamInnings[teamInnings.length - 1];
    return `${lastInnings.runs || 0}/${lastInnings.wickets || 0}`;
};

const getRequiredRunRate = () => {
    if (!currentInnings.value || !match.value?.scoreboard || match.value.scoreboard.length < 2) return '0.0';

    const firstInnings = match.value.scoreboard[0];
    const target = (firstInnings.runs || 0) + 1;
    const currentRuns = currentInnings.value.runs || 0;
    const remainingRuns = target - currentRuns;
    const remainingOvers = 20 - (currentInnings.value.overs || 0);

    if (remainingRuns <= 0 || remainingOvers <= 0) return '0.0';

    return (remainingRuns / remainingOvers).toFixed(2);
};

const getTarget = () => {
    if (!match.value?.scoreboard || match.value.scoreboard.length < 2) return 0;

    const firstInnings = match.value.scoreboard[0];
    return (firstInnings.runs || 0) + 1;
};

const onImageError = (event, teamType) => {
    event.target.style.display = 'none';
};

const updateMatchData = async (tossData = null) => {
    if (!match.value?.id) return;
    
    let battingTeamId = null;
    let bowlingTeamId = null;

    if (tossData) {
        battingTeamId = tossData.batting_first_team_id;
        bowlingTeamId = tossData.bowling_first_team_id;
    } else if (match.value.toss) {
        // If toss exists, determine who is batting first based on toss
        const tossWinnerId = match.value.toss.toss_winner_team_id;
        const decision = match.value.toss.decision || match.value.toss.toss_decision;
        
        if (decision === 'bat') {
            battingTeamId = tossWinnerId === match.value.team_a_id ? match.value.team_a_id : match.value.team_b_id;
            bowlingTeamId = tossWinnerId === match.value.team_a_id ? match.value.team_b_id : match.value.team_a_id;
        } else {
            battingTeamId = tossWinnerId === match.value.team_a_id ? match.value.team_b_id : match.value.team_a_id;
            bowlingTeamId = tossWinnerId === match.value.team_a_id ? match.value.team_a_id : match.value.team_b_id;
        }
    } else if (currentInnings.value) {
        // Fallback to current innings
        battingTeamId = currentInnings.value.batting_team_id;
        bowlingTeamId = currentInnings.value.batting_team_id === match.value.team_a_id ? match.value.team_b_id : match.value.team_a_id;
    }

    if (!battingTeamId || !bowlingTeamId) return;

    loadingLiveData.value = true;
    try {
        const response = await fetchCricketMatchData({
            match_id: match.value.id,
            batting_team: battingTeamId,
            bowling_team: bowlingTeamId,
        });

        if(response.success){
            battingTeam.value = response.matchData.battingTeam;
            bowlingTeam.value = response.matchData.bowlingTeam;
            scoreboard.value  = response.matchData.scoreboard;
            striker.value     = response.matchData.striker;
            nonStriker.value  = response.matchData.nonStriker;
            bowler.value      = response.matchData.bowler;
            currentOver.value = response.matchData.currentOver;
            probability.value = response.matchData.probability;
            yetToBatList.value= response.matchData.yetToBatList;
        }
    } catch (error) {
        console.error('Error updating live match data:', error);
    } finally {
        loadingLiveData.value = false;
    }
}

const showTossNotification = (tossData) => {
    if (tossNotified.value) return;

    tossNotified.value = true;

    updateMatchData(tossData);

    const tossWinnerName =
        tossData.toss_winner_team_id === match.value.team_a?.id
            ? match.value.team_a?.name
            : match.value.team_b?.name;

    const decision =
        tossData.toss_decision === 'bat' ? 'batting' : 'bowling';

    toast.success(
        `${tossWinnerName} won the toss and chose ${decision} first!`,
        {
            position: "top-right",
            timeout: 5000,
        }
    );
};

const setupRealTimeListeners = () => {
    if (!window.Echo || !match.value?.id) {
        console.error('❌ Echo or match ID not available');
        return;
    }

    const channelName = `cricket-match.${match.value.id}`;

    if (channel.value) {
        window.Echo.leave(channelName);
        channel.value = null;
    }

    channel.value = window.Echo
        .channel(channelName)
        .listen('.toss-updated', (data) => {
            handleTossEvent(data);
            showTossNotification(data);
        })
        .listen('.match-updated', (data) => {
            handleMatchUpdate(data);
        });
};

const handleMatchUpdate = (data) => {
    if (!data) return;

    if (data.match) {
        match.value.status = data.match.status || match.value.status;
    }

    if (data.scoreboard) {
        // Sync with the general scoreboard ref used by LiveScore tab
        scoreboard.value = { ...scoreboard.value, ...data.scoreboard };

        // Also sync with the match object's scoreboard array (used by ScoreCard tab)
        if (Array.isArray(match.value?.scoreboard)) {
            const index = match.value.scoreboard.findIndex(i => i.id === data.scoreboard.id || i.innings === data.scoreboard.innings);
            if (index !== -1) {
                match.value.scoreboard[index] = { ...match.value.scoreboard[index], ...data.scoreboard };
            } else {
                match.value.scoreboard.push(data.scoreboard);
            }
        } else {
            match.value.scoreboard = [data.scoreboard];
        }
    }

    if (data.striker) striker.value = data.striker;
    if (data.nonStriker) nonStriker.value = data.nonStriker;
    if (data.currentBowler) bowler.value = data.currentBowler;
    if (data.currentOver) currentOver.value = data.currentOver;
    if (data.yetToBatList) yetToBatList.value = data.yetToBatList;
};

const handleTossEvent = (data) => {
    if (data.match) {
        match.value.status = data.match.status || match.value.status;
        match.value.toss = data.match.toss || data;
    }

    match.value.toss_winner_team_id = data.toss_winner_team_id;
    match.value.toss_decision = data.toss_decision;
    match.value.batting_first_team_id = data.batting_first_team_id;
    match.value.bowling_first_team_id = data.bowling_first_team_id;
};

const cleanupRealTimeListeners = () => {
    if (channel.value) {
        channel.value.unsubscribe();
        channel.value = null;
    }
};

onMounted(async () => {
    if (!match_id) {
        console.error('ID not found in route params')
        return
    }

    try {
        match.value = await fetchMatchBySlug(match_id);

        if (!match.value) {
            console.error('Match not found for id:', match_id)
            return;
        }

        if (match.value.status === 'live') {
            activeTab.value = 'Live';
            updateMatchData(); // Fetch live data on mount
        }

        setupRealTimeListeners();

    } catch (error) {
        console.error('Error fetching match:', error);
    }
});

watch(() => match.value?.id, (newId) => {
    if (newId) {
        setupRealTimeListeners();
    }
});

// Clean up on unmount
onUnmounted(() => {
    cleanupRealTimeListeners();
});

// Watch for match status changes
watch(() => match.value?.status, (newStatus) => {
    if (newStatus === 'live') {
        activeTab.value = 'Live';
    }

    console.log('HEADER STATE', {
        toss: match.value.toss,
        innings: match.value.innings,
        currentInnings: currentInnings.value,
        started: isInningsStarted.value
    });
});

</script>

<style scoped>
.bg-home {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #1a202c;
}

button {
    transition: all 0.2s ease;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.toss-indicator {
    animation: pulse 2s infinite;
}
</style>