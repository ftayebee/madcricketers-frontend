<template>
    <!-- Match Hero -->
    <section class="relative overflow-hidden" style="background-color: #0f172a;">
        <div class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
            :style="{ backgroundImage: `url(${bgHome})` }"></div>

        <div class="relative z-10 pt-20">
            <div class="container mx-auto px-4 max-w-2xl">

                <!-- Loading skeleton -->
                <div v-if="!match?.id" class="animate-pulse py-8">
                    <div class="flex items-center gap-3 mb-5">
                        <div class="h-5 bg-white/10 rounded-full w-16"></div>
                        <div class="h-4 bg-white/10 rounded w-36"></div>
                    </div>
                    <div class="grid grid-cols-3 gap-4 pb-6">
                        <div class="flex flex-col items-center gap-2">
                            <div class="w-14 h-14 rounded-full bg-white/10"></div>
                            <div class="h-3 bg-white/10 rounded w-16"></div>
                            <div class="h-6 bg-white/10 rounded w-14"></div>
                            <div class="h-3 bg-white/10 rounded w-8"></div>
                        </div>
                        <div class="flex items-center justify-center">
                            <div class="h-4 bg-white/10 rounded w-6"></div>
                        </div>
                        <div class="flex flex-col items-center gap-2">
                            <div class="w-14 h-14 rounded-full bg-white/10"></div>
                            <div class="h-3 bg-white/10 rounded w-16"></div>
                            <div class="h-6 bg-white/10 rounded w-14"></div>
                            <div class="h-3 bg-white/10 rounded w-8"></div>
                        </div>
                    </div>
                </div>

                <!-- Match loaded -->
                <template v-else>

                    <!-- Top meta: status + tournament + venue/date -->
                    <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 mb-6">
                        <div class="flex items-center gap-2 flex-wrap min-w-0">
                            <!-- Status badge -->
                            <span :class="['inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide flex-shrink-0',
                                match.status === 'live' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                    match.status === 'completed' ? 'bg-slate-500/20   text-slate-400   border-slate-500/30' :
                                        'bg-blue-500/20    text-blue-400    border-blue-500/30']">
                                <span v-if="match.status === 'live'"
                                    class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {{ match.status || 'Upcoming' }}
                            </span>
                            <!-- Tournament name -->
                            <span v-if="match.tournament?.name"
                                class="text-slate-400 text-xs truncate max-w-[180px] sm:max-w-none">
                                {{ match.tournament.name }}
                            </span>
                            <span v-if="match.stage" class="text-slate-600 text-xs hidden sm:inline">
                                · {{ match.stage }}
                            </span>
                        </div>
                        <!-- Venue + date -->
                        <div class="text-right text-xs leading-snug flex-shrink-0">
                            <p v-if="match.venue" class="text-slate-400 m-0">{{ match.venue }}</p>
                            <p class="text-slate-500 m-0">
                                <span v-if="match.match_date">{{ match.match_date }}</span>
                                <span v-if="match.match_time"> · {{ match.match_time }}</span>
                            </p>
                        </div>
                    </div>

                    <!-- Scoreboard: Team A | Center | Team B -->
                    <div class="grid grid-cols-3 items-center gap-2 sm:gap-6 pb-5">

                        <!-- ── Team A ── -->
                        <div class="flex flex-col items-center text-center gap-1.5">
                            <!-- Logo -->
                            <div class="w-13 h-13 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0"
                                style="width:52px;height:52px;">
                                <img v-if="match.team_a?.logo && !match.team_a.logo.includes('team-dummy')"
                                    :src="match.team_a.logo" @error="onImageError($event, 'team_a')"
                                    :alt="match.team_a?.name" class="w-full h-full object-cover" />
                                <span v-else class="text-white font-bold text-sm">
                                    {{ getTeamAbbreviation(match.team_a?.name) }}
                                </span>
                            </div>
                            <!-- Name -->
                            <p
                                class="text-white text-xs sm:text-sm font-semibold m-0 leading-tight line-clamp-2 w-full px-1">
                                {{ match.team_a?.name }}
                            </p>
                            <!-- Score -->
                            <template v-if="teamScoreDisplay('team_a')">
                                <p :class="['font-extrabold m-0 leading-none text-xl sm:text-2xl',
                                    match.winning_team === match.team_a?.name ? 'text-emerald-400' : 'text-white']">
                                    {{ teamScoreDisplay('team_a').score }}
                                </p>
                                <p class="text-slate-400 text-xs m-0">({{ teamScoreDisplay('team_a').overs }} ov)</p>
                            </template>
                            <p v-else class="text-slate-500 text-xs m-0 italic">Yet to bat</p>
                        </div>

                        <!-- ── Center column ── -->
                        <div class="flex flex-col items-center justify-center gap-1 text-center">
                            <span class="text-slate-600 text-xs font-bold uppercase tracking-widest">vs</span>

                            <!-- 2nd innings live: RRR + target -->
                            <template
                                v-if="match.status === 'live' && isInningsStarted && (match.scoreboard?.length ?? 0) >= 2">
                                <p class="text-yellow-400 text-base sm:text-lg font-extrabold m-0 leading-none">
                                    {{ getRequiredRunRate() }}
                                </p>
                                <p class="text-slate-500 text-xs m-0">RRR</p>
                                <div class="mt-1 px-2 py-0.5 rounded bg-white/10">
                                    <p class="text-slate-300 text-xs m-0">T: {{ getTarget() }}</p>
                                </div>
                            </template>

                            <!-- 1st innings live: CRR -->
                            <template v-else-if="match.status === 'live' && currentInnings">
                                <p class="text-slate-500 text-xs m-0">CRR</p>
                                <p class="text-white text-sm font-bold m-0">
                                    {{ getCurrentRunRate(currentInnings.batting_team_id === match.team_a?.id ? 'team_a'
                                        : 'team_b') }}
                                </p>
                            </template>

                            <!-- Live but no innings yet -->
                            <template v-else-if="match.status === 'live'">
                                <p class="text-yellow-400 text-xs m-0 font-medium">In Progress</p>
                            </template>

                            <!-- Upcoming: show time -->
                            <template v-else-if="match.status === 'upcoming'">
                                <p class="text-slate-400 text-xs m-0">{{ match.match_time || 'TBD' }}</p>
                            </template>
                        </div>

                        <!-- ── Team B ── -->
                        <div class="flex flex-col items-center text-center gap-1.5">
                            <!-- Logo -->
                            <div class="rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0"
                                style="width:52px;height:52px;">
                                <img v-if="match.team_b?.logo && !match.team_b.logo.includes('team-dummy')"
                                    :src="match.team_b.logo" @error="onImageError($event, 'team_b')"
                                    :alt="match.team_b?.name" class="w-full h-full object-cover" />
                                <span v-else class="text-white font-bold text-sm">
                                    {{ getTeamAbbreviation(match.team_b?.name) }}
                                </span>
                            </div>
                            <!-- Name -->
                            <p
                                class="text-white text-xs sm:text-sm font-semibold m-0 leading-tight line-clamp-2 w-full px-1">
                                {{ match.team_b?.name }}
                            </p>
                            <!-- Score -->
                            <template v-if="teamScoreDisplay('team_b')">
                                <p :class="['font-extrabold m-0 leading-none text-xl sm:text-2xl',
                                    match.winning_team === match.team_b?.name ? 'text-emerald-400' : 'text-white']">
                                    {{ teamScoreDisplay('team_b').score }}
                                </p>
                                <p class="text-slate-400 text-xs m-0">({{ teamScoreDisplay('team_b').overs }} ov)</p>
                            </template>
                            <p v-else class="text-slate-500 text-xs m-0 italic">Yet to bat</p>
                        </div>

                    </div>

                    <!-- Context strip: result / toss / target message -->
                    <div v-if="contextMessage"
                        class="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 mb-5 text-center">
                        <p class="text-sm m-0 font-medium"
                            :class="match.status === 'completed' ? 'text-emerald-400' : 'text-yellow-400'">
                            {{ contextMessage }}
                        </p>
                    </div>
                    <div v-else class="mb-5"></div>

                </template>

            </div>

            <!-- Tab bar: equal 3 cols, no scroll -->
            <div class="border-t border-white/10">
                <div class="container mx-auto px-4 max-w-2xl">
                    <div class="grid grid-cols-3">
                        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="['py-3 text-xs sm:text-sm font-semibold text-center transition border-b-2 flex items-center justify-center gap-1.5',
                            activeTab === tab
                                ? 'border-red-500 text-white bg-white/5'
                                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5']">
                            {{ tab }}
                            <span v-if="tab === 'Live' && match?.status === 'live'"
                                class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block flex-shrink-0"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="min-h-screen">
        <div v-if="match?.id">
            <MatchInfo v-if="activeTab === 'Match Info'" :tournament="match?.tournament ?? null" :match="match" />
            <LiveScore v-if="activeTab === 'Live'" :striker="striker" :nonStriker="nonStriker" :bowler="bowler"
                :currentOver="currentOver" :scoreboard="scoreboard" :probability="probability" />
            <ScoreCard v-if="activeTab === 'Scorecard'" :match="match" :yetToBatList="yetToBatList"
                :scoreboard="match?.scoreboard" />
        </div>
    </div>
