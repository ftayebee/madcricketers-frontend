<template>
    <!-- ==================== HERO ==================== -->
    <section class="relative overflow-hidden" style="background-color: #0f172a; min-height: 320px;">
        <!-- Background image as subtle texture -->
        <div class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
            :style="{ backgroundImage: `url(${bgHome})` }"></div>

        <div class="relative z-10 container mx-auto px-4 py-10" style="padding-top: 6rem;">

            <!-- Section Header -->
            <div class="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div class="flex items-center gap-3">
                    <span v-if="liveMatches.length > 0"
                        class="flex items-center gap-2 text-white text-xl font-bold">
                        <span class="w-3 h-3 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
                        Live Now
                    </span>
                    <span v-else class="flex items-center gap-2 text-white text-xl font-bold">
                        <svg class="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upcoming Fixtures
                    </span>
                </div>
                <router-link to="/fixtures"
                    class="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition flex items-center gap-1">
                    View all fixtures
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </router-link>
            </div>

            <!-- Loading -->
            <div v-if="heroLoading" class="flex justify-center py-12">
                <div class="w-10 h-10 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
            </div>

            <!-- Error -->
            <div v-else-if="heroError" class="text-center py-12 text-red-400 text-sm">
                Failed to load matches. Please try again later.
            </div>

            <!-- Empty -->
            <div v-else-if="heroMatches.length === 0" class="text-center py-12">
                <p class="text-slate-400 mb-4">No matches available right now.</p>
                <router-link to="/fixtures"
                    class="inline-block px-6 py-2 rounded-full bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold transition">
                    Browse All Fixtures
                </router-link>
            </div>

            <!-- Match Cards -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <router-link v-for="match in heroMatches.slice(0, 6)" :key="match.id"
                    :to="`/match/detail/${match.id}`" class="no-underline group">
                    <div :class="[
                        'rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer h-full',
                        match.status === 'live'
                            ? 'border-red-500/40 bg-white/5 hover:bg-white/10 hover:border-red-400'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-400/50'
                    ]">
                        <!-- Card top bar -->
                        <div :class="[
                            'flex items-center justify-between px-3 py-2 text-xs font-semibold',
                            match.status === 'live' ? 'bg-red-500/20' : 'bg-white/5'
                        ]">
                            <span v-if="match.status === 'live'"
                                class="flex items-center gap-1.5 text-red-400 uppercase tracking-wide">
                                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                Live
                            </span>
                            <span v-else class="text-yellow-400 uppercase tracking-wide">Upcoming</span>
                            <span class="text-slate-400 truncate max-w-[140px] font-normal text-right">
                                {{ match.tournament?.name || 'Cricket Match' }}
                            </span>
                        </div>

                        <!-- Teams & Score -->
                        <div class="px-4 py-3 flex items-center justify-between gap-2">
                            <!-- Team A -->
                            <div class="flex flex-col items-center text-center gap-1 flex-1">
                                <div
                                    class="w-11 h-11 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <img v-if="match.team_a?.logo && !match.team_a.logo.includes('team-dummy')"
                                        :src="match.team_a.logo" @error="hideImg($event)"
                                        class="w-full h-full object-cover" />
                                    <span v-else class="text-white font-bold text-sm">
                                        {{ abbr(match.team_a?.name) }}
                                    </span>
                                </div>
                                <p class="text-white text-xs font-semibold m-0 leading-tight max-w-[80px] break-words">
                                    {{ match.team_a?.name }}
                                </p>
                                <p v-if="match.team_a?.score"
                                    class="text-yellow-300 text-sm font-bold m-0 leading-none">
                                    {{ match.team_a.score }}
                                    <span v-if="match.team_a.overs" class="text-slate-400 text-xs font-normal block">
                                        {{ match.team_a.overs }} ov
                                    </span>
                                </p>
                            </div>

                            <!-- Divider -->
                            <div class="flex flex-col items-center flex-shrink-0">
                                <span v-if="match.status === 'live'" class="text-red-400 font-bold text-xs">VS</span>
                                <span v-else class="flex flex-col items-center gap-0.5 text-center">
                                    <span class="text-slate-500 text-xs">vs</span>
                                    <span class="text-yellow-400 text-xs font-semibold whitespace-nowrap">
                                        {{ match.match_time }}
                                    </span>
                                </span>
                            </div>

                            <!-- Team B -->
                            <div class="flex flex-col items-center text-center gap-1 flex-1">
                                <div
                                    class="w-11 h-11 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <img v-if="match.team_b?.logo && !match.team_b.logo.includes('team-dummy')"
                                        :src="match.team_b.logo" @error="hideImg($event)"
                                        class="w-full h-full object-cover" />
                                    <span v-else class="text-white font-bold text-sm">
                                        {{ abbr(match.team_b?.name) }}
                                    </span>
                                </div>
                                <p class="text-white text-xs font-semibold m-0 leading-tight max-w-[80px] break-words">
                                    {{ match.team_b?.name }}
                                </p>
                                <p v-if="match.team_b?.score"
                                    class="text-yellow-300 text-sm font-bold m-0 leading-none">
                                    {{ match.team_b.score }}
                                    <span v-if="match.team_b.overs" class="text-slate-400 text-xs font-normal block">
                                        {{ match.team_b.overs }} ov
                                    </span>
                                </p>
                            </div>
                        </div>

                        <!-- Card Footer -->
                        <div class="px-3 py-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 gap-2">
                            <span class="truncate">
                                <span v-if="match.venue">📍 {{ match.venue }}</span>
                            </span>
                            <span class="flex-shrink-0">{{ match.match_date }}</span>
                        </div>
                    </div>
                </router-link>
            </div>

            <!-- "Next Up" strip when live is showing but upcoming also exists -->
            <div v-if="liveMatches.length > 0 && upcomingMatches.length > 0"
                class="mt-6 pt-5 border-t border-white/10">
                <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Next Up</p>
                <div class="flex flex-wrap gap-2">
                    <router-link v-for="match in upcomingMatches.slice(0, 5)" :key="match.id"
                        :to="`/match/detail/${match.id}`"
                        class="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-yellow-400/40 rounded-lg px-3 py-2 transition no-underline">
                        <span class="text-white text-xs font-semibold">
                            {{ abbr(match.team_a?.name) }}
                            <span class="text-slate-400 font-normal mx-1">vs</span>
                            {{ abbr(match.team_b?.name) }}
                        </span>
                        <span class="text-yellow-400 text-xs">· {{ match.match_date }}</span>
                    </router-link>
                </div>
            </div>

        </div>
    </section>

    <!-- ==================== MAIN CONTENT ==================== -->
    <section class="bg-slate-50 py-10">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- Left: Recent Results -->
                <div class="lg:col-span-2">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 m-0">
                            <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                            Recent Results
                        </h2>
                        <router-link to="/fixtures"
                            class="text-sm text-red-600 hover:text-red-700 font-medium transition flex items-center gap-1">
                            View all
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </router-link>
                    </div>

                    <!-- Loading -->
                    <div v-if="completedLoading" class="space-y-2">
                        <div v-for="i in 4" :key="i"
                            class="bg-white rounded-xl border border-slate-100 p-4 animate-pulse">
                            <div class="flex justify-between items-center">
                                <div class="h-4 bg-slate-200 rounded w-1/3"></div>
                                <div class="h-4 bg-slate-200 rounded w-1/5"></div>
                                <div class="h-4 bg-slate-200 rounded w-1/3"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Error -->
                    <div v-else-if="completedError"
                        class="text-center py-8 text-red-500 text-sm bg-white rounded-xl border border-red-100">
                        Failed to load recent results.
                    </div>

                    <!-- Empty -->
                    <div v-else-if="completedMatches.length === 0"
                        class="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-100">
                        No recent results yet.
                    </div>

                    <!-- Match Rows -->
                    <div v-else class="space-y-2">
                        <MatchRow v-for="match in completedMatches.slice(0, 8)" :key="match.id" :match="match" />
                        <div v-if="completedMatches.length > 8" class="text-center pt-3">
                            <router-link to="/fixtures"
                                class="inline-block px-6 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition">
                                Load More Results
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Right: Tournaments -->
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 m-0">
                            <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                            Tournaments
                        </h2>
                        <router-link to="/tournaments"
                            class="text-sm text-red-600 hover:text-red-700 font-medium transition flex items-center gap-1">
                            View all
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </router-link>
                    </div>

                    <!-- Loading -->
                    <div v-if="tournamentsLoading" class="space-y-2">
                        <div v-for="i in 4" :key="i"
                            class="bg-white rounded-xl border border-slate-100 p-3 animate-pulse">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>
                                <div class="flex-1 space-y-1.5">
                                    <div class="h-3 bg-slate-200 rounded w-3/4"></div>
                                    <div class="h-3 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Error -->
                    <div v-else-if="tournamentsError"
                        class="text-center py-8 text-red-500 text-sm bg-white rounded-xl border border-red-100">
                        Failed to load tournaments.
                    </div>

                    <!-- Empty -->
                    <div v-else-if="tournaments.length === 0"
                        class="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-100">
                        No tournaments available.
                    </div>

                    <!-- Tournament Cards -->
                    <div v-else class="space-y-2">
                        <TournamentCard v-for="tournament in tournaments.slice(0, 6)" :key="tournament.id"
                            :tournament="tournament" />
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- ==================== BOARD MEMBERS ==================== -->
    <section v-if="boardMembers" class="bg-white py-8">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 m-0">
                    <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                    Board Members
                </h2>
            </div>
            <img :src="boardMembers" alt="Board Members"
                class="w-full h-auto object-cover rounded-xl shadow-sm border border-slate-100" />
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MatchRow from './includes/MatchRow.vue'
import TournamentCard from './includes/TournamentCard.vue'
import bgHome from './../assets/bg/bg-home.png'
import boardMembers from './../assets/images/board-members.jpg'
import { getTeamAbbreviation } from './../helpers/MatchHelper'
import { fetchLiveMatches, fetchUpcomingMatches, fetchCompletedMatches } from './api/matches'
import { fetchTournaments } from './api/tournaments'

