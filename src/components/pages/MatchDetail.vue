<template>
    <section id="home" class="bg-home" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center" style="padding-top: 9rem;">
            <div class="container mx-auto px-4">
                <div class="w-full lg:w-12/12 px-4">
                    <div class="flex flex-wrap -mx-4 justify-between items-center pb-12">
                        <div class="team-info">
                            <div class="flex justify-between items-center">
                                <img :src="match?.team_a?.logo" @error="onImageError($event)" :alt="match?.team_a?.name"
                                    class="w-12 h-12 rounded-full" />
                                <div class="team-wrapper ml-2">
                                    <h4 class="team-name text-gray-100 mb-2 font-normal">{{ match?.team_a?.name }}</h4>
                                    <div v-if="match?.status === 'completed'">
                                        <h4 class="team-score">{{ match?.team_a?.score }}</h4>
                                        <span class="total-overs">{{ match?.team_a?.overs }}</span>
                                    </div>
                                    <div v-else>
                                        <h4 class="team-score text-gray-400 font-bold inline-block mb-0">0 - 0</h4>
                                        <h6 class="total-overs text-gray-400 inline-block ml-3 mb-0">20.0</h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="team-info" style="align-items: flex-end;" v-if="match.status != 'live'">
                            <h2 class="m-0 text-yellow-300 font-black">Innings Break</h2>
                        </div>

                        <div class="team-info" style="align-items: flex-end;">
                            <div class="flex justify-between flex-col" style="align-items: flex-end;">
                                <div class="team-wrapper right-team-name text-right">
                                    <h6 class="team-name text-gray-100 mb-2 inline-block mr-2">CRR:</h6>
                                    <h6 class="team-name text-gray-100 mb-2 inline-block mr-0">0.0</h6>
                                </div>
                                <div class="team-wrapper right-team-name text-right">
                                    <h6 class="team-name text-gray-100 mb-0 inline-block">TEAM A Choose To Bat</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-0 flex space-x-4 w-full lg:w-12/12">
                        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="['px-4 py-2 font-medium',
                            activeTab === tab ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-200'
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
            <MatchInfo v-if="activeTab === 'Match Info'" :tournament="match.tournament" :match="match" />
            <LiveScore v-if="activeTab === 'Live'" :match="match" />
            <ScoreCard v-if="activeTab === 'Scorecard'" :match="match" />
        </div>
    </div>
</template>

<script setup>
import bgHome from './../../assets/bg/bg-home.png'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMatchBySlug } from './../api/matches'
import MatchInfo from '../includes/tabs/MatchInfo.vue'
import LiveScore from '../includes/tabs/LiveScore.vue'
import ScoreCard from '../includes/tabs/ScoreCard.vue'

const route = useRoute()
const match = ref({})
const tabs = ['Match Info', 'Live', 'Scorecard']
const activeTab = ref('Match Info')


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
});

</script>

<style scoped>
button {
    transition: all 0.2s ease;
}
</style>
