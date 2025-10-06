<template>
    <section id="home" class="bg-home py-24" :style="{ backgroundImage: `url(${bgHome})` }">
        <div v-if="liveMatches.length > 0" class="flex items-center justify-center pt-4" style="padding-top: 7rem;">
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

    <section class="bg-gray-200">
        <div class="flex items-center justify-center py-2" v-if="boardMembers.length > 0">
            <div class="container mx-auto px-4">
                <div class="flex flex-wrap -mx-4">
                    <div class="w-full lg:w-12/12 px-4">
                        <img :src="boardMembers" alt="Board Members" class="w-full h-full object-cover">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="home" class="bg-completed-matches bg-white">
        <div class="flex items-center justify-center py-24" v-if="completedMatches.length > 0">
            <div class="container mx-auto px-4">
                <div class="flex flex-wrap -mx-4">
                    <div class="w-full lg:w-12/12 px-4">
                        <div class="text-center">
                            <p class="d-flex justify-content-center align-items-center gap-2 flex-wrap mb-4">
                                <span class="icon bg-primary rounded d-flex justify-content-center align-items-center"
                                    style="width: 32px; height: 32px;">
                                    <i class="ti ti-info-circle text-white f-18"></i>
                                </span>

                                <i class="ti ti-line-dashed text-primary fs-5"></i>

                                <span class="badge bg-light border text-primary py-2 px-3 f-18">
                                    Recent Matches
                                </span>
                            </p>
                        </div>

                        <!-- table of completed matches -->
                        <div class="container mt-3">
                            <div class="table-responsive pt-3">
                                <div v-if="completedMatches.length > 0">
                                    <MatchRow v-for="match in completedMatches.filter(m => m && m.team_a && m.team_b)"
                                        :key="match.id" :match="match" />
                                </div>

                                <!-- Show alert if no matches -->
                                <div v-else class="alert alert-warning text-center my-4">
                                    No completed matches available.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="home" class="bg-tournaments bg-white">
        <div class="flex items-center justify-center py-24" v-if="tournaments.length > 0">
            <div class="container mx-auto px-4">
                <div class="flex flex-wrap -mx-4">
                    <div class="w-full lg:w-12/12 px-4">
                        <div class="text-center">
                            <p class="d-flex justify-content-center align-items-center gap-2 flex-wrap mb-4">
                                <span class="icon bg-primary rounded d-flex justify-content-center align-items-center"
                                    style="width: 32px; height: 32px;">
                                    <i class="ti ti-info-circle text-white f-18"></i>
                                </span>

                                <i class="ti ti-line-dashed text-primary fs-5"></i>

                                <span class="badge bg-light border text-primary py-2 px-3 f-18">
                                    Tournaments
                                </span>
                            </p>
                        </div>

                        <!-- table of completed matches -->
                        <div class="container mt-3">
                            <div class="table-responsive pt-3">
                                <!-- Check if completedMatches has data -->
                                <div v-if="tournaments.length > 0">
                                    <TournamentCard v-for="tournament in tournaments" :key="tournament.id"
                                        :tournament="tournament" />
                                </div>

                                <!-- Show alert if no matches -->
                                <div v-else class="alert alert-warning text-center my-4">
                                    No completed tournaments available.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MatchCard from './includes/MatchCard.vue'
import MatchRow from './includes/MatchRow.vue'
import axios from 'axios'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import bgHome from './../assets/bg/bg-home.png'
import { fetchLiveMatches, fetchCompletedMatches, fetchUpcomingMatches } from "./api/matches"
import { fetchTournaments } from './api/tournaments';
import TournamentCard from './includes/TournamentCard.vue'
import boardMembers from './../assets/images/board-members.jpg'

const liveMatches = ref([]);
const upcomingMatches = ref([]);
const completedMatches = ref([]);
const tournaments = ref([]);

onMounted(async () => {
    liveMatches.value = await fetchLiveMatches();
    upcomingMatches.value = await fetchUpcomingMatches();
    const fetchedCompleted = await fetchCompletedMatches();
    completedMatches.value = fetchedCompleted.filter(
        m => m && m.team_a && m.team_b
    );
    tournaments.value = await fetchTournaments();
});
</script>