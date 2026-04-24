<template>
    <!-- ==================== LOADING ==================== -->
    <div v-if="loading">
        <!-- Dark hero skeleton -->
        <div class="relative overflow-hidden" style="background-color: #0f172a; min-height: 220px;">
            <div class="container mx-auto px-4 py-10" style="padding-top: 6rem;">
                <div class="flex items-center gap-4">
                    <div class="w-20 h-20 rounded-full bg-white/10 animate-pulse flex-shrink-0"></div>
                    <div class="flex-1 space-y-3">
                        <div class="h-5 bg-white/10 rounded w-48 animate-pulse"></div>
                        <div class="h-4 bg-white/10 rounded w-64 animate-pulse"></div>
                        <div class="flex gap-2">
                            <div class="h-5 bg-white/10 rounded-full w-16 animate-pulse"></div>
                            <div class="h-5 bg-white/10 rounded-full w-20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Tab bar skeleton -->
        <div class="bg-white border-b border-slate-200 h-12"></div>
        <!-- Content skeleton -->
        <section class="bg-slate-50 py-8">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div v-for="i in 4" :key="i"
                        class="bg-white rounded-xl border border-slate-100 p-4 animate-pulse">
                        <div class="h-6 bg-slate-200 rounded w-2/3 mx-auto mb-2"></div>
                        <div class="h-3 bg-slate-100 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
                <div class="space-y-2">
                    <div v-for="i in 5" :key="i"
                        class="bg-white rounded-xl border border-slate-100 p-3 animate-pulse">
                        <div class="h-3.5 bg-slate-200 rounded w-1/3 mb-2"></div>
                        <div class="h-3 bg-slate-100 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- ==================== ERROR ==================== -->
    <div v-else-if="error" class="bg-slate-50 min-h-screen flex items-center justify-center"
        style="padding-top: 64px;">
        <div class="text-center px-4">
            <div
                class="text-center py-8 text-red-500 text-sm bg-white rounded-xl border border-red-100 px-8 max-w-sm mx-auto">
                <p class="mb-4">{{ errorMessage || 'Failed to load player profile.' }}</p>
                <div class="flex justify-center gap-3">
                    <button @click="retryLoading"
                        class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition">
                        Retry
                    </button>
                    <router-link to="/players"
                        class="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition no-underline">
                        All Players
                    </router-link>
                </div>
            </div>
        </div>
    </div>

    <!-- ==================== NOT FOUND ==================== -->
    <div v-else-if="!playerData" class="bg-slate-50 min-h-screen flex items-center justify-center"
        style="padding-top: 64px;">
        <div
            class="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-100 px-8 max-w-sm mx-auto">
            <p class="mb-4 text-sm">Player not found.</p>
            <router-link to="/players"
                class="inline-block px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition no-underline">
                Browse Players
            </router-link>
        </div>
    </div>

    <!-- ==================== PLAYER PROFILE ==================== -->
    <div v-else>

        <!-- HERO -->
        <section class="relative overflow-hidden" style="background-color: #0f172a;">
            <div class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
                :style="{ backgroundImage: `url(${bgHome})` }"></div>

            <div class="relative z-10 container mx-auto px-4 py-10" style="padding-top: 6rem;">

                <!-- Back link -->
                <div class="mb-5">
                    <router-link to="/players"
                        class="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium transition no-underline">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 19l-7-7 7-7" />
                        </svg>
                        All Players
                    </router-link>
                </div>

                <!-- Player card -->
                <div class="flex items-start gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">

                    <!-- Avatar -->
                    <div
                        class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0 border-2 border-white/20">
                        <img v-if="playerData.user?.image" :src="playerData.user.image"
                            :alt="playerData.user?.full_name"
                            class="w-full h-full object-cover"
                            @error="$event.target.style.display = 'none'" />
                        <span v-else class="text-white font-bold text-2xl">
                            {{ playerInitials }}
                        </span>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <!-- Team badge -->
                        <div v-if="playerData.teams?.[0]" class="mb-2">
                            <span
                                class="inline-flex items-center text-xs bg-white/10 border border-white/20 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
                                {{ playerData.teams[0].abbreviation || playerData.teams[0].name }}
                            </span>
                        </div>

                        <h1 class="text-white text-2xl sm:text-3xl font-bold m-0 leading-tight">
                            {{ playerData.user?.full_name || 'Unknown Player' }}
                        </h1>

                        <!-- Meta badges -->
                        <div class="flex items-center gap-2 mt-3 flex-wrap">
                            <span v-if="playerData.role"
                                class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold capitalize">
                                {{ playerData.role }}
                            </span>
                            <span v-if="playerData.batting_style"
                                class="text-xs bg-blue-500/20 border border-blue-400/30 text-blue-300 px-2 py-0.5 rounded font-medium">
                                🏏 {{ formatStyle(playerData.batting_style) }}
                            </span>
                            <span v-if="playerData.bowling_style"
                                class="text-xs bg-amber-500/20 border border-amber-400/30 text-amber-300 px-2 py-0.5 rounded font-medium">
                                🎳 {{ formatStyle(playerData.bowling_style) }}
                            </span>
                            <span v-if="playerData.debut_date"
                                class="text-xs text-slate-400 font-medium">
                                Age {{ calculateAge(playerData.debut_date) }}
                            </span>
                        </div>
                    </div>

                    <!-- Quick stats (desktop) -->
                    <div class="hidden sm:flex gap-3 flex-shrink-0">
                        <div
                            class="text-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 min-w-[72px]">
                            <div class="text-yellow-300 text-xl font-bold leading-none">{{
                                playerData.statistics?.matches_played || 0 }}</div>
                            <div class="text-slate-400 text-xs mt-1">Matches</div>
                        </div>
                        <div
                            class="text-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 min-w-[72px]">
                            <div class="text-yellow-300 text-xl font-bold leading-none">{{
                                playerData.statistics?.total_runs || 0 }}</div>
                            <div class="text-slate-400 text-xs mt-1">Runs</div>
                        </div>
                        <div
                            class="text-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 min-w-[72px]">
                            <div class="text-yellow-300 text-xl font-bold leading-none">{{
                                playerData.statistics?.wickets || 0 }}</div>
                            <div class="text-slate-400 text-xs mt-1">Wickets</div>
                        </div>
                    </div>
                </div>

                <!-- Mobile quick stats -->
                <div class="sm:hidden flex gap-4 mt-5 pt-4 border-t border-white/10">
                    <div class="text-center flex-1">
                        <div class="text-yellow-300 text-lg font-bold">{{ playerData.statistics?.matches_played ||
                            0 }}</div>
                        <div class="text-slate-400 text-xs mt-0.5">Matches</div>
                    </div>
                    <div class="text-center flex-1">
                        <div class="text-yellow-300 text-lg font-bold">{{ playerData.statistics?.total_runs || 0
                            }}</div>
                        <div class="text-slate-400 text-xs mt-0.5">Runs</div>
                    </div>
                    <div class="text-center flex-1">
                        <div class="text-yellow-300 text-lg font-bold">{{ playerData.statistics?.wickets || 0 }}
                        </div>
                        <div class="text-slate-400 text-xs mt-0.5">Wickets</div>
                    </div>
                    <div class="text-center flex-1">
                        <div class="text-yellow-300 text-lg font-bold">{{
                            formatNumber(playerData.statistics?.strike_rate) }}</div>
                        <div class="text-slate-400 text-xs mt-0.5">SR</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- STICKY TABS -->
        <nav class="sticky z-20 bg-white border-b border-slate-200 shadow-sm" style="top: 64px;">
            <div class="container mx-auto px-4">
                <div class="flex overflow-x-auto hide-scrollbar">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                        class="flex-shrink-0 px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors"
                        :class="activeTab === tab.id
                            ? 'border-red-600 text-red-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'">
                        {{ tab.label }}
                    </button>
                </div>
            </div>
        </nav>

        <!-- TAB CONTENT -->
        <section class="bg-slate-50 py-8">
            <div class="container mx-auto px-4">

                <!-- ── OVERVIEW ── -->
                <div v-if="activeTab === 'overview'">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <!-- Left: stats + career + recent form -->
                        <div class="lg:col-span-2 space-y-5">

                            <!-- 8 stat cards -->
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div v-for="stat in keyStats" :key="stat.label"
                                    class="bg-white rounded-xl border border-slate-100 p-4 text-center">
                                    <div class="text-xl font-bold text-slate-800">{{ stat.value }}</div>
                                    <div class="text-xs text-slate-400 mt-1">{{ stat.label }}</div>
                                </div>
                            </div>

                            <!-- Career Stats -->
                            <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                    <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2 m-0">
                                        <span class="w-1 h-4 rounded bg-red-500 inline-block"></span>
                                        Career Stats
                                    </h3>
                                    <!-- Format pills -->
                                    <div class="flex gap-1 flex-wrap">
                                        <button v-for="(_, fmt) in careerStatsByFormat" :key="fmt"
                                            @click="selectedFormat = fmt"
                                            class="px-3 py-1 text-xs font-semibold rounded-full border transition-all"
                                            :class="selectedFormat === fmt
                                                ? 'bg-red-600 text-white border-red-600'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'">
                                            {{ fmt.toUpperCase() }}
                                        </button>
                                    </div>
                                </div>
                                <div v-if="Object.keys(careerStatsByFormat).length" class="overflow-x-auto">
                                    <table class="w-full text-sm">
                                        <thead>
                                            <tr class="border-b border-slate-100 bg-slate-50">
                                                <th
                                                    class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Format</th>
                                                <th
                                                    class="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Mat</th>
                                                <th
                                                    class="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Runs</th>
                                                <th
                                                    class="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Avg</th>
                                                <th
                                                    class="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    SR</th>
                                                <th
                                                    class="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Wkts</th>
                                                <th
                                                    class="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Econ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(stats, fmt) in careerStatsByFormat" :key="fmt"
                                                class="border-b border-slate-50 last:border-0 transition-colors"
                                                :class="selectedFormat === fmt ? 'bg-red-50' : 'hover:bg-slate-50'">
                                                <td class="px-4 py-2.5 text-xs font-bold text-slate-700">{{
                                                    fmt.toUpperCase() }}</td>
                                                <td class="px-4 py-2.5 text-center text-xs text-slate-600">{{
                                                    stats.matches || 0 }}</td>
                                                <td
                                                    class="px-4 py-2.5 text-center text-xs font-semibold text-slate-800">
                                                    {{ stats.runs || 0 }}</td>
                                                <td class="px-4 py-2.5 text-center text-xs text-slate-600">{{
                                                    formatNumber(stats.average) }}</td>
                                                <td class="px-4 py-2.5 text-center text-xs text-slate-600">{{
                                                    formatNumber(stats.strike_rate) }}</td>
                                                <td
                                                    class="px-4 py-2.5 text-center text-xs font-semibold text-slate-800">
                                                    {{ stats.wickets || 0 }}</td>
                                                <td class="px-4 py-2.5 text-center text-xs text-slate-600">{{
                                                    formatNumber(stats.economy) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div v-else class="text-center py-8 text-slate-400 text-sm">
                                    No career stats available.
                                </div>
                            </div>

                            <!-- Recent Form -->
                            <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                                <div class="px-4 py-3 border-b border-slate-100">
                                    <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2 m-0">
                                        <span class="w-1 h-4 rounded bg-red-500 inline-block"></span>
                                        Recent Form
                                    </h3>
                                </div>
                                <div class="px-4 py-4">
                                    <div v-if="playerData.recent_matches?.length" class="flex flex-wrap gap-2">
                                        <div v-for="(match, idx) in playerData.recent_matches.slice(0, 5)"
                                            :key="match.match_id || idx"
                                            class="flex flex-col items-center justify-center px-3 py-3 rounded-lg text-white text-center font-semibold min-w-[60px]"
                                            :class="getFormClass(match.performance)">
                                            <span class="text-base leading-none">{{
                                                match.performance?.runs_scored ?? '–' }}</span>
                                            <span class="text-xs opacity-75 mt-0.5">runs</span>
                                            <span class="text-xs mt-1">{{
                                                match.performance?.wickets_taken ?? '–' }}wkt</span>
                                        </div>
                                    </div>
                                    <div v-else class="text-center text-slate-400 text-sm py-4">
                                        No recent match data available.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: about + updates -->
                        <div class="space-y-5">

                            <!-- About Player -->
                            <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                                <div class="px-4 py-3 border-b border-slate-100">
                                    <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2 m-0">
                                        <span class="w-1 h-4 rounded bg-red-500 inline-block"></span>
                                        About Player
                                    </h3>
                                </div>
                                <div class="divide-y divide-slate-50">
                                    <div class="flex justify-between items-start gap-3 px-4 py-2.5">
                                        <span class="text-xs text-slate-500 flex-shrink-0 mt-0.5">Full Name</span>
                                        <span class="text-xs font-semibold text-slate-800 text-right">{{
                                            playerData.user?.full_name || 'N/A' }}</span>
                                    </div>
                                    <div class="flex justify-between items-start gap-3 px-4 py-2.5">
                                        <span class="text-xs text-slate-500 flex-shrink-0 mt-0.5">Role</span>
                                        <span class="text-xs font-semibold text-slate-800 text-right capitalize">{{
                                            playerData.role || 'N/A' }}</span>
                                    </div>
                                    <div class="flex justify-between items-start gap-3 px-4 py-2.5">
                                        <span class="text-xs text-slate-500 flex-shrink-0 mt-0.5">Batting</span>
                                        <span class="text-xs font-semibold text-slate-800 text-right">{{
                                            formatStyle(playerData.batting_style) || 'N/A' }}</span>
                                    </div>
                                    <div class="flex justify-between items-start gap-3 px-4 py-2.5">
                                        <span class="text-xs text-slate-500 flex-shrink-0 mt-0.5">Bowling</span>
                                        <span class="text-xs font-semibold text-slate-800 text-right">{{
                                            formatStyle(playerData.bowling_style) || 'N/A' }}</span>
                                    </div>
                                    <div class="flex justify-between items-start gap-3 px-4 py-2.5">
                                        <span class="text-xs text-slate-500 flex-shrink-0 mt-0.5">Debut</span>
                                        <span class="text-xs font-semibold text-slate-800 text-right">{{
                                            playerData.debut_date ? formatDate(playerData.debut_date) : 'N/A'
                                            }}</span>
                                    </div>
                                    <div v-if="playerData.country"
                                        class="flex justify-between items-start gap-3 px-4 py-2.5">
                                        <span class="text-xs text-slate-500 flex-shrink-0 mt-0.5">Country</span>
                                        <span class="text-xs font-semibold text-slate-800 text-right">{{
                                            playerData.country }}</span>
                                    </div>
                                    <div class="flex justify-between items-start gap-3 px-4 py-2.5">
                                        <span class="text-xs text-slate-500 flex-shrink-0 mt-0.5">Teams</span>
                                        <span class="text-xs font-semibold text-slate-800 text-right">{{ playerTeams
                                            }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Latest Updates -->
                            <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                                <div class="px-4 py-3 border-b border-slate-100">
                                    <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2 m-0">
                                        <span class="w-1 h-4 rounded bg-red-500 inline-block"></span>
                                        Latest Updates
                                    </h3>
                                </div>
                                <div class="text-center py-8 text-slate-400 text-sm px-4">
                                    News isn't available at the moment.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── MATCHES ── -->
                <div v-if="activeTab === 'matches'">
                    <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 m-0">
                            <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                            Recent Matches
                        </h2>
                        <select v-model="matchesFilter"
                            class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition">
                            <option value="all">All Formats</option>
                            <option value="odi">ODI</option>
                            <option value="t20">T20</option>
                            <option value="test">Test</option>
                        </select>
                    </div>

                    <!-- Desktop table -->
                    <div class="hidden md:block bg-white rounded-xl border border-slate-100 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Match</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Date</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Runs</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Balls</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            4s/6s</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            SR</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Wkts</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Econ</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-50">
                                    <tr v-for="match in filteredMatches" :key="match.match_id"
                                        class="hover:bg-slate-50 transition-colors">
                                        <td class="px-4 py-3">
                                            <span class="text-sm font-semibold text-slate-800">
                                                {{ match.teams?.team_a?.name || 'Team A' }} vs {{
                                                    match.teams?.team_b?.name || 'Team B' }}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-center text-xs text-slate-500 whitespace-nowrap">
                                            {{ formatDate(match.match_date) }}</td>
                                        <td
                                            class="px-4 py-3 text-center text-sm font-bold text-slate-800">
                                            {{ match.performance?.runs_scored ?? '–' }}</td>
                                        <td class="px-4 py-3 text-center text-xs text-slate-600">
                                            {{ match.performance?.balls_faced ?? '–' }}</td>
                                        <td class="px-4 py-3 text-center text-xs text-slate-600">
                                            {{ match.performance?.fours ?? 0 }}/{{ match.performance?.sixes ?? 0 }}
                                        </td>
                                        <td class="px-4 py-3 text-center text-xs text-slate-600">
                                            {{
                                                (match.performance?.balls_faced && match.performance?.runs_scored)
                                                    ? ((match.performance.runs_scored /
                                                        match.performance.balls_faced) * 100).toFixed(1)
                                                    : '–'
                                            }}
                                        </td>
                                        <td
                                            class="px-4 py-3 text-center text-sm font-bold text-slate-800">
                                            {{ match.performance?.wickets_taken ?? '–' }}</td>
                                        <td class="px-4 py-3 text-center text-xs text-slate-600">
                                            {{ match.performance?.economy ?? '–' }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-if="filteredMatches.length === 0"
                            class="text-center py-10 text-slate-400 text-sm">
                            No matches found.
                        </div>
                    </div>

                    <!-- Mobile match cards -->
                    <div class="md:hidden space-y-2">
                        <div v-for="match in filteredMatches" :key="match.match_id"
                            class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                            <div class="px-4 py-3 border-b border-slate-50">
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-sm font-semibold text-slate-800">
                                        {{ match.teams?.team_a?.name || 'Team A' }} vs {{
                                            match.teams?.team_b?.name || 'Team B' }}
                                    </span>
                                    <span class="text-xs text-slate-400 flex-shrink-0">{{
                                        formatDate(match.match_date) }}</span>
                                </div>
                            </div>
                            <div class="grid grid-cols-4 divide-x divide-slate-50 px-0 py-0">
                                <div class="text-center px-3 py-3">
                                    <div class="text-sm font-bold text-slate-800">{{
                                        match.performance?.runs_scored ?? '–' }}</div>
                                    <div class="text-xs text-slate-400 mt-0.5">Runs</div>
                                </div>
                                <div class="text-center px-3 py-3">
                                    <div class="text-sm font-bold text-slate-800">{{
                                        match.performance?.balls_faced ?? '–' }}</div>
                                    <div class="text-xs text-slate-400 mt-0.5">Balls</div>
                                </div>
                                <div class="text-center px-3 py-3">
                                    <div class="text-sm font-bold text-slate-800">{{
                                        match.performance?.wickets_taken ?? '–' }}</div>
                                    <div class="text-xs text-slate-400 mt-0.5">Wkts</div>
                                </div>
                                <div class="text-center px-3 py-3">
                                    <div class="text-sm font-bold text-slate-800">
                                        {{ match.performance?.fours ?? 0 }}/{{ match.performance?.sixes ?? 0 }}
                                    </div>
                                    <div class="text-xs text-slate-400 mt-0.5">4s/6s</div>
                                </div>
                            </div>
                        </div>
                        <div v-if="filteredMatches.length === 0"
                            class="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-100 text-sm">
                            No matches found.
                        </div>
                    </div>
                </div>

                <!-- ── TEAMS ── -->
                <div v-if="activeTab === 'teams'">
                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
                        <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                        Teams
                    </h2>

                    <div v-if="playerData.teams?.length" class="space-y-2">
                        <div v-for="team in playerData.teams" :key="team.id"
                            class="bg-white rounded-xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden">
                            <div class="flex items-center gap-3 p-3">
                                <div
                                    class="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                                    <img v-if="team.logo" :src="team.logo" :alt="team.name"
                                        class="w-full h-full object-cover"
                                        @error="$event.target.style.display = 'none'" />
                                    <span v-else class="text-slate-500 font-bold text-sm uppercase">
                                        {{ (team.abbreviation || team.name || '?').charAt(0) }}
                                    </span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-slate-800 m-0 truncate">{{ team.name }}</p>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span v-if="team.abbreviation"
                                            class="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                                            {{ team.abbreviation }}
                                        </span>
                                        <span v-if="team.tournament_name" class="text-xs text-slate-400">{{
                                            team.tournament_name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else
                        class="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-100 text-sm">
                        No teams assigned.
                    </div>
                </div>

                <!-- ── INFO ── -->
                <div v-if="activeTab === 'info'">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        <!-- Personal info -->
                        <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                            <div class="px-4 py-3 border-b border-slate-100">
                                <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2 m-0">
                                    <span class="w-1 h-4 rounded bg-red-500 inline-block"></span>
                                    Personal Information
                                </h3>
                            </div>
                            <div class="divide-y divide-slate-50">
                                <div class="flex justify-between items-center px-4 py-3">
                                    <span class="text-xs text-slate-500">Full Name</span>
                                    <span class="text-xs font-semibold text-slate-800">{{
                                        playerData.user?.full_name || 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between items-center px-4 py-3">
                                    <span class="text-xs text-slate-500">Playing Role</span>
                                    <span class="text-xs font-semibold text-slate-800 capitalize">{{ playerData.role
                                        || 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between items-center px-4 py-3">
                                    <span class="text-xs text-slate-500">Batting Style</span>
                                    <span class="text-xs font-semibold text-slate-800">{{
                                        formatStyle(playerData.batting_style) || 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between items-center px-4 py-3">
                                    <span class="text-xs text-slate-500">Bowling Style</span>
                                    <span class="text-xs font-semibold text-slate-800">{{
                                        formatStyle(playerData.bowling_style) || 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between items-center px-4 py-3">
                                    <span class="text-xs text-slate-500">Debut Date</span>
                                    <span class="text-xs font-semibold text-slate-800">{{
                                        playerData.debut_date ? formatDate(playerData.debut_date) : 'N/A' }}</span>
                                </div>
                                <div class="flex justify-between items-start gap-3 px-4 py-3">
                                    <span class="text-xs text-slate-500 flex-shrink-0">Teams</span>
                                    <span class="text-xs font-semibold text-slate-800 text-right">{{ playerTeams
                                        }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Biography -->
                        <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
                            <div class="px-4 py-3 border-b border-slate-100">
                                <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2 m-0">
                                    <span class="w-1 h-4 rounded bg-red-500 inline-block"></span>
                                    Biography
                                </h3>
                            </div>
                            <div class="px-4 py-4">
                                <p v-if="playerData.player_info?.bio"
                                    class="text-sm text-slate-600 leading-relaxed m-0">
                                    {{ playerData.player_info.bio }}
                                </p>
                                <p v-else class="text-center text-slate-400 text-sm py-4 m-0">
                                    No biography available.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchPlayerDetail } from './../api/players';
import bgHome from './../../assets/bg/bg-home.png';

const route = useRoute();
const router = useRouter();
const playerSlug = route.params.slug;

// ── State ──────────────────────────────────────────────────────────────────
const playerData = ref(null);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const activeTab = ref('overview');
const selectedFormat = ref('odi');
const matchesFilter = ref('all');

const tabs = ref([
    { id: 'overview', label: 'Overview' },
    { id: 'matches', label: 'Matches' },
    { id: 'teams', label: 'Teams' },
    { id: 'info', label: 'Info' },
]);

// ── Computed ───────────────────────────────────────────────────────────────
const playerInitials = computed(() => {
    const name = playerData.value?.user?.full_name || '';
    return name.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || '?';
});

const playerTeams = computed(() => {
    if (!playerData.value?.teams?.length) return 'No teams';
    return playerData.value.teams.map(t => t.name).join(', ');
});

const keyStats = computed(() => {
    if (!playerData.value?.statistics) return [];
    const s = playerData.value.statistics;
    return [
        { label: 'Matches', value: s.matches_played || 0 },
        { label: 'Runs', value: s.total_runs || 0 },
        { label: 'Bat Avg', value: formatNumber(s.average) },
        { label: 'Strike Rate', value: formatNumber(s.strike_rate) },
        { label: 'Wickets', value: s.wickets || 0 },
        { label: 'Bowl Avg', value: formatNumber(s.bowling_average) },
        { label: 'Economy', value: formatNumber(s.economy_rate) },
        { label: 'Catches', value: s.catches || 0 },
    ];
});

const careerStatsByFormat = computed(() =>
    playerData.value?.career_stats_by_format || {
        odi: { matches: 0, runs: 0, average: 0, strike_rate: 0, wickets: 0, bowling_average: 0, economy: 0 },
        t20: { matches: 0, runs: 0, average: 0, strike_rate: 0, wickets: 0, bowling_average: 0, economy: 0 },
        test: { matches: 0, runs: 0, average: 0, strike_rate: 0, wickets: 0, bowling_average: 0, economy: 0 },
        ipl: { matches: 0, runs: 0, average: 0, strike_rate: 0, wickets: 0, bowling_average: 0, economy: 0 },
    }
);

const filteredMatches = computed(() => {
    if (!playerData.value?.recent_matches) return [];
    if (matchesFilter.value === 'all') return playerData.value.recent_matches;
    return playerData.value.recent_matches.filter(m => m.format === matchesFilter.value);
});

// ── Helpers ────────────────────────────────────────────────────────────────
const calculateAge = (dateString) => {
    if (!dateString) return 'N/A';
    const birth = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const formatNumber = (num) => {
    if (num === null || num === undefined) return '0.00';
    return Number(num).toFixed(2);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

const formatStyle = (style) => {
    if (!style) return '';
    return style.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getFormClass = (performance) => {
    const runs = performance?.runs_scored || 0;
    const wkts = performance?.wickets_taken || 0;
    if (runs >= 50 || wkts >= 3) return 'bg-emerald-500';
    if (runs >= 30 || wkts >= 2) return 'bg-blue-500';
    if (runs >= 10 || wkts >= 1) return 'bg-amber-500';
    return 'bg-red-400';
};

// ── Data loading ───────────────────────────────────────────────────────────
const loadPlayer = async (slug) => {
    loading.value = true;
    error.value = false;
    playerData.value = null;
    try {
        const data = await fetchPlayerDetail(slug);
        if (data) {
            playerData.value = data;
            activeTab.value = 'overview';
        } else {
            error.value = true;
            errorMessage.value = 'Player not found';
        }
    } catch (err) {
        console.error('Error loading player profile:', err);
        error.value = true;
        errorMessage.value = err.message || 'Failed to load player';
    } finally {
        loading.value = false;
    }
};

const retryLoading = () => loadPlayer(playerSlug);

onMounted(() => loadPlayer(playerSlug));

watch(() => route.params.slug, (newSlug) => {
    if (newSlug) loadPlayer(newSlug);
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
</style>
