<template>
    <section id="home" class="relative overflow-hidden" style="background-color: #0f172a; min-height: 280px;">
        <div class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
            :style="{ backgroundImage: `url(${bgHome})` }"></div>
        <div class="relative z-10 flex items-start pt-24 pb-5">
            <div class="container mx-auto px-4">
                <div class="mb-12">
                    <div class="flex flex-wrap -mx-4 items-center justify-between mb-6">
                        <div class="w-full lg:w-auto px-4">
                            <h5 class="text-white text-2xl font-bold flex items-center gap-2 m-0">
                                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Live Matches
                            </h5>
                        </div>

                        <!-- Navigation buttons for slider -->
                        <div v-if="liveMatches.length > 0 && !loading && !error"
                            class="w-full lg:w-auto px-4 mt-0 lg:mt-0 flex justify-center lg:justify-end space-x-2">
                            <button @click="prevLiveSlide"
                                class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="currentLiveSlide === 0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button @click="nextLiveSlide"
                                class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="currentLiveSlide >= liveTotalSlides - 1">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="flex justify-center py-8">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="text-center py-8">
                        <p class="text-red-400">Failed to load matches. Please try again later.</p>
                    </div>

                    <!-- No Data State -->
                    <div v-else-if="liveMatches.length === 0" class="text-center py-8">
                        <p class="text-gray-300">No live matches currently.</p>
                    </div>

                    <!-- Live Matches Slider -->
                    <div v-else class="relative overflow-hidden">
                        <!-- Slider Container -->
                        <div class="flex transition-transform duration-300 ease-in-out"
                            :style="{ transform: `translateX(-${currentLiveSlide * 100}%)` }">
                            <!-- Slide -->
                            <div v-for="(slide, slideIndex) in getLiveSlides()" :key="slideIndex"
                                class="w-full flex-shrink-0">
                                <div class="flex flex-wrap -mx-2">
                                    <div v-for="match in slide" :key="match.id"
                                        class="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                                        <div class="border border-red-300 rounded-lg shadow-lg p-4 bg-gradient-to-r from-black-900/20 to-red-800/10 h-full hover:shadow-xl transition-all cursor-pointer"
                                            @click="goToMatchDetail(match)">
                                            <!-- Live Indicator -->
                                            <div class="flex items-center justify-between mb-3">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                                    <span class="text-sm font-semibold text-red-400">LIVE</span>
                                                </div>
                                                <div
                                                    class="text-xs font-medium text-gray-300 bg-green-900 px-2 py-1 rounded">
                                                    {{ match.tournament?.name || match.tournament || 'T20 Match' }}
                                                </div>
                                            </div>

                                            <!-- Teams and Score -->
                                            <div class="space-y-4">
                                                <!-- Team 1 -->
                                                <div class="flex items-center justify-between">
                                                    <div class="flex items-center gap-3">
                                                        <div
                                                            class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                                            <span class="font-bold text-white">{{
                                                                getTeamAbbreviation(match.team_a?.name) }}</span>
                                                        </div>
                                                        <div>
                                                            <div class="font-bold text-white">{{ match.team_a?.name }}</div>
                                                            <div v-if="match.team_a?.score" class="text-sm text-gray-300">
                                                                {{ match.team_a.score }}
                                                                <span v-if="match.team_a?.overs">({{ Number(match.team_a.overs).toFixed(1) }})</span>
                                                            </div>
                                                            <div v-else class="text-sm text-gray-400">Yet to bat</div>
                                                        </div>
                                                    </div>
                                                    <div class="text-right">
                                                        <div class="text-xl font-bold text-white">{{ match.team_a?.score || '—' }}</div>
                                                    </div>
                                                </div>

                                                <!-- VS Separator -->
                                                <div class="flex items-center justify-center">
                                                    <div
                                                        class="text-xs font-medium text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                                                        VS</div>
                                                </div>

                                                <!-- Team 2 -->
                                                <div class="flex items-center justify-between">
                                                    <div class="flex items-center gap-3">
                                                        <div
                                                            class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                                            <span class="font-bold text-white">{{
                                                                getTeamAbbreviation(match.team_b?.name) }}</span>
                                                        </div>
                                                        <div>
                                                            <div class="font-bold text-white">{{ match.team_b?.name }}</div>
                                                            <div v-if="match.team_b?.score" class="text-sm text-gray-300">
                                                                {{ match.team_b.score }}
                                                                <span v-if="match.team_b?.overs">({{ Number(match.team_b.overs).toFixed(1) }})</span>
                                                            </div>
                                                            <div v-else class="text-sm text-gray-400">Yet to bat</div>
                                                        </div>
                                                    </div>
                                                    <div class="text-right">
                                                        <div class="text-xl font-bold text-white">{{ match.team_b?.score || '—' }}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Match Info -->
                                            <div class="mt-4 pt-3 border-t border-gray-700/50">
                                                <div class="flex items-center justify-between text-xs text-gray-400">
                                                    <div class="flex items-center gap-1">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                            viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{{ match.venue || 'TBD' }}</span>
                                                    </div>
                                                    <div class="flex items-center gap-1">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                            viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{{ match.match_time || 'In Progress' }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Slide Indicators -->
                        <div v-if="liveTotalSlides > 1" class="flex justify-center mt-6 space-x-2">
                            <button v-for="index in liveTotalSlides" :key="index" @click="currentLiveSlide = index - 1"
                                class="w-2 h-2 rounded-full transition-all"
                                :class="currentLiveSlide === index - 1 ? 'bg-white w-8' : 'bg-white/40'">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="bg-slate-50 min-h-screen py-8">
        <div class="container mx-auto px-4 max-w-4xl">
                <!-- Tabs Navigation -->
                <div class="flex gap-2 mb-6 flex-wrap">
                    <button v-for="tab in tabs" :key="tab.id" @click="setActiveTab(tab.id)"
                        :disabled="tab.id === 'completed' && completedMatches.length === 0"
                        :class="['px-4 py-1.5 text-xs font-semibold rounded-full border transition',
                            activeTab === tab.id
                                ? 'bg-red-600 text-white border-red-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-red-300',
                            tab.id === 'completed' && completedMatches.length === 0 ? 'opacity-50 cursor-not-allowed' : '']">
                        {{ tab.label }}
                        <span v-if="tab.id === 'upcoming' && upcomingMatches.length > 0" class="ml-1 opacity-70">
                            ({{ upcomingMatches.length }})
                        </span>
                        <span v-if="tab.id === 'completed' && completedMatches.length > 0" class="ml-1 opacity-70">
                            ({{ completedMatches.length }})
                        </span>
                    </button>
                </div>

                <!-- Tab Content -->
                <div class="tab-content">
                    <!-- Upcoming Matches Tab -->
                    <div v-if="activeTab === 'upcoming'">
                        <div v-if="upcomingMatches.length > 0 && !loading && !error">
                            <div class="flex flex-wrap -mx-4 items-center justify-between mb-6">
                                <div class="w-full lg:w-auto px-4">
                                    <h5 class="text-black text-2xl font-bold flex items-center gap-2">
                                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor"
                                            stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Upcoming Matches
                                    </h5>
                                </div>

                                <!-- Filter for Upcoming Matches -->
                                <div class="w-full lg:w-auto px-4 mt-4 lg:mt-0">
                                    <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <!-- Tournament Filter -->
                                        <div class="relative w-full md:w-auto">
                                            <button @click="toggleUpcomingFilter('tournament')"
                                                class="flex items-center justify-between w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50">
                                                <span class="truncate">{{ upcomingSelectedTournament || 'Tournament'
                                                    }}</span>
                                                <svg class="w-4 h-4 ml-2 flex-shrink-0" fill="none"
                                                    stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div v-if="showUpcomingTournamentFilter"
                                                class="absolute top-full left-0 mt-1 w-full md:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                                <div @click="selectUpcomingTournament('All Tournaments')"
                                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                                    All Tournaments
                                                </div>
                                                <div v-for="tournament in upcomingTournaments" :key="tournament"
                                                    @click="selectUpcomingTournament(tournament)"
                                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer truncate">
                                                    {{ tournament }}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Date Filter -->
                                        <div class="relative w-full md:w-auto">
                                            <button @click="toggleUpcomingFilter('date')"
                                                class="flex items-center justify-between w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50">
                                                <span class="truncate">{{ upcomingSelectedDate || 'Date' }}</span>
                                                <svg class="w-4 h-4 ml-2 flex-shrink-0" fill="none"
                                                    stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div v-if="showUpcomingDateFilter"
                                                class="absolute top-full left-0 mt-1 w-full md:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                                <div @click="selectUpcomingDate('All Dates')"
                                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                                    All Dates
                                                </div>
                                                <div v-for="date in upcomingDates" :key="date"
                                                    @click="selectUpcomingDate(date)"
                                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer truncate">
                                                    {{ date }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Upcoming Matches Grid -->
                            <div class="grid grid-cols-1 gap-6">
                                <MatchRow v-for="match in displayedUpcomingMatches" :key="match.id" :match="match" />
                            </div>

                            <!-- Load More Button -->
                            <div v-if="filteredUpcomingMatches.length > upcomingItemsPerPage && upcomingMatchesToShow < filteredUpcomingMatches.length"
                                class="text-center mt-8">
                                <button @click="loadMoreUpcomingMatches" class="px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors font-medium flex items-center gap-2 mx-auto" style="border-radius: 200px;">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Load More ({{ filteredUpcomingMatches.length - upcomingMatchesToShow }} matches)
                                </button>
                            </div>

                            <!-- Show All Loaded Message -->
                            <div v-if="upcomingMatchesToShow >= filteredUpcomingMatches.length && filteredUpcomingMatches.length > 0"
                                class="text-center mt-8">
                                <p class="text-gray-500">
                                    Showing all {{ filteredUpcomingMatches.length }} upcoming matches
                                </p>
                            </div>

                            <!-- No matches found -->
                            <div v-if="filteredUpcomingMatches.length === 0"
                                class="text-center py-12 bg-white rounded-xl shadow-lg">
                                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="text-gray-500">No upcoming matches found with the selected filters.</p>
                            </div>
                        </div>

                        <!-- No upcoming matches at all -->
                        <div v-else-if="!loading && !error && upcomingMatches.length === 0" class="text-center py-16">
                            <div class="inline-block p-8 bg-blue-50 rounded-full mb-4">
                                <svg class="w-16 h-16 text-blue-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-700 mb-2">No Upcoming Matches</h3>
                            <p class="text-gray-500">There are no upcoming matches scheduled at the moment.</p>
                        </div>
                    </div>

                    <!-- Completed Matches Tab -->
                    <div v-if="activeTab === 'completed'">
                        <div v-if="completedMatches.length > 0 && !loading && !error">
                            <div class="flex flex-wrap -mx-4 items-center justify-between mb-6">
                                <div class="w-full lg:w-auto px-4">
                                    <h5 class="text-black text-2xl font-bold flex items-center gap-2">
                                        <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor"
                                            stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Recent Results
                                    </h5>
                                </div>

                                <!-- Search and Filters -->
                                <div class="w-full lg:w-auto px-4 mt-0 lg:mt-0">
                                    <div class="flex items-center gap-4">
                                        <!-- Search Bar -->
                                        <div class="relative">
                                            <input v-model="completedSearchQuery" type="text"
                                                placeholder="Search teams..."
                                                class="w-64 px-4 py-2 pl-10 rounded-lg bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent" />
                                            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-500" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>

                                        <!-- Tournament Filter -->
                                        <div class="relative">
                                            <button @click="toggleCompletedFilter('tournament')"
                                                class="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50">
                                                <span>{{ completedSelectedTournament || 'Tournament' }}</span>
                                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div v-if="showCompletedTournamentFilter"
                                                class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                                <div @click="selectCompletedTournament('All Tournaments')"
                                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                                    All Tournaments
                                                </div>
                                                <div v-for="tournament in completedTournaments" :key="tournament"
                                                    @click="selectCompletedTournament(tournament)"
                                                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer truncate">
                                                    {{ tournament }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Completed Matches Table -->
                            <div class="bg-white shadow-none overflow-hidden">
                                <div class="overflow-x-auto">
                                    <MatchRow v-for="match in displayedCompletedMatches" :key="match.id"
                                        :match="match" />
                                </div>

                                <!-- No matches found -->
                                <div v-if="filteredCompletedMatches.length === 0 && completedMatches.length > 0"
                                    class="text-center py-12 bg-white">
                                    <p class="text-gray-500">No matches found matching your search criteria.</p>
                                </div>
                            </div>

                            <!-- Load More Button for Completed Matches -->
                            <div v-if="filteredCompletedMatches.length > completedItemsPerPage && completedMatchesToShow < filteredCompletedMatches.length"
                                class="text-center mt-8">
                                <button @click="loadMoreCompletedMatches"
                                    class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center gap-2 mx-auto">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Load More ({{ filteredCompletedMatches.length - completedMatchesToShow }} matches)
                                </button>
                            </div>

                            <!-- Show All Loaded Message -->
                            <div v-if="completedMatchesToShow >= filteredCompletedMatches.length && filteredCompletedMatches.length > 0"
                                class="text-center mt-8">
                                <p class="text-gray-500">
                                    Showing all {{ filteredCompletedMatches.length }} completed matches
                                </p>
                            </div>
                        </div>

                        <!-- No completed matches at all -->
                        <div v-else-if="!loading && !error && completedMatches.length === 0" class="text-center py-16">
                            <div class="inline-block p-8 bg-green-50 rounded-full mb-4">
                                <svg class="w-16 h-16 text-green-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-700 mb-2">No Completed Matches</h3>
                            <p class="text-gray-500">There are no completed matches to display at the moment.</p>
                        </div>
                    </div>
                </div>

                <!-- No matches at all (for both tabs) -->
                <div v-if="!loading && !error && upcomingMatches.length === 0 && completedMatches.length === 0"
                    class="text-center py-16">
                    <div class="inline-block p-8 bg-gray-100 rounded-full mb-4">
                        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">No Matches Scheduled</h3>
                    <p class="text-gray-500">There are no matches scheduled at the moment. Check back later!</p>
                </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import MatchRow from './../includes/MatchRow.vue';
import { fetchCompletedMatches, fetchLiveMatches, fetchUpcomingMatches } from '../api/matches';
import { useRouter } from 'vue-router';
import { getTeamAbbreviation } from './../../helpers/MatchHelper'
import bgHome from './../../assets/bg/bg-home.png';

const router = useRouter();

// States
const loading = ref(false);
const error = ref(null);
const activeTab = ref('upcoming'); // Default to upcoming tab

// Tabs configuration
const tabs = ref([
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
]);

// Live Matches
const liveMatches = ref([]);
const currentLiveSlide = ref(0);
const itemsPerSlide = ref(3);

// Upcoming Matches
const upcomingMatches = ref([]);
const upcomingSelectedTournament = ref('All Tournaments');
const upcomingSelectedDate = ref('All Dates');
const showUpcomingTournamentFilter = ref(false);
const showUpcomingDateFilter = ref(false);
const upcomingMatchesToShow = ref(10); // Initially show 10 matches
const upcomingItemsPerPage = ref(10); // Load 10 more each time

// Completed Matches
const completedMatches = ref([]);
const completedSearchQuery = ref('');
const completedSelectedTournament = ref('All Tournaments');
const showCompletedTournamentFilter = ref(false);
const completedMatchesToShow = ref(10); // Initially show 10 matches
const completedItemsPerPage = ref(10); // Load 10 more each time

// Computed Properties
// Live Matches
const liveTotalSlides = computed(() => {
    return Math.ceil(liveMatches.value.length / itemsPerSlide.value);
});

// Upcoming Matches
const upcomingTournaments = computed(() => {
    const tournaments = new Set();
    upcomingMatches.value.forEach(match => {
        if (match.tournament) {
            const tournamentName = typeof match.tournament === 'object'
                ? match.tournament.name || match.tournament
                : match.tournament;
            if (tournamentName && tournamentName !== 'All Tournaments') {
                tournaments.add(tournamentName);
            }
        }
    });
    return Array.from(tournaments).sort();
});

const upcomingDates = computed(() => {
    const dates = new Set();
    upcomingMatches.value.forEach(match => {
        if (match.date) dates.add(formatMatchDate(match.date));
    });
    return Array.from(dates).sort((a, b) => {
        const dateA = new Date(a.split(', ').slice(1).join(', '));
        const dateB = new Date(b.split(', ').slice(1).join(', '));
        return dateA - dateB;
    });
});

// Sort upcoming matches by date (closest first)
const sortedUpcomingMatches = computed(() => {
    return [...upcomingMatches.value].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (dateA.getTime() === dateB.getTime()) {
            return (a.match_time || '').localeCompare(b.match_time || '');
        }

        return dateA - dateB;
    });
});

