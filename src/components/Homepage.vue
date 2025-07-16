<template>
    <section id="home" class="bg-home" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center py-24">
            <div class="container mx-auto px-4">
                <div class="flex flex-wrap -mx-4">
                    <div class="w-full lg:w-12/12 px-4">
                        <h5 class="mb-6 text-white text-xl font-semibold">Matches For You</h5>

                        <!-- Swiper here or simple flex layout -->
                        <Splide
                            :options="{ perPage: 3, gap: '1rem', rewind: true, breakpoints: { 640: { perPage: 1 } } }">
                            <SplideSlide v-for="match in liveMatches" :key="match.id">
                                <MatchCard :match="match" />
                            </SplideSlide>
                        </Splide>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MatchCard from './includes/MatchCard.vue'
import axios from 'axios'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import bgHome from './../assets/bg/bg-home.png'

// Mock fetch functions (replace with real API later)
const liveMatches = ref([])
const upcomingMatches = ref([])

onMounted(async () => {
    liveMatches.value = await fetchLiveMatches()
    upcomingMatches.value = await fetchUpcomingMatches()
})

async function fetchLiveMatches() {
    try {
        const res = await axios.get('http://127.0.0.1:8000/api/recent-matches')
        return res.data.data
    } catch (error) {
        console.error('Failed to load live matches:', error)
        return []
    }
}

function fetchUpcomingMatches() {
    return Promise.resolve([
        {
            id: 3,
            teamA: 'Bangladesh',
            teamB: 'Sri Lanka',
            startTime: '2025-07-20T14:00:00Z',
            status: 'Upcoming',
        },
        {
            id: 4,
            teamA: 'South Africa',
            teamB: 'New Zealand',
            startTime: '2025-07-21T10:00:00Z',
            status: 'Upcoming',
        },
    ])
}
</script>