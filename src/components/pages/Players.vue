<template>
    <!-- ==================== HERO: KEY STATS ==================== -->
    <section class="relative overflow-hidden" style="background-color: #0f172a; min-height: 280px;">
        <div class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
            :style="{ backgroundImage: `url(${bgHome})` }"></div>

        <div class="relative z-10 container mx-auto px-4 py-10" style="padding-top: 6rem;">

            <!-- Header row -->
            <div class="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div class="flex items-center gap-2 text-white text-xl font-bold">
                    <svg class="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor"
                        stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Key Stats
                </div>
                <!-- Slider nav -->
                <div v-if="!loading && !error && highestRankedPlayers.length > 0"
                    class="flex items-center gap-2">
                    <button @click="prevSlide" :disabled="currentSlide === 0"
                        class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button @click="nextSlide" :disabled="currentSlide >= totalSlides - 1"
                        class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="flex justify-center py-10">
                <div class="w-10 h-10 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin">
                </div>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="text-center py-10 text-red-400 text-sm">
                Failed to load key stats. Please try again later.
            </div>

            <!-- No data -->
            <div v-else-if="highestRankedPlayers.length === 0" class="text-center py-10 text-slate-400 text-sm">
                No key stats available yet.
            </div>

            <!-- Slider -->
            <div v-else class="overflow-hidden">
                <div class="flex transition-transform duration-300 ease-in-out"
                    :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                    <div v-for="(slide, slideIndex) in getSlides()" :key="slideIndex" class="w-full flex-shrink-0">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="player in slide" :key="player.category"
                                @click="goToPlayerProfile(player)"
                                class="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-400/50 transition-all duration-200 overflow-hidden cursor-pointer group">
                                <!-- Card top bar -->
                                <div
                                    class="flex items-center justify-between px-3 py-2 bg-white/5 text-xs font-semibold">
                                    <span class="text-yellow-400 uppercase tracking-wide truncate">{{
                                        player.category }}</span>
                                    <span class="text-slate-400 font-normal ml-2 flex-shrink-0">{{ player.unit
                                        }}</span>
                                </div>
                                <!-- Player row -->
                                <div class="flex items-center justify-between px-4 py-3 gap-3">
                                    <div class="flex items-center gap-3 min-w-0">
                                        <div
                                            class="w-11 h-11 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                                            <img :src="player.image || '/default-player.png'" :alt="player.name"
                                                class="w-full h-full object-cover"
                                                @error="$event.target.style.display = 'none'" />
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-white text-xs font-semibold m-0 leading-tight truncate">
                                                {{ player.name }}</p>
                                            <p class="text-slate-400 text-xs m-0 mt-0.5 truncate">{{ player.style
                                                }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right flex-shrink-0">
                                        <div class="text-yellow-300 text-2xl font-bold leading-none">{{ player.value
                                            }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slide indicators -->
                <div v-if="totalSlides > 1" class="flex justify-center mt-5 gap-1.5">
                    <button v-for="idx in totalSlides" :key="idx" @click="currentSlide = idx - 1"
                        class="h-1 rounded-full transition-all duration-300"
                        :class="currentSlide === idx - 1 ? 'bg-yellow-400 w-6' : 'bg-white/20 w-2'">
                    </button>
                </div>
            </div>

        </div>
    </section>

    <!-- ==================== MAIN: ALL PLAYERS ==================== -->
    <section class="bg-slate-50 py-10">
        <div class="container mx-auto px-4">

            <!-- Section heading + search -->
            <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
                <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 m-0">
                    <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                    All Players
                    <span v-if="!loading" class="text-xs font-normal text-slate-400">({{ filteredPlayers.length
                        }})</span>
                </h2>
                <!-- Search input -->
                <div class="relative w-full sm:w-64">
                    <input v-model="searchQuery" type="text" placeholder="Search by name, role or team…"
                        class="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition" />
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <!-- Filter chips -->
            <div class="flex flex-wrap gap-2 mb-6">

                <!-- Role filter -->
                <div class="relative">
                    <button @click="toggleDropdown('category')"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all"
                        :class="selectedCategory && selectedCategory !== 'All Categories'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'">
                        {{ selectedCategory && selectedCategory !== 'All Categories' ? selectedCategory : 'Role' }}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div v-if="showCategoryDropdown"
                        class="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-md z-20 py-1 overflow-hidden">
                        <div @click="selectCategory('All Categories')"
                            class="px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 cursor-pointer">All Roles
                        </div>
                        <div v-for="cat in filteredCategories" :key="cat" @click="selectCategory(cat)"
                            class="px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">{{ cat }}
                        </div>
                    </div>
                </div>

                <!-- Team filter -->
                <div class="relative">
                    <button @click="toggleDropdown('team')"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all"
                        :class="selectedTeam && selectedTeam !== 'All Teams'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'">
                        {{ selectedTeam && selectedTeam !== 'All Teams' ? selectedTeam : 'Team' }}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div v-if="showTeamDropdown"
                        class="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-md z-20 overflow-hidden">
                        <input v-model="teamSearch" type="text" placeholder="Search teams…"
                            class="w-full px-3 py-2 text-xs border-b border-slate-100 focus:outline-none" />
                        <div class="max-h-48 overflow-y-auto py-1">
                            <div @click="selectTeam('All Teams')"
                                class="px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 cursor-pointer">All Teams
                            </div>
                            <div v-for="team in filteredTeams" :key="team" @click="selectTeam(team)"
                                class="px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">{{ team }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tournament filter -->
                <div class="relative">
                    <button @click="toggleDropdown('tournament')"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all"
                        :class="selectedTournament && selectedTournament !== 'All Tournaments'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'">
                        {{ selectedTournament && selectedTournament !== 'All Tournaments' ? selectedTournament :
                            'Tournament' }}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div v-if="showTournamentDropdown"
                        class="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-md z-20 overflow-hidden">
                        <input v-model="tournamentSearch" type="text" placeholder="Search tournaments…"
                            class="w-full px-3 py-2 text-xs border-b border-slate-100 focus:outline-none" />
                        <div class="max-h-48 overflow-y-auto py-1">
                            <div @click="selectTournament('All Tournaments')"
                                class="px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 cursor-pointer">All
                                Tournaments</div>
                            <div v-for="tournament in filteredTournaments" :key="tournament.id"
                                @click="selectTournament(tournament)"
                                class="px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">{{
                                    tournament.name }}</div>
                        </div>
                    </div>
                </div>

                <!-- Clear all -->
                <button v-if="hasActiveFilters" @click="clearAllFilters"
                    class="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                </button>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading" class="space-y-2">
                <div v-for="i in 6" :key="i"
                    class="bg-white rounded-xl border border-slate-100 p-3 animate-pulse">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-full bg-slate-200 flex-shrink-0"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-3.5 bg-slate-200 rounded w-2/5"></div>
                            <div class="h-3 bg-slate-100 rounded w-1/3"></div>
                        </div>
                        <div class="h-4 bg-slate-100 rounded w-10"></div>
                        <div class="h-4 bg-slate-100 rounded w-14"></div>
                    </div>
                </div>
            </div>

            <!-- Error -->
            <div v-else-if="error"
                class="text-center py-8 text-red-500 text-sm bg-white rounded-xl border border-red-100">
                Failed to load players. Please try again later.
            </div>

            <!-- Empty -->
            <div v-else-if="filteredPlayers.length === 0"
                class="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-100">
                <p class="mb-3 text-sm">No players found matching your search.</p>
                <button v-if="hasActiveFilters" @click="clearAllFilters"
                    class="inline-block px-4 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition">
                    Clear filters
                </button>
            </div>

            <!-- Player list -->
            <div v-else class="space-y-2">
                <div v-for="player in paginatedPlayers" :key="player.id" @click="goToPlayerProfile(player)"
                    class="bg-white rounded-xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden cursor-pointer group">

                    <!-- Role color strip -->
                    <div class="h-0.5 w-full" :class="getRoleStrip(player.role)"></div>

                    <div class="flex items-center gap-3 px-4 py-3">
                        <!-- Avatar -->
                        <div
                            class="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <img v-if="player.user?.image" :src="player.user.image"
                                :alt="player.user?.full_name || player.name"
                                class="w-full h-full object-cover"
                                @error="$event.target.style.display = 'none'" />
                            <span v-else class="text-slate-500 font-bold text-sm">
                                {{ getInitials(player.user?.full_name || player.name) }}
                            </span>
                        </div>

                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <p
                                class="text-sm font-semibold text-slate-800 m-0 truncate leading-tight group-hover:text-red-600 transition-colors">
                                {{ player.user?.full_name || player.name }}
                            </p>
                            <div class="flex items-center gap-2 mt-1 flex-wrap">
                                <span v-if="player.role"
                                    class="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium capitalize">
                                    {{ player.role }}
                                </span>
                                <span v-if="player.teams?.[0]?.name" class="text-xs text-slate-400">
                                    {{ player.teams[0].name }}
                                </span>
                            </div>
                            <!-- Batting / bowling style badges -->
                            <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                                <span v-if="player.batting_style"
                                    class="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                                    🏏 {{ formatStyle(player.batting_style) }}
                                </span>
                                <span v-if="player.bowling_style"
                                    class="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-medium">
                                    🎳 {{ formatStyle(player.bowling_style) }}
                                </span>
                            </div>
                        </div>

                        <!-- Stats (right) -->
                        <div class="hidden sm:flex flex-col items-end gap-1 flex-shrink-0 text-right">
                            <span class="text-xs text-slate-500 font-semibold">
                                {{ player.stats?.total_runs || 0 }}
                                <span class="text-slate-400 font-normal">runs</span>
                            </span>
                            <span class="text-xs text-slate-500 font-semibold">
                                {{ player.stats?.wickets || 0 }}
                                <span class="text-slate-400 font-normal">wkts</span>
                            </span>
                            <span class="text-xs text-slate-400">
                                {{ player.stats?.matches_played || 0 }} mat
                            </span>
                        </div>

                        <!-- Chevron -->
                        <svg class="w-4 h-4 text-slate-300 group-hover:text-red-400 flex-shrink-0 transition-colors"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="!loading && filteredPlayers.length > itemsPerPage"
                class="flex items-center justify-between mt-6 pt-5 border-t border-slate-200 flex-wrap gap-3">
                <p class="text-xs text-slate-500 m-0">
                    Showing {{ startIndex + 1 }}–{{ Math.min(endIndex, filteredPlayers.length) }} of
                    {{ filteredPlayers.length }} players
                </p>
                <div class="flex items-center gap-2">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-4 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                        Previous
                    </button>
                    <span class="text-xs text-slate-500 font-medium px-2">
                        {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-4 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                        Next
                    </button>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import bgHome from './../../assets/bg/bg-home.png';
import { fetchPlayerList, fetchPlayerKeyStats } from './../api/players';
import { fetchTournaments } from './../api/tournaments';
import { fetchCompletedMatches } from './../api/matches';
import { useRouter } from 'vue-router';

const router = useRouter();

// ── State ──────────────────────────────────────────────────────────────────
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

const categories = ref(['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper', 'Captain']);
const tournaments = ref([]);
const matches = ref([]);

// ── Computed: filter options ───────────────────────────────────────────────
const filteredCategories = computed(() => {
    if (!categorySearch.value) return categories.value;
    return categories.value.filter(c =>
        c.toLowerCase().includes(categorySearch.value.toLowerCase())
    );
});

const filteredTournaments = computed(() => {
    if (!tournamentSearch.value) return tournaments.value;
    return tournaments.value.filter(t =>
        t.name.toLowerCase().includes(tournamentSearch.value.toLowerCase())
    );
});

const filteredMatches = computed(() => {
    if (!matchSearch.value) return matches.value;
    return matches.value.filter(m => {
        const a = m.team_a?.name || '';
        const b = m.team_b?.name || '';
        const q = matchSearch.value.toLowerCase();
        return a.toLowerCase().includes(q) || b.toLowerCase().includes(q);
    });
});

const uniqueTeams = computed(() => {
    const teams = new Set();
    playersList.value.forEach(p => {
        p.teams?.forEach(t => teams.add(t.name));
    });
    return Array.from(teams).sort();
});

const filteredTeams = computed(() => {
    if (!teamSearch.value) return uniqueTeams.value;
    return uniqueTeams.value.filter(t =>
        t.toLowerCase().includes(teamSearch.value.toLowerCase())
    );
});

const hasActiveFilters = computed(() =>
    !!(selectedCategory.value || selectedTournament.value ||
        selectedMatch.value || selectedTeam.value || searchQuery.value)
);

const filteredPlayers = computed(() => {
    let list = playersList.value;

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim();
        list = list.filter(p => {
            const name = p.user?.full_name || p.name || '';
            const role = p.role || '';
            const team = p.teams?.[0]?.name || '';
            return name.toLowerCase().includes(q) ||
                role.toLowerCase().includes(q) ||
                team.toLowerCase().includes(q);
        });
    }

    if (selectedCategory.value && selectedCategory.value !== 'All Categories') {
        list = list.filter(p =>
            p.role?.toLowerCase() === selectedCategory.value.toLowerCase()
        );
    }

    if (selectedTeam.value && selectedTeam.value !== 'All Teams') {
        list = list.filter(p =>
            p.teams?.some(t => t.name === selectedTeam.value)
        );
    }

    return list;
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);
const paginatedPlayers = computed(() =>
    filteredPlayers.value.slice(startIndex.value, endIndex.value)
);
const totalPages = computed(() =>
    Math.ceil(filteredPlayers.value.length / itemsPerPage)
);

// ── Helpers ────────────────────────────────────────────────────────────────
const formatStyle = (style) => {
    if (!style) return '';
    return style.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2);
};

const getRoleStrip = (role) => {
    const r = (role || '').toLowerCase();
    if (r.includes('batsman')) return 'bg-blue-400';
    if (r.includes('bowler')) return 'bg-amber-400';
    if (r.includes('all')) return 'bg-emerald-400';
    if (r.includes('wicket')) return 'bg-purple-400';
    return 'bg-slate-300';
};

// ── Navigation ─────────────────────────────────────────────────────────────
const goToPlayerProfile = (player) => {
    const slug = player.user?.slug || player.slug;
    if (slug) {
        router.push(`/players/${slug}`);
    }
};

// ── Dropdown logic ─────────────────────────────────────────────────────────
const toggleDropdown = (type) => {
    const wasOpen = {
        category: showCategoryDropdown.value,
        tournament: showTournamentDropdown.value,
        match: showMatchDropdown.value,
        team: showTeamDropdown.value,
    }[type];

    showCategoryDropdown.value = false;
    showTournamentDropdown.value = false;
    showMatchDropdown.value = false;
    showTeamDropdown.value = false;

    if (!wasOpen) {
        if (type === 'category') showCategoryDropdown.value = true;
        if (type === 'tournament') showTournamentDropdown.value = true;
        if (type === 'match') showMatchDropdown.value = true;
        if (type === 'team') showTeamDropdown.value = true;
    }
};

const selectCategory = (cat) => {
    selectedCategory.value = cat;
    showCategoryDropdown.value = false;
    categorySearch.value = '';
    currentPage.value = 1;
};

const selectTournament = (t) => {
    selectedTournament.value = t.name || t;
    showTournamentDropdown.value = false;
    tournamentSearch.value = '';
    currentPage.value = 1;
};

const selectMatch = (m) => {
    selectedMatch.value = typeof m === 'string' ? m : `${m.team_a?.name} vs ${m.team_b?.name}`;
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

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// Close dropdowns on outside click
const handleOutsideClick = () => {
    showCategoryDropdown.value = false;
    showTournamentDropdown.value = false;
    showMatchDropdown.value = false;
    showTeamDropdown.value = false;
};

// ── Key stats processing ───────────────────────────────────────────────────
const getUnitForCategory = (cat) => {
    const map = {
        'Most Runs': 'runs', 'Most Wickets': 'wkts', 'Best Strike Rate': 'SR',
        'Best Economy Rate': 'econ', 'Highest Batting Average': 'avg',
        'Best Bowling Average': 'avg', 'Most Fifties': '50s', 'Most Hundreds': '100s',
        'Most Sixes': '6s', 'Most Fours': '4s', 'Best Bowling Figure': 'wkts',
    };
    return map[cat] || '';
};

const getValueForCategory = (cat, stat) => {
    if (!stat) return 'N/A';
    switch (cat) {
        case 'Most Runs': return stat.total_runs || 0;
        case 'Most Wickets': return stat.total_wickets || 0;
        case 'Best Strike Rate':
            return (stat.balls_faced > 0 && stat.total_runs > 0)
                ? ((stat.total_runs / stat.balls_faced) * 100).toFixed(2) : '0.00';
        case 'Best Economy Rate':
            return (stat.overs_bowled > 0 && stat.total_runs_conceded > 0)
                ? (stat.total_runs_conceded / stat.overs_bowled).toFixed(2) : '0.00';
        case 'Highest Batting Average':
            return (stat.innings_batted > 0 && stat.total_runs > 0)
                ? (stat.total_runs / stat.innings_batted).toFixed(2) : '0.00';
        case 'Best Bowling Average':
            return (stat.wickets > 0 && stat.runs_conceded > 0)
                ? (stat.runs_conceded / stat.wickets).toFixed(2) : '0.00';
        case 'Most Fifties': return stat.fifties || 0;
        case 'Most Hundreds': return stat.hundreds || 0;
        case 'Most Sixes': return stat.sixes || 0;
        case 'Most Fours': return stat.fours || 0;
        case 'Best Bowling Figure': return `${stat.wickets || 0}/${stat.runs_conceded || 0}`;
        default: return 'N/A';
    }
};

const formatBattingStyle = (style) => {
    if (!style) return 'Batting';
    const s = style.toLowerCase().trim();
    if (s.includes('right')) return 'RHB';
    if (s.includes('left')) return 'LHB';
    return style.charAt(0).toUpperCase() + style.slice(1);
};

const formatBowlingStyle = (style) => {
    if (!style) return 'Bowling';
    const s = style.toLowerCase().trim();
    const map = { 'rf': 'RF', 'lf': 'LF', 'rmf': 'RMF', 'lmf': 'LMF', 'rm': 'RM', 'lm': 'LM', 'ob': 'OB', 'lb': 'LB', 'sla': 'SLA' };
    return map[s] || (style.charAt(0).toUpperCase() + style.slice(1));
};

const getPlayerStyleForCategory = (cat, playerInfo) => {
    if (!playerInfo) return '';
    const batting = ['Most Runs', 'Most Fifties', 'Most Hundreds', 'Best Strike Rate', 'Most Sixes', 'Most Fours', 'Highest Batting Average'];
    const bowling = ['Most Wickets', 'Best Bowling Average', 'Best Economy Rate', 'Best Bowling Figure'];
    if (batting.includes(cat)) return playerInfo.batting_style ? formatBattingStyle(playerInfo.batting_style) : 'Bat';
    if (bowling.includes(cat)) return playerInfo.bowling_style ? formatBowlingStyle(playerInfo.bowling_style) : 'Bowl';
    const b = playerInfo.batting_style ? formatBattingStyle(playerInfo.batting_style) : null;
    const bw = playerInfo.bowling_style ? formatBowlingStyle(playerInfo.bowling_style) : null;
    return [b, bw].filter(Boolean).join(' · ') || '';
};

const processKeyStats = (statsData) => {
    if (!statsData?.data) return [];
    const d = statsData.data;
    const cats = [
        { category: 'Most Runs', stat: d.most_runs },
        { category: 'Best Strike Rate', stat: d.bestStrikeRate },
        { category: 'Most Wickets', stat: d.most_wickets },
        { category: 'Best Economy Rate', stat: d.bestEconomyRate },
        { category: 'Highest Batting Average', stat: d.highest_batting_average },
        { category: 'Best Bowling Average', stat: d.best_bowling_average },
        { category: 'Most Fifties', stat: d.most_fifties },
        { category: 'Most Hundreds', stat: d.most_hundreds },
        { category: 'Most Sixes', stat: d.most_sixes },
        { category: 'Most Fours', stat: d.most_fours },
        { category: 'Best Bowling Figure', stat: d.best_bowling_figure },
    ];

    return cats.map(item => {
        if (!item.stat) return null;
        const p = item.stat.player || null;
        const value = getValueForCategory(item.category, item.stat);
        if (value === 'N/A') return null;
        return {
            category: item.category,
            name: p ? (p.user?.full_name || p.name || 'Unknown') : 'Unknown',
            style: getPlayerStyleForCategory(item.category, p),
            image: p ? (p.user?.image || p.image || '') : '',
            slug: p ? (p.user?.slug || p.slug || null) : null,
            value,
            unit: getUnitForCategory(item.category),
        };
    }).filter(Boolean);
};

// ── Slider ─────────────────────────────────────────────────────────────────
const itemsPerSlide = computed(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
});

const totalSlides = computed(() =>
    Math.ceil(highestRankedPlayers.value.length / itemsPerSlide.value)
);

const getSlides = () => {
    const slides = [];
    const items = highestRankedPlayers.value;
    for (let i = 0; i < items.length; i += itemsPerSlide.value) {
        slides.push(items.slice(i, i + itemsPerSlide.value));
    }
    return slides;
};

const nextSlide = () => { if (currentSlide.value < totalSlides.value - 1) currentSlide.value++; };
const prevSlide = () => { if (currentSlide.value > 0) currentSlide.value--; };

let autoSlideTimer = null;
const startAutoSlide = () => {
    if (totalSlides.value > 1) {
        autoSlideTimer = setInterval(() => {
            currentSlide.value = currentSlide.value >= totalSlides.value - 1
                ? 0 : currentSlide.value + 1;
        }, 5000);
    }
};

const handleResize = () => { currentSlide.value = 0; };

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleOutsideClick);

    try {
        loading.value = true;
        error.value = false;

        const [listResponse, statsResponse] = await Promise.all([
            fetchPlayerList(),
            fetchPlayerKeyStats(),
        ]);

        tournaments.value = await fetchTournaments() || [];
        matches.value = await fetchCompletedMatches() || [];

        playersList.value = Array.isArray(listResponse) ? listResponse : [];

        if (statsResponse?.success && statsResponse?.data) {
            highestRankedPlayers.value = processKeyStats(statsResponse);
        } else {
            highestRankedPlayers.value = [];
        }

        startAutoSlide();
    } catch (err) {
        error.value = true;
        console.error('Error fetching players:', err);
    } finally {
        loading.value = false;
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('click', handleOutsideClick);
    if (autoSlideTimer) clearInterval(autoSlideTimer);
});
</script>