</template>

<script setup>
import bgHome from './../../assets/bg/bg-home.png'
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMatchBySlug, fetchCricketMatchData, fetchYetToBat } from './../api/matches'
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

const toast = useToast();
const route = useRoute();
const match = ref({});
const battingTeam = ref({});
const bowlingTeam = ref({});
const scoreboard = ref({});
const striker = ref({});
const nonStriker = ref({});
const bowler = ref({});
const currentOver = ref({});
const probability = ref({});
const yetToBatList = ref({});
const tabs = ['Match Info', 'Live', 'Scorecard'];
const activeTab = ref('Match Info');
const channel = ref(null);
const match_id = route.params.id;
const tossNotified = ref(false);
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
        return match.value.team_a.id === tossWinnerId ? 'team_b' : 'team_a';
    }
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

// Unified score display helper — works for any match state
const teamScoreDisplay = (teamType) => {
    if (!match.value) return null;
    const teamId = teamType === 'team_a' ? match.value.team_a?.id : match.value.team_b?.id;
    const sb = match.value.scoreboard;
    if (!sb || !Array.isArray(sb) || !teamId) return null;

    // Currently batting?
    if (currentInnings.value?.batting_team_id === teamId) {
        return {
            score: `${currentInnings.value.runs ?? 0}/${currentInnings.value.wickets ?? 0}`,
            overs: Number(currentInnings.value.overs ?? 0).toFixed(1),
        };
    }

    // Has batted before (completed innings)?
    const teamInnings = sb.filter(i => i.batting_team_id === teamId);
    if (!teamInnings.length) return null; // Yet to bat

    const last = teamInnings[teamInnings.length - 1];
    return {
        score: `${last.runs ?? 0}/${last.wickets ?? 0}`,
        overs: Number(last.overs ?? 0).toFixed(1),
    };
};

