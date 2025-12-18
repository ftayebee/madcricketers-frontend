<template>
    <section id="home" class="bg-home player-header bg-cover bg-center" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center py-24 pb-5" style="padding-bottom: 0rem; padding-top: 7rem;">
            <div class="container mx-auto px-4">
                <div class="mb-12">
                    <!-- Data State with Slider -->
                    <div class="relative overflow-hidden" v-if="playerData">
                        <header class="profile-header">
                            <div class="header-content">
                                <img :src="playerData.user?.image || 'default-player.png'"
                                    :alt="playerData.user?.full_name" class="player-avatar" />
                                <div class="player-vitals">
                                    <h1>{{ playerData.user?.full_name || 'Unknown Player' }}</h1>
                                    <p class="player-meta">
                                        {{ calculateAge(playerData.debut_date) }} •
                                        {{ playerData.country || 'Unknown' }} •
                                        {{ playerData.role || 'Player' }}
                                    </p>
                                </div>
                            </div>
                        </header>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="bg-center">
        <div class="flex items-center justify-center py-20 pb-5" style="padding-top: 0px;">
            <div class="container mx-auto px-4">
                <div class="player-profile">
                    <div v-if="loading" class="loading-container">
                        <div class="loading-spinner"></div>
                        <p>Loading player profile...</p>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="error-container">
                        <p class="error-message">{{ errorMessage }}</p>
                        <button @click="retryLoading" class="btn-retry">Retry</button>
                    </div>

                    <!-- Player Data -->
                    <div v-else-if="playerData" class="player-content">
                        <!-- Tab Navigation -->
                        <nav class="profile-tabs">
                            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                                :class="{ 'active': activeTab === tab.id }">
                                {{ tab.label }}
                            </button>
                        </nav>

                        <!-- Tab Content -->
                        <div class="tab-content">
                            <!-- Overview Tab -->
                            <section v-if="activeTab === 'overview'" class="overview-grid">
                                <div class="stat-card" v-for="stat in keyStats" :key="stat.label">
                                    <div class="stat-value">{{ stat.value }}</div>
                                    <div class="stat-label">{{ stat.label }}</div>
                                </div>
                                <div class="recent-form">
                                    <h3>Recent Form</h3>
                                    <div v-if="playerData.recent_matches && playerData.recent_matches.length > 0"
                                        class="form-chart">
                                        <div v-for="match in playerData.recent_matches.slice(0, 5)"
                                            :key="match.match_id" class="form-point"
                                            :class="getFormClass(match.performance)">
                                            <span class="form-value">
                                                {{ match.performance.runs_scored || 0 }}/{{
                                                    match.performance.wickets_taken || 0 }}
                                            </span>
                                        </div>
                                    </div>
                                    <p v-else class="no-data">No recent matches</p>
                                </div>
                            </section>

                            <!-- Career Stats Tab -->
                            <section v-if="activeTab === 'career'" class="career-stats">
                                <div class="format-filters">
                                    <button v-for="format in Object.keys(careerStatsByFormat)" :key="format"
                                        @click="selectedFormat = format"
                                        :class="{ 'active': selectedFormat === format }">
                                        {{ format.toUpperCase() }}
                                    </button>
                                </div>
                                <table class="stats-table">
                                    <thead>
                                        <tr>
                                            <th>Matches</th>
                                            <th>Runs</th>
                                            <th>Avg</th>
                                            <th>SR</th>
                                            <th>Wkts</th>
                                            <th>Bowl Avg</th>
                                            <th>Econ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="careerStatsByFormat[selectedFormat]">
                                            <td>{{ careerStatsByFormat[selectedFormat].matches || 0 }}</td>
                                            <td>{{ careerStatsByFormat[selectedFormat].runs || 0 }}</td>
                                            <td>{{ formatNumber(careerStatsByFormat[selectedFormat].average) }}</td>
                                            <td>{{ formatNumber(careerStatsByFormat[selectedFormat].strike_rate) }}</td>
                                            <td>{{ careerStatsByFormat[selectedFormat].wickets || 0 }}</td>
                                            <td>{{ formatNumber(careerStatsByFormat[selectedFormat].bowling_average) }}
                                            </td>
                                            <td>{{ formatNumber(careerStatsByFormat[selectedFormat].economy) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            <!-- Matches Tab -->
                            <section v-if="activeTab === 'matches'" class="matches-section">
                                <div class="matches-header">
                                    <h3>Recent Matches</h3>
                                    <select v-model="matchesFilter" class="matches-filter">
                                        <option value="all">All Matches</option>
                                        <option value="odi">ODI</option>
                                        <option value="t20">T20</option>
                                        <option value="test">Test</option>
                                    </select>
                                </div>
                                <ul class="match-list">
                                    <li v-for="match in filteredMatches" :key="match.match_id" class="match-item">
                                        <div class="match-info">
                                            <span class="match-teams">
                                                {{ match.teams?.team_a?.name || 'Team A' }} vs {{
                                                    match.teams?.team_b?.name || 'Team B' }}
                                            </span>
                                            <span class="match-date">{{ formatDate(match.match_date) }}</span>
                                        </div>
                                        <div class="match-performance">
                                            <span class="performance-runs" v-if="match.performance.runs_scored">
                                                {{ match.performance.runs_scored }} runs
                                            </span>
                                            <span class="performance-wickets" v-if="match.performance.wickets_taken">
                                                {{ match.performance.wickets_taken }} wkts
                                            </span>
                                            <span
                                                v-if="!match.performance.runs_scored && !match.performance.wickets_taken">
                                                Did not play
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                                <p v-if="filteredMatches.length === 0" class="no-matches">No matches found</p>
                            </section>

                            <!-- Player Info Tab -->
                            <section v-if="activeTab === 'info'" class="player-info-grid">
                                <div class="info-section">
                                    <h3>Personal Information</h3>
                                    <div class="info-item">
                                        <strong>Full Name:</strong>
                                        <span>{{ playerData.user?.full_name || 'N/A' }}</span>
                                    </div>
                                    <div class="info-item">
                                        <strong>Playing Role:</strong>
                                        <span>{{ playerData.role || 'N/A' }}</span>
                                    </div>
                                    <div class="info-item">
                                        <strong>Batting Style:</strong>
                                        <span>{{ formatStyle(playerData.batting_style) }}</span>
                                    </div>
                                    <div class="info-item">
                                        <strong>Bowling Style:</strong>
                                        <span>{{ formatStyle(playerData.bowling_style) }}</span>
                                    </div>
                                    <div class="info-item">
                                        <strong>Debut:</strong>
                                        <span>{{ playerData.debut_date ? formatDate(playerData.debut_date) : 'N/A'
                                        }}</span>
                                    </div>
                                    <div class="info-item">
                                        <strong>Teams:</strong>
                                        <span>{{ playerTeams }}</span>
                                    </div>
                                </div>

                                <div class="info-section" v-if="playerData.player_info?.bio">
                                    <h3>Biography</h3>
                                    <p class="player-bio">{{ playerData.player_info.bio }}</p>
                                </div>
                            </section>
                        </div>
                    </div>

                    <!-- Player Not Found -->
                    <div v-else class="not-found-container">
                        <p>Player not found</p>
                        <router-link to="/" class="btn-home">Back to Home</router-link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchPlayerDetail } from './../api/players';
import bgHome from './../../assets/bg/bg-home.png';

const route = useRoute();
const router = useRouter();
const playerSlug = route.params.slug;

// Reactive variables
const playerData = ref(null);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const activeTab = ref('overview');
const selectedFormat = ref('odi');
const matchesFilter = ref('all');
const isFollowing = ref(false);

const tabs = ref([
    { id: 'overview', label: 'Overview' },
    { id: 'career', label: 'Career Stats' },
    { id: 'matches', label: 'Matches' },
    { id: 'info', label: 'Player Info' }
]);

const teamPrimaryColor = computed(() => {
    return playerData.value?.teams?.[0]?.color_code || '#1e40af';
});

const playerTeamAbbreviation = computed(() => {
    return playerData.value?.teams?.[0]?.abbreviation || 'TEAM';
});

const playerTeams = computed(() => {
    if (!playerData.value?.teams?.length) return 'No teams';
    return playerData.value.teams.map(t => t.name).join(', ');
});

const keyStats = computed(() => {
    if (!playerData.value?.statistics) return [];

    return [
        { label: 'Matches', value: playerData.value.statistics.matches_played || 0 },
        { label: 'Total Runs', value: playerData.value.statistics.total_runs || 0 },
        { label: 'Batting Avg', value: formatNumber(playerData.value.statistics.average) },
        { label: 'Strike Rate', value: formatNumber(playerData.value.statistics.strike_rate) },
        { label: 'Total Wickets', value: playerData.value.statistics.wickets || 0 },
        { label: 'Bowling Avg', value: formatNumber(playerData.value.statistics.bowling_average) },
        { label: 'Economy', value: formatNumber(playerData.value.statistics.economy_rate) },
        { label: 'Catches', value: playerData.value.statistics.catches || 0 }
    ];
});

const careerStatsByFormat = computed(() => {
    return playerData.value?.career_stats_by_format || {
        odi: { matches: 0, runs: 0, average: 0, strike_rate: 0, wickets: 0, bowling_average: 0, economy: 0 },
        t20: { matches: 0, runs: 0, average: 0, strike_rate: 0, wickets: 0, bowling_average: 0, economy: 0 },
        test: { matches: 0, runs: 0, average: 0, strike_rate: 0, wickets: 0, bowling_average: 0, economy: 0 },
        ipl: { matches: 0, runs: 0, average: 0, strike_rate: 0, wickets: 0, bowling_average: 0, economy: 0 }
    };
});

const filteredMatches = computed(() => {
    if (!playerData.value?.recent_matches) return [];

    if (matchesFilter.value === 'all') {
        return playerData.value.recent_matches;
    }

    return playerData.value.recent_matches.filter(match => {
        return match.format === matchesFilter.value;
    });
});

const toggleFollow = () => {
    isFollowing.value = !isFollowing.value;
};

const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age + ' years';
};

