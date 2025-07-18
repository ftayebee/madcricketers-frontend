<template>
    <section id="home" class="bg-home" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center" style="padding-top: 9rem;">
            <div class="container mx-auto px-4">
                <div class="flex flex-wrap -mx-4">
                    <div class="w-full lg:w-12/12 px-4">
                        <h2 class="text-2xl font-semibold text-white">{{ tournament?.name }}</h2>
                        <p class="text-sm text-gray-100">{{ formattedDate }}</p>
                    </div>
                    <div class="mb-0 flex space-x-4 w-full lg:w-12/12 px-4 pt-4">
                        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="[
                            'px-4 py-2 font-medium',
                            activeTab === tab ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-200'
                        ]">
                            {{ tab }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="min-h-screen">
        <!-- Tab Content -->
        <div>
            <OverviewTab v-if="activeTab === 'Overview'" :tournament="tournament" />
            <MatchesTab v-if="activeTab === 'Matches'" :tournament="tournament" />
            <SquadsTab v-if="activeTab === 'Squads'" :tournament="tournament" />
            <PointsTableTab v-if="activeTab === 'Points Table'" :tournament="tournament"/>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import bgHome from './../../assets/bg/bg-home.png'
import OverviewTab from './../includes/tabs/OverviewTab.vue'
import MatchesTab from './../includes/tabs/MatchesTab.vue'
import SquadsTab from './../includes/tabs/SquadsTab.vue'
import PointsTableTab from './../includes/tabs/PointsTableTab.vue'
import { fetchTournamentBySlug } from './../api/tournaments'

const route = useRoute()
const tournament = ref({})
const activeTab = ref('Overview')
const tabs = ['Overview', 'Matches', 'Squads', 'Points Table']

onMounted(async () => {
    const slug = route.params.slug

    if (!slug) {
        console.error('Slug not found in route params')
        return
    }
    
    tournament.value = await fetchTournamentBySlug(slug);

    console.log('Tournament data:', tournament.value)
    if (!tournament.value) {
        console.error('Tournament not found for slug:', route.params.slug)
    }
})

const formattedDate = computed(() => {
    if (!tournament.value.start_date || !tournament.value.end_date) return ''
    const start = new Date(tournament.value.start_date).toLocaleDateString()
    const end = new Date(tournament.value.end_date).toLocaleDateString()
    return `${start} - ${end}`
})
</script>

<style scoped>
button {
    transition: all 0.2s ease;
}
</style>
  
