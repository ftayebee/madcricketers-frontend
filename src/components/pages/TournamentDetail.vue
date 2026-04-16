<template>
    <!-- Hero header -->
    <section class="relative overflow-hidden" style="background-color: #0f172a;">
        <div class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
            :style="{ backgroundImage: `url(${bgHome})` }"></div>

        <div class="relative z-10 container mx-auto px-4 pb-0" style="padding-top: 5.5rem;">

            <!-- Loading skeleton -->
            <div v-if="loading" class="animate-pulse py-6">
                <div class="h-7 bg-white/10 rounded w-64 mb-3"></div>
                <div class="h-4 bg-white/10 rounded w-40 mb-6"></div>
                <div class="flex gap-4">
                    <div v-for="i in 4" :key="i" class="h-9 w-24 bg-white/10 rounded-t-lg"></div>
                </div>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="py-10 text-center">
                <p class="text-red-400 text-sm mb-3">Failed to load tournament details.</p>
                <button @click="loadTournament"
                    class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition">
                    Retry
                </button>
            </div>

            <!-- Tournament header content -->
            <template v-else-if="tournament">
                <div class="flex flex-wrap items-start justify-between gap-4 pb-4">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full capitalize', statusClass]">
                                {{ tournament.status }}
                            </span>
                            <span v-if="tournament.format"
                                class="text-xs text-slate-400 bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                {{ tournament.format }}
                            </span>
                        </div>
                        <h1 class="text-xl sm:text-2xl font-bold text-white m-0">{{ tournament.name }}</h1>
                        <p class="text-slate-400 text-sm mt-1 m-0">{{ formattedDate }}</p>
                    </div>
                    <div class="text-right text-slate-400 text-xs">
                        <p class="m-0">{{ tournament.matches_count }} matches</p>
                        <p v-if="tournament.stage" class="m-0 mt-0.5">{{ tournament.stage }}</p>
                    </div>
                </div>

                <!-- Tab bar -->
                <div class="flex overflow-x-auto gap-1 -mb-px hide-scrollbar">
                    <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
                        :class="['px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition border-b-2 flex-shrink-0',
                            activeTab === tab
                                ? 'border-red-500 text-white'
                                : 'border-transparent text-slate-400 hover:text-white hover:border-white/30']">
                        {{ tab }}
                    </button>
                </div>
            </template>

        </div>
    </section>

    <!-- Tab content -->
    <div v-if="!loading && !error && tournament">
        <OverviewTab    v-if="activeTab === 'Overview'"     :tournament="tournament" />
        <MatchesTab     v-if="activeTab === 'Matches'"      :tournament="tournament" />
        <SquadsTab      v-if="activeTab === 'Squads'"       :tournament="tournament" />
        <PointsTableTab v-if="activeTab === 'Points Table'" :tournament="tournament" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import bgHome from './../../assets/bg/bg-home.png'
import OverviewTab    from './../includes/tabs/OverviewTab.vue'
import MatchesTab     from './../includes/tabs/MatchesTab.vue'
import SquadsTab      from './../includes/tabs/SquadsTab.vue'
import PointsTableTab from './../includes/tabs/PointsTableTab.vue'
import { fetchTournamentBySlug } from './../api/tournaments'

const route = useRoute()

const tournament = ref(null)
const activeTab  = ref('Overview')
const loading    = ref(true)
const error      = ref(false)

const tabs = ['Overview', 'Matches', 'Squads', 'Points Table']

const formattedDate = computed(() => {
    if (!tournament.value?.start_date) return ''
    const start = new Date(tournament.value.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    const end   = new Date(tournament.value.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${start} – ${end}`
})

const statusClass = computed(() => {
    switch (tournament.value?.status) {
        case 'live':
        case 'ongoing':   return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        case 'upcoming':  return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        default:          return 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
    }
})

async function loadTournament() {
    loading.value = true
    error.value   = false
    try {
        const slug = route.params.slug
        tournament.value = await fetchTournamentBySlug(slug)
        if (!tournament.value) error.value = true
    } catch {
        error.value = true
    } finally {
        loading.value = false
    }
}

onMounted(loadTournament)
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