const filteredUpcomingMatches = computed(() => {
    let filtered = [...sortedUpcomingMatches.value];

    if (upcomingSelectedTournament.value !== 'All Tournaments') {
        filtered = filtered.filter(match => {
            const matchTournament = typeof match.tournament === 'object'
                ? match.tournament.name || match.tournament
                : match.tournament;
            return matchTournament === upcomingSelectedTournament.value;
        });
    }

    if (upcomingSelectedDate.value !== 'All Dates') {
        filtered = filtered.filter(match =>
            formatMatchDate(match.date) === upcomingSelectedDate.value
        );
    }

    return filtered;
});

const displayedUpcomingMatches = computed(() => {
    return filteredUpcomingMatches.value.slice(0, upcomingMatchesToShow.value);
});

// Completed Matches
const completedTournaments = computed(() => {
    const tournaments = new Set();
    completedMatches.value.forEach(match => {
        if (match.tournament) {
            const tournamentName = typeof match.tournament === 'object'
                ? match.tournament.name || match.tournament
                : match.tournament;
            if (tournamentName && tournamentName !== 'All Tournaments') {
                tournaments.add(tournamentName);
            }
        }
    });
    return Array.from(tournaments).sort();
});

// Sort completed matches by date (most recent first)
const sortedCompletedMatches = computed(() => {
    return [...completedMatches.value].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Most recent first
    });
});

