<template>
    <section id="home" class="bg-home bg-cover bg-center" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center py-24 pb-5" style="padding-top: 7rem;">
            <div class="container mx-auto px-4">
                <div class="mb-12">
                    <div class="flex flex-wrap -mx-4 items-center justify-between mb-6">
                        <div class="w-full lg:w-auto px-4">
                            <h5 class="text-white text-2xl font-bold flex items-center gap-2 m-0">
                                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9.75 6.75v10.5M14.25 6.75v10.5M4.5 8.25H19.5M6.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 17.25V6.75A2.25 2.25 0 016.75 4.5z" />
                                </svg>
                                Key Stats
                            </h5>
                        </div>

                        <!-- Navigation buttons for slider -->
                        <div v-if="highestRankedPlayers.length > 0 && !loading && !error"
                            class="w-full lg:w-auto px-4 mt-0 lg:mt-0 flex justify-center lg:justify-end space-x-2">
                            <button @click="prevSlide"
                                class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="currentSlide === 0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button @click="nextSlide"
                                class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="currentSlide >= totalSlides - 1">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="flex justify-center py-8">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="text-center py-8">
                        <p class="text-red-500">Failed to load key stats. Please try again later.</p>
                    </div>

                    <!-- No Data State -->
                    <div v-else-if="highestRankedPlayers.length === 0" class="text-center py-8">
                        <p class="text-gray-500">No key stats available.</p>
                    </div>

                    <!-- Data State with Slider -->
                    <div v-else class="relative overflow-hidden">
                        <!-- Slider Container -->
                        <div class="flex transition-transform duration-300 ease-in-out"
                            :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                            <!-- Slide -->
                            <div v-for="(slide, slideIndex) in getSlides()" :key="slideIndex"
                                class="w-full flex-shrink-0">
                                <div class="flex flex-wrap -mx-2">
                                    <div v-for="player in slide" :key="player.category"
                                        class="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                                        <div class="border rounded-lg shadow-sm p-4 bg-white h-full hover:shadow-md transition-shadow cursor-pointer"
                                            @click="goToPlayerProfile(player)">
                                            <!-- Category -->
                                            <div class="text-sm font-semibold text-gray-600 mb-3 truncate">
                                                {{ player.category }}
                                            </div>

                                            <!-- Player Info Row -->
                                            <div class="flex items-center justify-between">
                                                <!-- Left: Image + Name/Style -->
                                                <div class="flex items-center space-x-3 min-w-0">
                                                    <img :src="player.image || 'default-player.png'" :alt="player.name"
                                                        class="w-12 h-12 rounded-full object-cover border flex-shrink-0" />
                                                    <div class="min-w-0">
                                                        <div class="font-bold text-gray-900 truncate">{{ player.name }}
                                                        </div>
                                                        <div class="text-xs text-gray-500 truncate">{{ player.style }}
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Right: Value -->
                                                <div class="text-right flex-shrink-0">
                                                    <div class="text-2xl font-bold text-gray-800">{{ player.value }}
                                                    </div>
                                                    <div class="text-xs text-gray-500">{{ player.unit }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Slide Indicators -->
                        <div v-if="totalSlides > 1" class="flex justify-center mt-6 space-x-2">
                            <button v-for="index in totalSlides" :key="index" @click="currentSlide = index - 1"
                                class="w-2 h-2 rounded-full transition-all"
                                :class="currentSlide === index - 1 ? 'bg-white w-8' : 'bg-white/40'">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="bg-cover bg-center">
        <div class="flex items-center justify-center py-24 pb-5">
            <div class="container mx-auto px-4">
                <div v-if="playersList.length > 0 && !loading && !error" class="mt-12">
                    <div class="flex flex-wrap -mx-4 items-center justify-between mb-6">
                        <div class="w-full lg:w-auto px-4">
                            <h5 class="text-black text-2xl font-bold flex items-center gap-2">
                                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 19l-7-7 7-7m0 0l7 7-7 7" />
                                </svg>
                                All Players Stats
                            </h5>
                        </div>

                        <!-- Search Bar -->
                        <div class="w-full lg:w-auto px-4 mt-4 lg:mt-0">
                            <div class="relative">
                                <input v-model="searchQuery" type="text" placeholder="Search players..."
                                    class="w-full lg:w-64 px-4 py-2 pl-10 rounded-lg bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
                                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-500" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Filter Dropdowns -->
                    <div class="flex flex-wrap gap-4 mb-6 px-4">
                        <!-- Category Filter -->
                        <div class="relative">
                            <button @click="toggleDropdown('category')"
                                class="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50">
                                <span>{{ selectedCategory || 'Category' }}</span>
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="showCategoryDropdown"
                                class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                <input v-model="categorySearch" type="text" placeholder="Search categories..."
                                    class="w-full px-3 py-2 border-b border-gray-300 focus:outline-none" />
                                <div class="max-h-60 overflow-y-auto">
                                    <div @click="selectCategory('All Categories')"
                                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                        All Categories
                                    </div>
                                    <div v-for="category in filteredCategories" :key="category"
                                        @click="selectCategory(category)"
                                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                        {{ category }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tournament Filter -->
                        <div class="relative">
                            <button @click="toggleDropdown('tournament')"
                                class="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50">
                                <span>{{ selectedTournament || 'Tournament' }}</span>
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="showTournamentDropdown"
                                class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                <input v-model="tournamentSearch" type="text" placeholder="Search tournaments..."
                                    class="w-full px-3 py-2 border-b border-gray-300 focus:outline-none" />
                                <div class="max-h-60 overflow-y-auto">
                                    <div @click="selectTournament('All Tournaments')"
                                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                        All Tournaments
                                    </div>
                                    <div v-for="tournament in filteredTournaments" :key="tournament.id"
                                        @click="selectTournament(tournament)"
                                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                        {{ tournament.name }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Match Filter -->
                        <div class="relative">
                            <button @click="toggleDropdown('match')"
                                class="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50">
                                <span>{{ selectedMatch || 'Match' }}</span>
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="showMatchDropdown"
                                class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                <input v-model="matchSearch" type="text" placeholder="Search matches..."
                                    class="w-full px-3 py-2 border-b border-gray-300 focus:outline-none" />
                                <div class="max-h-60 overflow-y-auto">
                                    <div @click="selectMatch('All Matches')"
                                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                        All Matches
                                    </div>
                                    <div v-for="match in filteredMatches" :key="match.id" @click="selectMatch(match)"
                                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                        {{ match.team_a?.name }} vs {{ match.team_b?.name }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Team Filter -->
                        <div class="relative">
                            <button @click="toggleDropdown('team')"
                                class="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50">
                                <span>{{ selectedTeam || 'Team' }}</span>
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="showTeamDropdown"
                                class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                <input v-model="teamSearch" type="text" placeholder="Search teams..."
                                    class="w-full px-3 py-2 border-b border-gray-300 focus:outline-none" />
                                <div class="max-h-60 overflow-y-auto">
                                    <div @click="selectTeam('All Teams')"
                                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                        All Teams
                                    </div>
                                    <div v-for="team in filteredTeams" :key="team" @click="selectTeam(team)"
                                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                        {{ team }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Clear All Filters Button -->
                        <button v-if="hasActiveFilters" @click="clearAllFilters"
                            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                            Clear All Filters
                        </button>
                    </div>

                    <!-- Stats Table -->
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Player
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Matches
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Runs
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Avg
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SR
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            50s/100s
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Wickets
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bowl Avg
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Econ
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Catches
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Team
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="player in paginatedPlayers" :key="player.id"
                                        @click="goToPlayerProfile(player)"
                                        class="hover:bg-gray-50 cursor-pointer transition-colors">
                                        <!-- Player Column -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div class="flex-shrink-0 h-10 w-10">
                                                    <img :src="player.user?.image || 'default-player.png'"
                                                        :alt="player.user?.full_name || player.name"
                                                        class="h-10 w-10 rounded-full object-cover border border-gray-300" />
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">
                                                        {{ player.user?.full_name || player.name }}
                                                    </div>
                                                    <div class="text-sm text-gray-500">
                                                        <span v-if="player.role" class="mr-2">{{ player.role }}</span>
                                                        <span v-if="player.batting_style"
                                                            class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                            {{ formatStyle(player.batting_style) }}
                                                        </span>
                                                        <span v-if="player.bowling_style"
                                                            class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-1">
                                                            {{ formatStyle(player.bowling_style) }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Matches Played -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{{ player.stats?.matches_played || 0 }}
                                            </div>
                                        </td>

                                        <!-- Runs -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-semibold text-gray-900">
                                                {{ player.stats?.total_runs || 0 }}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {{ player.stats?.fours || 0 }} fours, {{ player.stats?.sixes || 0 }}
                                                sixes
                                            </div>
                                        </td>

                                        <!-- Batting Average -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {{ player.stats?.average ? player.stats.average.toFixed(2) : '0.00' }}
                                            </div>
                                        </td>

                                        <!-- Strike Rate -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {{ player.stats?.strike_rate ? player.stats.strike_rate.toFixed(2) :
                                                    '0.00' }}
                                            </div>
                                        </td>

                                        <!-- 50s/100s -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {{ player.stats?.fifties || 0 }}/{{ player.stats?.hundreds || 0 }}
                                            </div>
                                        </td>

                                        <!-- Wickets -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-semibold text-gray-900">
                                                {{ player.stats?.wickets || 0 }}
                                            </div>
                                        </td>

                                        <!-- Bowling Average -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {{ player.stats?.bowling_average ?
                                                    player.stats.bowling_average.toFixed(2) : '0.00' }}
                                            </div>
                                        </td>

                                        <!-- Economy Rate -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {{ player.stats?.economy_rate ? player.stats.economy_rate.toFixed(2) :
                                                    '0.00' }}
                                            </div>
                                        </td>

                                        <!-- Catches -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{{ player.stats?.catches || 0 }}</div>
                                        </td>

                                        <!-- Team -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div v-if="player.teams && player.teams.length > 0">
                                                    <div class="text-sm font-medium text-gray-900">
                                                        {{ player.teams[0].name }}
                                                    </div>
                                                    <div class="text-xs text-gray-500">
                                                        {{ player.teams[0].abbreviation ||
                                                            player.teams[0].name.substring(0, 3).toUpperCase() }}
                                                    </div>
                                                </div>
                                                <div v-else class="text-sm text-gray-500">No Team</div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- No players found -->
                        <div v-if="filteredPlayers.length === 0 && playersList.length > 0"
                            class="text-center py-12 bg-white">
                            <p class="text-gray-500">No players found matching your search criteria.</p>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div v-if="filteredPlayers.length > 0" class="flex justify-between items-center mt-8">
                        <div class="text-sm text-gray-700">
                            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredPlayers.length) }} of
                            {{ filteredPlayers.length }} players
                        </div>
                        <div class="flex items-center space-x-2">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <span class="text-gray-700 px-4">
                                Page {{ currentPage }} of {{ totalPages }}
                            </span>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import bgHome from './../../assets/bg/bg-home.png';
import { fetchPlayerList, fetchPlayerKeyStats } from './../api/players';
import { fetchTournaments } from './../api/tournaments';
import { fetchCompletedMatches } from './../api/matches';
import { useRouter } from 'vue-router';

const router = useRouter();

const playersList = ref([]);
const loading = ref(true);
const error = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const currentSlide = ref(0);
const highestRankedPlayers = ref([]);

const showCategoryDropdown = ref(false);
const showTournamentDropdown = ref(false);
const showMatchDropdown = ref(false);
const showTeamDropdown = ref(false);

const categorySearch = ref('');
const tournamentSearch = ref('');
const matchSearch = ref('');
const teamSearch = ref('');

const selectedCategory = ref('');
const selectedTournament = ref('');
const selectedMatch = ref('');
const selectedTeam = ref('');

const categories = ref([
    'Batsman',
    'Bowler',
    'All-rounder',
    'Wicket-keeper',
    'Captain'
]);

const tournaments = ref([]);
const matches = ref([]);

const filteredCategories = computed(() => {
    if (!categorySearch.value) return categories.value;
    return categories.value.filter(category =>
        category.toLowerCase().includes(categorySearch.value.toLowerCase())
    );
});

const filteredTournaments = computed(() => {
    if (!tournamentSearch.value) return tournaments.value;
    return tournaments.value.filter(tournament =>
        tournament.name.toLowerCase().includes(tournamentSearch.value.toLowerCase())
    );
});

const filteredMatches = computed(() => {
    if (!matchSearch.value) return matches.value;
    return matches.value.filter(match => {
        const teamA = match.team_a?.name || '';
        const teamB = match.team_b?.name || '';
        const searchTerm = matchSearch.value.toLowerCase();
        return teamA.toLowerCase().includes(searchTerm) ||
            teamB.toLowerCase().includes(searchTerm);
    });
});

const uniqueTeams = computed(() => {
    const teams = new Set();
    playersList.value.forEach(player => {
        if (player.teams && player.teams.length > 0) {
            player.teams.forEach(team => {
                teams.add(team.name);
            });
        }
    });
    return Array.from(teams).sort();
});

const filteredTeams = computed(() => {
    if (!teamSearch.value) return uniqueTeams.value;
    return uniqueTeams.value.filter(team =>
        team.toLowerCase().includes(teamSearch.value.toLowerCase())
    );
});

const hasActiveFilters = computed(() => {
    return selectedCategory.value || selectedTournament.value ||
        selectedMatch.value || selectedTeam.value || searchQuery.value;
});

const filteredPlayers = computed(() => {
    let filtered = playersList.value;

    // Apply search filter
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        filtered = filtered.filter(player => {
            const name = player.user?.full_name || player.name || '';
            const role = player.role || '';
            const teamName = player.teams && player.teams.length > 0 ? player.teams[0].name : '';

            return name.toLowerCase().includes(query) ||
                role.toLowerCase().includes(query) ||
                teamName.toLowerCase().includes(query);
        });
    }

    // Apply category filter (based on player role)
    if (selectedCategory.value && selectedCategory.value !== 'All Categories') {
        filtered = filtered.filter(player => {
            return player.role?.toLowerCase() === selectedCategory.value.toLowerCase();
        });
    }

    // Apply team filter
    if (selectedTeam.value && selectedTeam.value !== 'All Teams') {
        filtered = filtered.filter(player => {
            return player.teams && player.teams.some(team => team.name === selectedTeam.value);
        });
    }

    // Note: Tournament and Match filters would require additional data
    // You would need to fetch player stats per tournament/match

    return filtered;
});

const startIndex = computed(() => {
    return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
    return startIndex.value + itemsPerPage;
});

const paginatedPlayers = computed(() => {
    return filteredPlayers.value.slice(startIndex.value, endIndex.value);
});

const totalPages = computed(() => {
    return Math.ceil(filteredPlayers.value.length / itemsPerPage);
});

// Methods
const formatStyle = (style) => {
    if (!style) return '';
    return style
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Navigation
const goToPlayerProfile = (player) => {
    const playerSlug = player.user.slug;
    console.log("Player Slug: " + playerSlug);
    if (playerSlug) {
        router.push(`/players/${playerSlug}`);
    }
};

const toggleDropdown = (type) => {
    // Close all dropdowns first
    showCategoryDropdown.value = false;
    showTournamentDropdown.value = false;
    showMatchDropdown.value = false;
    showTeamDropdown.value = false;

    // Toggle the clicked dropdown
    switch (type) {
        case 'category':
            showCategoryDropdown.value = !showCategoryDropdown.value;
            break;
        case 'tournament':
            showTournamentDropdown.value = !showTournamentDropdown.value;
            break;
        case 'match':
            showMatchDropdown.value = !showMatchDropdown.value;
            break;
        case 'team':
            showTeamDropdown.value = !showTeamDropdown.value;
            break;
    }
};

const selectCategory = (category) => {
    selectedCategory.value = category;
    showCategoryDropdown.value = false;
    categorySearch.value = '';
    currentPage.value = 1;
};

const selectTournament = (tournament) => {
    selectedTournament.value = tournament.name || tournament;
    showTournamentDropdown.value = false;
    tournamentSearch.value = '';
    currentPage.value = 1;
};

const selectMatch = (match) => {
    if (typeof match === 'string') {
        selectedMatch.value = match;
    } else {
        selectedMatch.value = `${match.team_a?.name} vs ${match.team_b?.name}`;
    }
    showMatchDropdown.value = false;
    matchSearch.value = '';
    currentPage.value = 1;
};

const selectTeam = (team) => {
    selectedTeam.value = team;
    showTeamDropdown.value = false;
    teamSearch.value = '';
    currentPage.value = 1;
};

const clearAllFilters = () => {
    selectedCategory.value = '';
    selectedTournament.value = '';
    selectedMatch.value = '';
    selectedTeam.value = '';
    searchQuery.value = '';
    currentPage.value = 1;
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const closeAllDropdowns = () => {
    showCategoryDropdown.value = false;
    showTournamentDropdown.value = false;
    showMatchDropdown.value = false;
    showTeamDropdown.value = false;
};

const getUnitForCategory = (category) => {
    const units = {
        'Most Runs': 'runs',
        'Most Wickets': 'wkts',
        'Best Strike Rate': 'SR',
        'Best Economy Rate': 'econ',
        'Highest Batting Average': 'avg',
        'Best Bowling Average': 'avg',
        'Most Fifties': '50s',
        'Most Hundreds': '100s',
        'Most Sixes': '6s',
        'Most Fours': '4s',
        'Best Bowling Figure': 'wkts',
    };
    return units[category] || '';
};

const getValueForCategory = (category, stat) => {
    if (!stat) return 'N/A';

    switch (category) {
        case 'Most Runs':
            return stat.total_runs || 0;
        case 'Most Wickets':
            return stat.total_wickets || 0;
        case 'Best Strike Rate':
            if (stat.balls_faced > 0 && stat.total_runs > 0) {
                return ((stat.total_runs / stat.balls_faced) * 100).toFixed(2);
            }
            return '0.00';
        case 'Best Economy Rate':
            if (stat.overs_bowled > 0 && stat.total_runs_conceded > 0) {
                return (stat.total_runs_conceded / stat.overs_bowled).toFixed(2);
            }
            return '0.00';
        case 'Highest Batting Average':
            if (stat.innings_batted > 0 && stat.total_runs > 0) {
                return (stat.total_runs / stat.innings_batted).toFixed(2);
            }
            return '0.00';
        case 'Best Bowling Average':
            if (stat.wickets > 0 && stat.runs_conceded > 0) {
                return (stat.runs_conceded / stat.wickets).toFixed(2);
            }
            return '0.00';
        case 'Most Fifties':
            return stat.fifties || 0;
        case 'Most Hundreds':
            return stat.hundreds || 0;
        case 'Most Sixes':
            return stat.sixes || 0;
        case 'Most Fours':
            return stat.fours || 0;
        case 'Best Bowling Figure':
            return `${stat.wickets || 0}/${stat.runs_conceded || 0}`;
        default:
            return 'N/A';
    }
};

const getPlayerStyleForCategory = (category, playerInfo) => {
    if (!playerInfo) return 'Unknown';

    const battingCategories = [
        'Most Runs',
        'Most Fifties',
        'Most Hundreds',
        'Best Strike Rate',
        'Most Sixes',
        'Most Fours',
        'Highest Batting Average',
    ];

    const bowlingCategories = [
        'Most Wickets',
        'Best Bowling Average',
        'Best Economy Rate',
        'Best Bowling Figure',
    ];

    if (battingCategories.includes(category)) {
        if (playerInfo.batting_style) {
            return formatBattingStyle(playerInfo.batting_style);
        }
        return 'Batting';
    } else if (bowlingCategories.includes(category)) {
        if (playerInfo.bowling_style) {
            return formatBowlingStyle(playerInfo.bowling_style);
        }
        return 'Bowling';
    } else {
        const batting = playerInfo.batting_style ? formatBattingStyle(playerInfo.batting_style) : null;
        const bowling = playerInfo.bowling_style ? formatBowlingStyle(playerInfo.bowling_style) : null;

        if (batting && bowling) {
            return `${batting} | ${bowling}`;
        } else if (batting) {
            return batting;
        } else if (bowling) {
            return bowling;
        } else {
            return 'All-rounder';
        }
    }
};

const formatBattingStyle = (style) => {
    if (!style) return 'Batting';

    const styleLower = style.toLowerCase().trim();

    const styleMap = {
        'rhb': 'Right Hand Bat',
        'lhb': 'Left Hand Bat',
        'right': 'Right Hand Bat',
        'left': 'Left Hand Bat',
        'right-handed': 'Right Hand Bat',
        'left-handed': 'Left Hand Bat',
        'right hand': 'Right Hand Bat',
        'left hand': 'Left Hand Bat',
        'right-hand': 'Right Hand Bat',
        'left-hand': 'Left Hand Bat',
        'rh': 'Right Hand Bat',
        'lh': 'Left Hand Bat',
        'rt': 'Right Hand Bat',
        'lt': 'Left Hand Bat',
    };

    if (styleMap[styleLower]) {
        return styleMap[styleLower];
    }

    if (styleLower.includes('right') || styleLower.includes('rh')) {
        return 'Right Hand Bat';
    } else if (styleLower.includes('left') || styleLower.includes('lh')) {
        return 'Left Hand Bat';
    }

    return style
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const formatBowlingStyle = (style) => {
    if (!style) return 'Bowling';

    const styleLower = style.toLowerCase().trim();

    const styleMap = {
        'rf': 'Right Arm Fast',
        'lf': 'Left Arm Fast',
        'rmf': 'Right Arm Medium Fast',
        'lmf': 'Left Arm Medium Fast',
        'rm': 'Right Arm Medium',
        'lm': 'Left Arm Medium',
        'raf': 'Right Arm Fast',
        'laf': 'Left Arm Fast',
        'ramf': 'Right Arm Medium Fast',
        'lamf': 'Left Arm Medium Fast',
        'ram': 'Right Arm Medium',
        'lam': 'Left Arm Medium',
        'ob': 'Off Break',
        'lb': 'Leg Break',
        'sla': 'Slow Left Arm',
        'osa': 'Off Spin',
        'lsa': 'Leg Spin',
        'right-arm fast': 'Right Arm Fast',
        'left-arm fast': 'Left Arm Fast',
        'right-arm medium': 'Right Arm Medium',
        'left-arm medium': 'Left Arm Medium',
        'off break': 'Off Break',
        'leg break': 'Leg Break',
        'slow left-arm': 'Slow Left Arm',
    };

    if (styleMap[styleLower]) {
        return styleMap[styleLower];
    }

    if (styleLower.includes('right') && styleLower.includes('fast')) {
        return 'Right Arm Fast';
    } else if (styleLower.includes('left') && styleLower.includes('fast')) {
        return 'Left Arm Fast';
    } else if (styleLower.includes('right') && styleLower.includes('medium')) {
        return 'Right Arm Medium';
    } else if (styleLower.includes('left') && styleLower.includes('medium')) {
        return 'Left Arm Medium';
    } else if (styleLower.includes('off') && styleLower.includes('break')) {
        return 'Off Break';
    } else if (styleLower.includes('leg') && styleLower.includes('break')) {
        return 'Leg Break';
    } else if (styleLower.includes('slow') && styleLower.includes('left')) {
        return 'Slow Left Arm';
    } else if (styleLower.includes('right') && styleLower.includes('spin')) {
        return 'Right Arm Spin';
    } else if (styleLower.includes('left') && styleLower.includes('spin')) {
        return 'Left Arm Spin';
    }

    return style
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const processKeyStats = (statsData, players) => {
    if (!statsData || !statsData.data) return [];

    const {
        most_runs,
        most_wickets,
        bestStrikeRate,
        bestEconomyRate,
        highest_batting_average,
        best_bowling_average,
        most_fifties,
        most_hundreds,
        most_sixes,
        most_fours,
        best_bowling_figure
    } = statsData.data;

    const categories = [
        {
            category: 'Most Runs',
            stat: most_runs,
        },
        {
            category: 'Best Strike Rate',
            stat: bestStrikeRate,
        },
        {
            category: 'Most Wickets',
            stat: most_wickets,
        },
        {
            category: 'Best Economy Rate',
            stat: bestEconomyRate,
        },
        {
            category: 'Highest Batting Average',
            stat: highest_batting_average,
        },
        {
            category: 'Best Bowling Average',
            stat: best_bowling_average,
        },
        {
            category: 'Most Fifties',
            stat: most_fifties,
        },
        {
            category: 'Most Hundreds',
            stat: most_hundreds,
        },
        {
            category: 'Most Sixes',
            stat: most_sixes,
        },
        {
            category: 'Most Fours',
            stat: most_fours,
        },
        {
            category: 'Best Bowling Figure',
            stat: best_bowling_figure,
        }
    ];

    return categories.map(item => {
        if (!item.stat) {
            return {
                category: item.category,
                name: 'No Data',
                style: 'N/A',
                image: 'default-player.png',
                value: 'N/A',
                unit: getUnitForCategory(item.category)
            };
        }

        const playerInfo = item.stat.player || null;

        return {
            category: item.category,
            name: playerInfo ? (playerInfo.user?.full_name || playerInfo.name || 'Unknown Player') : 'Unknown Player',
            style: getPlayerStyleForCategory(item.category, playerInfo),
            image: playerInfo ? (playerInfo.user?.image || playerInfo.image || 'default-player.png') : 'default-player.png',
            value: getValueForCategory(item.category, item.stat),
            unit: getUnitForCategory(item.category)
        };
    }).filter(player => player.value !== 'N/A');
};

const itemsPerSlide = computed(() => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
});

const totalSlides = computed(() => {
    if (highestRankedPlayers.value.length === 0) return 0;
    return Math.ceil(highestRankedPlayers.value.length / itemsPerSlide.value);
});

const getSlides = () => {
    const slides = [];
    const items = highestRankedPlayers.value;

    for (let i = 0; i < items.length; i += itemsPerSlide.value) {
        slides.push(items.slice(i, i + itemsPerSlide.value));
    }

    return slides;
};

const nextSlide = () => {
    if (currentSlide.value < totalSlides.value - 1) {
        currentSlide.value++;
    }
};

const prevSlide = () => {
    if (currentSlide.value > 0) {
        currentSlide.value--;
    }
};

const startAutoSlide = () => {
    if (totalSlides.value > 1) {
        setInterval(() => {
            nextSlide();
            if (currentSlide.value >= totalSlides.value - 1) {
                currentSlide.value = 0;
            }
        }, 5000);
    }
};

onMounted(async () => {
    try {
        loading.value = true;
        error.value = false;

        const [listResponse, statsResponse] = await Promise.all([
            fetchPlayerList(),
            fetchPlayerKeyStats()
        ]);

        tournaments.value = await fetchTournaments();
        matches.value = await fetchCompletedMatches();

        if (listResponse && Array.isArray(listResponse)) {
            playersList.value = listResponse;
        } else {
            console.warn("No player list data or invalid format:", listResponse);
            playersList.value = [];
        }

        if (statsResponse && statsResponse.success && statsResponse.data) {
            highestRankedPlayers.value = processKeyStats(statsResponse, playersList.value);
        } else {
            console.warn("No key stats data or invalid format:", statsResponse);
            highestRankedPlayers.value = [];
        }

        startAutoSlide();

    } catch (err) {
        error.value = true;
        console.error('Error fetching data:', err);
    } finally {
        loading.value = false;
    }
});

const handleResize = () => {
    currentSlide.value = 0;
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
});
</script>

<style scoped>
.bg-home {
    min-height: 400px;
}

.slider-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.slider-container::-webkit-scrollbar {
    display: none;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from {
    transform: translateX(100%);
}

.slide-leave-to {
    transform: translateX(-100%);
}

@media (max-width: 640px) {
    .bg-home {
        min-height: 300px;
    }
}

img {
    object-fit: cover;
}
</style>