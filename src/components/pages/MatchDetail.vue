<template>
    <section id="home" class="bg-home" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center pb-14" style="padding-top: 9rem;">
            <div class="container mx-auto px-4">
                <div class="w-full lg:w-12/12 px-4">
                    <div class="flex flex-wrap -mx-4 justify-between items-center">
                        <div class="team-info">
                            <div class="flex justify-between items-center">
                                <img :src="match?.team_a?.logo" @error="onImageError($event)" :alt="match?.team_a?.name"
                                    class="w-12 h-12 rounded-full" />
                                <div class="team-wrapper ml-2">
                                    <h4 class="team-name text-gray-100 mb-2">{{ match?.team_a?.name }}</h4>
                                    <div v-if="match?.status === 'completed'">
                                        <span class="team-score">{{ match?.team_a?.score }}</span>
                                        <span class="mx-2">|</span>
                                        <span class="total-overs">{{ match?.team_a?.overs }}</span>
                                    </div>
                                    <div v-else>
                                        <span class="team-score text-gray-400">Upcoming</span>
                                        <span class="mx-2">|</span>
                                        <span class="total-overs text-gray-400">{{ match?.match_date }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="team-info" style="align-items: flex-end;">
                            <div class="flex justify-between items-center">
                                <div class="team-wrapper right-team-name text-right mr-2">
                                    <span class="team-name text-gray-600">CRR</span>
                                    <span class="team-name text-gray-600">CRR</span>
                                    <span class="team-name text-gray-600">CRR</span>
                                    <span class="team-name text-gray-600">CRR</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="min-h-screen">
        <!-- Tab Content -->
        <div>

        </div>
    </div>
</template>

<script setup>
import bgHome from './../../assets/bg/bg-home.png'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMatchBySlug } from './../api/matches'

const route = useRoute()
const match = ref({})

onMounted(async () => {
    const id = route.params.id

    if (!id) {
        console.error('ID not found in route params')
        return
    }

    match.value = await fetchMatchBySlug(id);

    if (!match.value) {
        console.error('Match not found for id:', route.params.id)
    }
})

// const formattedDate = computed(() => {
//     if (!tournament.value.start_date || !tournament.value.end_date) return ''
//     const start = new Date(tournament.value.start_date).toLocaleDateString()
//     const end = new Date(tournament.value.end_date).toLocaleDateString()
//     return `${start} - ${end}`
// })
</script>

<style scoped>
button {
    transition: all 0.2s ease;
}
</style>