const filteredCompletedMatches = computed(() => {
    let filtered = [...sortedCompletedMatches.value].filter(match =>
        match && match.team_a && match.team_b
    );

    if (completedSearchQuery.value) {
        const query = completedSearchQuery.value.toLowerCase();
        filtered = filtered.filter(match =>
        (match.team_a?.name?.toLowerCase().includes(query) ||
            match.team_b?.name?.toLowerCase().includes(query) ||
            (typeof match.tournament === 'string' ? match.tournament.toLowerCase() :
                match.tournament?.name?.toLowerCase() || '').includes(query) ||
            match.venue?.toLowerCase().includes(query))
        );
    }

    if (completedSelectedTournament.value !== 'All Tournaments') {
        filtered = filtered.filter(match => {
            const matchTournament = typeof match.tournament === 'object'
                ? match.tournament.name || match.tournament
                : match.tournament;
            return matchTournament === completedSelectedTournament.value;
        });
    }

    return filtered;
});

const displayedCompletedMatches = computed(() => {
    return filteredCompletedMatches.value.slice(0, completedMatchesToShow.value);
});

// Methods
// Tab Methods
const setActiveTab = (tabId) => {
    if (tabId === 'completed' && (completedMatches.value || []).length === 0) return;
    activeTab.value = tabId;
};