const formatNumber = (num) => {
    if (num === null || num === undefined) return '0.00';
    return Number(num).toFixed(2);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatStyle = (style) => {
    if (!style) return 'N/A';
    return style.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getFormClass = (performance) => {
    const runs = performance.runs_scored || 0;
    const wickets = performance.wickets_taken || 0;

    if (runs >= 50 || wickets >= 3) return 'form-excellent';
    if (runs >= 30 || wickets >= 2) return 'form-good';
    if (runs >= 10 || wickets >= 1) return 'form-average';
    return 'form-poor';
};

const retryLoading = async () => {
    error.value = false;
    playerData.value = await fetchPlayerDetail(playerSlug);
};

onMounted(async () => {
    try {
        loading.value = true;
        console.log("Calling API...");
        const data = await fetchPlayerDetail(playerSlug);
        console.log("API returned:", data);

        if (data) {
            playerData.value = data;
            console.log("Data set successfully");
        } else {
            error.value = true;
            errorMessage.value = 'Player not found';
        }
    } catch (err) {
        console.error("Error:", err);
        error.value = true;
        errorMessage.value = err.message || 'Failed to load player';
    } finally {
        loading.value = false;
        console.log("Loading set to false");
    }
});

watch(() => route.params.slug, async (newSlug) => {
    if (newSlug) {
        loading.value = true;
        playerData.value = await fetchPlayerDetail(newSlug);
    }
});
</script>

<style scoped>
.player-header{
    background-color: #2f0b15;
}
.player-profile {
    min-height: 100vh;
}

/* Loading styles */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
}

.loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Error styles */
.error-container {
    text-align: center;
    padding: 4rem;
}

.error-message {
    color: #e74c3c;
    margin-bottom: 1rem;
}

.btn-retry {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

/* Not found styles */
.not-found-container {
    text-align: center;
    padding: 4rem;
}

.btn-home {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}

/* Profile header styles */
.profile-header {
    position: relative;
    color: white;
    padding: 2rem;
    overflow: hidden;
    min-height: 200px;
}

.header-background-pattern {
    position: absolute;
    opacity: 0.1;
    font-size: 15rem;
    font-weight: bold;
    right: 5%;
    bottom: -30%;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 2rem;
    position: relative;
    flex-wrap: wrap;
}

.player-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid white;
    background: #f0f0f0;
    object-fit: cover;
}

.player-vitals h1 {
    margin: 0;
    font-size: 2rem;
}

.player-meta {
    margin: 0.5rem 0;
    opacity: 0.9;
}

.btn-follow {
    background: white;
    color: #333;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 0.5rem;
}

/* Tab styles */
.profile-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    background: white;
    overflow-x: auto;
}

