<template>
    <!-- Hero -->
    <section class="relative overflow-hidden" style="background-color: #0f172a; min-height: 220px;">
        <div class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
            :style="{ backgroundImage: `url(${bgHome})` }"></div>

        <div class="relative z-10 container mx-auto px-4 py-10" style="padding-top: 6rem;">
            <h1 class="text-2xl font-bold text-white mb-1">Tournaments</h1>
            <p class="text-slate-400 text-sm m-0">All cricket tournaments organised by MadCricketers</p>
        </div>
    </section>

    <!-- Filter + List -->
    <section class="bg-slate-50 min-h-screen py-8">
        <div class="container mx-auto px-4 max-w-3xl">

            <!-- Status filter tabs -->
            <div class="flex gap-2 mb-6 flex-wrap">
                <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
                    :class="['px-4 py-1.5 text-xs font-semibold rounded-full border transition',
                        activeFilter === f.value
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-red-300']">
                    {{ f.label }}
                    <span v-if="f.value !== 'all'" class="ml-1 opacity-70">
                        ({{ countByStatus(f.value) }})
                    </span>
                </button>
            </div>

            <!-- Loading skeletons -->
            <div v-if="loading" class="space-y-2">
                <div v-for="i in 5" :key="i"
                    class="bg-white rounded-xl border border-slate-100 p-3 animate-pulse flex items-center gap-3">
                    <div class="w-11 h-11 rounded-full bg-slate-200 flex-shrink-0"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-3.5 bg-slate-200 rounded w-2/3"></div>
                        <div class="h-3 bg-slate-200 rounded w-1/3"></div>
                    </div>
                    <div class="w-16 h-5 bg-slate-200 rounded-full"></div>
                </div>
            </div>

            <!-- Error -->
            <div v-else-if="error"
                class="bg-white rounded-xl border border-red-100 p-8 text-center text-red-500 text-sm">
                Failed to load tournaments. Please try again later.
            </div>

            <!-- Empty (filtered) -->
            <div v-else-if="filtered.length === 0"
                class="bg-white rounded-xl border border-slate-100 p-10 text-center text-slate-400 text-sm">
                No {{ activeFilter === 'all' ? '' : activeFilter }} tournaments found.
            </div>

            <!-- Tournament cards -->
            <div v-else class="space-y-2">
                <TournamentCard v-for="t in filtered" :key="t.id" :tournament="t" />
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TournamentCard from '../includes/TournamentCard.vue'
import bgHome from './../../assets/bg/bg-home.png'
import { fetchTournaments } from './../api/tournaments'

const tournaments   = ref([])
const loading       = ref(true)
const error         = ref(false)
const activeFilter  = ref('all')

const filters = [
    { value: 'all',       label: 'All' },
    { value: 'live',      label: 'Live' },
    { value: 'upcoming',  label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
]

const countByStatus = (status) =>
    tournaments.value.filter(t => t.status === status || (status === 'live' && t.status === 'ongoing')).length

const filtered = computed(() => {
    if (activeFilter.value === 'all') return tournaments.value
    return tournaments.value.filter(t =>
        t.status === activeFilter.value ||
        (activeFilter.value === 'live' && t.status === 'ongoing')
    )
})

onMounted(async () => {
    try {
        tournaments.value = await fetchTournaments() || []
    } catch {
        error.value = true
    } finally {
        loading.value = false
    }
})
</script>