// Upcoming Matches
const toggleUpcomingFilter = (type) => {
    if (type === 'tournament') {
        showUpcomingTournamentFilter.value = !showUpcomingTournamentFilter.value;
        showUpcomingDateFilter.value = false;
    } else if (type === 'date') {
        showUpcomingDateFilter.value = !showUpcomingDateFilter.value;
        showUpcomingTournamentFilter.value = false;
    }
};

const selectUpcomingTournament = (tournament) => {
    upcomingSelectedTournament.value = tournament;
    showUpcomingTournamentFilter.value = false;
    upcomingMatchesToShow.value = 10;
};

const selectUpcomingDate = (date) => {
    upcomingSelectedDate.value = date;
    showUpcomingDateFilter.value = false;
    upcomingMatchesToShow.value = 10;
};

const loadMoreUpcomingMatches = () => {
    upcomingMatchesToShow.value += upcomingItemsPerPage.value;
};

// Completed Matches
const toggleCompletedFilter = (type) => {
    if (type === 'tournament') {
        showCompletedTournamentFilter.value = !showCompletedTournamentFilter.value;
    }
};

const selectCompletedTournament = (tournament) => {
    completedSelectedTournament.value = tournament;
    showCompletedTournamentFilter.value = false;
    completedMatchesToShow.value = 10;
};