// Context strip message below scores
const contextMessage = computed(() => {
    if (!match.value) return null;

    if (match.value.status === 'completed') {
        return match.value.result_summary || null;
    }

    if (match.value.status === 'live') {
        if (!match.value.toss) return 'Toss Running';
        if (isInningsStarted.value && (match.value.scoreboard?.length ?? 0) >= 2) {
            const target = getTarget();
            const rrr = getRequiredRunRate();
            const currentRuns = currentInnings.value?.runs ?? 0;
            const remaining = target - currentRuns;
            return `Need ${remaining} more runs · RRR: ${rrr}`;
        }
        return tossInfo.value;
    }

    return null;
});

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

const onImageError = (event) => {
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

        if (response.success) {
            battingTeam.value = response.matchData.battingTeam;
            bowlingTeam.value = response.matchData.bowlingTeam;
            scoreboard.value = response.matchData.scoreboard;
            striker.value = response.matchData.striker;
            nonStriker.value = response.matchData.nonStriker;
            bowler.value = response.matchData.bowler;
            currentOver.value = response.matchData.currentOver;
            probability.value = response.matchData.probability;
            yetToBatList.value = response.matchData.yetToBatList;
        }
    } catch (err) {
        console.error('Error updating live match data:', err);
    } finally {
        loadingLiveData.value = false;
    }
};

const showTossNotification = (tossData) => {
    if (tossNotified.value) return;
    tossNotified.value = true;
    updateMatchData(tossData);

    const tossWinnerName = tossData.toss_winner_team_id === match.value.team_a?.id
        ? match.value.team_a?.name
        : match.value.team_b?.name;
    const decision = tossData.toss_decision === 'bat' ? 'batting' : 'bowling';

    toast.success(`${tossWinnerName} won the toss and chose ${decision} first!`, {
        position: "top-right",
        timeout: 5000,
    });
};

const setupRealTimeListeners = () => {
    if (!window.Echo || !match.value?.id) return;

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
        scoreboard.value = { ...scoreboard.value, ...data.scoreboard };
        if (Array.isArray(match.value?.scoreboard)) {
            const index = match.value.scoreboard.findIndex(
                i => i.id === data.scoreboard.id || i.innings === data.scoreboard.innings
            );
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
    if (!match_id) return;

    try {
        match.value = await fetchMatchBySlug(match_id);
        if (!match.value) return;

        if (match.value.status === 'live') {
            activeTab.value = 'Live';
            updateMatchData();
        } else {
            const yetToBatRes = await fetchYetToBat(match.value.id);
            if (yetToBatRes?.success) {
                yetToBatList.value = yetToBatRes.players;
            }
        }

        setupRealTimeListeners();
    } catch (err) {
        console.error('Error fetching match:', err);
    }
});

watch(() => match.value?.id, (newId) => {
    if (newId) setupRealTimeListeners();
});

onUnmounted(() => {
    cleanupRealTimeListeners();
});

watch(() => match.value?.status, (newStatus) => {
    if (newStatus === 'live') {
        activeTab.value = 'Live';
    }
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.toss-indicator {
    animation: pulse 2s infinite;
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
</style>