// State
const liveMatches = ref([])
const upcomingMatches = ref([])
const completedMatches = ref([])
const tournaments = ref([])

const heroLoading = ref(true)
const heroError = ref(false)
const completedLoading = ref(true)
const completedError = ref(false)
const tournamentsLoading = ref(true)
const tournamentsError = ref(false)

// Hero shows live first, falls back to upcoming
const heroMatches = computed(() =>
    liveMatches.value.length > 0 ? liveMatches.value : upcomingMatches.value
)

// Helpers
const abbr = (name) => getTeamAbbreviation(name)
const hideImg = (e) => { e.target.style.display = 'none' }

// Data fetch
onMounted(async () => {
    // Hero: fetch live + upcoming in parallel
    try {
        const [live, upcoming] = await Promise.all([fetchLiveMatches(), fetchUpcomingMatches()])
        liveMatches.value = live
        upcomingMatches.value = upcoming
    } catch {
        heroError.value = true
    } finally {
        heroLoading.value = false
    }

    // Completed matches
    try {
        const data = await fetchCompletedMatches()
        completedMatches.value = (data || []).filter(m => m?.team_a && m?.team_b)
    } catch {
        completedError.value = true
    } finally {
        completedLoading.value = false
    }

    // Tournaments
    try {
        tournaments.value = await fetchTournaments() || []
    } catch {
        tournamentsError.value = true
    } finally {
        tournamentsLoading.value = false
    }
})
</script>