const loadMoreCompletedMatches = () => {
    completedMatchesToShow.value += completedItemsPerPage.value;
};

// Live Matches Slider
const prevLiveSlide = () => {
    if (currentLiveSlide.value > 0) {
        currentLiveSlide.value--;
    }
};

const nextLiveSlide = () => {
    if (currentLiveSlide.value < liveTotalSlides.value - 1) {
        currentLiveSlide.value++;
    }
};

const getLiveSlides = () => {
    const slides = [];
    for (let i = 0; i < liveMatches.value.length; i += itemsPerSlide.value) {
        slides.push(liveMatches.value.slice(i, i + itemsPerSlide.value));
    }
    return slides;
};

const formatMatchDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
};

const goToMatchDetail = (match) => {
    router.push(`/match/detail/${match.id}`);
};

// Fetch Data
const fetchMatches = async () => {
    loading.value = true;
    error.value = null;

    try {
        const [liveData, upcomingData, completedData] = await Promise.all([
            fetchLiveMatches(),
            fetchUpcomingMatches(),
            fetchCompletedMatches()
        ]);

        liveMatches.value = liveData;
        upcomingMatches.value = upcomingData;
        completedMatches.value = completedData;

        // If no upcoming matches but there are completed matches, switch to completed tab
        if (upcomingMatches.value.length === 0 && completedMatches.value.length > 0) {
            activeTab.value = 'completed';
        }
    } catch (err) {
        error.value = 'Failed to load matches';
        console.error('Error fetching matches:', err);
    } finally {
        loading.value = false;
    }
};

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
    const tournamentDropdown = document.querySelector('.upcoming-tournament-dropdown');
    const dateDropdown = document.querySelector('.upcoming-date-dropdown');
    const completedDropdown = document.querySelector('.completed-tournament-dropdown');

    if (tournamentDropdown && !tournamentDropdown.contains(event.target)) {
        showUpcomingTournamentFilter.value = false;
    }

    if (dateDropdown && !dateDropdown.contains(event.target)) {
        showUpcomingDateFilter.value = false;
    }

    if (completedDropdown && !completedDropdown.contains(event.target)) {
        showCompletedTournamentFilter.value = false;
    }
};

// Lifecycle
onMounted(() => {
    fetchMatches();
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

// Watchers
watch([upcomingSelectedTournament, upcomingSelectedDate], () => {
    upcomingMatchesToShow.value = 10;
});

watch(completedSelectedTournament, () => {
    completedMatchesToShow.value = 10;
});

</script>

<style scoped>
.bg-overlay {
    background-color: #181818;
    background-blend-mode: overlay;
}

.bg-home {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* Ensure proper spacing for the top padding */
.py-24 {
    padding-top: 6rem;
    padding-bottom: 6rem;
}

/* Smooth transitions for hover effects */
.transition-all {
    transition: all 0.3s ease;
}

.transition-colors {
    transition: background-color 0.3s ease, color 0.3s ease;
}

.transition-shadow {
    transition: box-shadow 0.3s ease;
}

/* Custom scrollbar for dropdowns */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
}
</style>