.profile-tabs button {
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
    cursor: pointer;
}

.profile-tabs button.active {
    border-bottom-color: #3b82f6;
    font-weight: bold;
    color: #3b82f6;
}

/* Tab content */
.tab-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

/* Overview grid */
.overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.stat-card {
    text-align: center;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background: white;
}

.stat-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
}

.stat-label {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
}

/* Recent form */
.recent-form {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    grid-column: 1 / -1;
}

.form-chart {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.form-point {
    flex: 1;
    padding: 1rem;
    text-align: center;
    border-radius: 4px;
    font-size: 0.9rem;
}

.form-excellent {
    background: #10b981;
    color: white;
}

.form-good {
    background: #3b82f6;
    color: white;
}

.form-average {
    background: #f59e0b;
    color: white;
}

.form-poor {
    background: #ef4444;
    color: white;
}

/* Career stats */
.career-stats {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
}

.format-filters {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.format-filters button {
    padding: 0.5rem 1rem;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    cursor: pointer;
}

.format-filters button.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.stats-table {
    width: 100%;
    border-collapse: collapse;
}

.stats-table th,
.stats-table td {
    padding: 0.75rem;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
}

.stats-table th {
    background: #f9fafb;
    font-weight: 600;
}

/* Matches section */
.matches-section {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
}

.matches-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.matches-filter {
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
}

.match-list {
    list-style: none;
    padding: 0;
}

.match-item {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.match-item:last-child {
    border-bottom: none;
}

.match-info {
    display: flex;
    flex-direction: column;
}

.match-teams {
    font-weight: 600;
}

.match-date {
    font-size: 0.9rem;
    color: #666;
}

.match-performance {
    display: flex;
    gap: 1rem;
}

.performance-runs,
.performance-wickets {
    padding: 0.25rem 0.5rem;
    background: #f3f4f6;
    border-radius: 4px;
    font-size: 0.9rem;
}

/* Player info */
.player-info-grid {
    display: grid;
    gap: 2rem;
}

.info-section {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
}

.info-item {
    margin-bottom: 1rem;
    display: flex;
}

.info-item strong {
    min-width: 150px;
    color: #666;
}

.player-bio {
    line-height: 1.6;
    color: #555;
}

/* No data messages */
.no-data,
.no-matches {
    color: #666;
    font-style: italic;
    text-align: center;
    padding: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        text-align: center;
    }

    .overview-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .profile-tabs {
        flex-wrap: wrap;
    }

    .profile-tabs button {
        flex: 1;
        min-width: 100px;
        text-align: center;
    }

    .match-item {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }

    .info-item {
        flex-direction: column;
    }

    .info-item strong {
        min-width: auto;
        margin-bottom: 0.25rem;
    }
}
</style>