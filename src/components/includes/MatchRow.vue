<template>
    <router-link :to="`/match/detail/${match.id}`" class="no-underline">
        <div class="match-card-container bg-white p-3 rounded-md shadow-sm m-3">
            <a :href="match.url" class="match-card-wrapper">
                <div class="flex justify-between items-center">
                    <!-- First Team -->
                    <div class="team-info">
                        <div class="flex justify-between items-center">
                            <img :src="match?.team_a?.logo" @error="onImageError($event)" :alt="match?.team_a?.name"
                                class="w-12 h-12 rounded-full" />
                            <div class="team-wrapper ml-2">
                                <div>
                                    <span class="team-name text-gray-600">{{ match?.team_a?.name }}</span>
                                </div>
                                <div v-if="match?.status === 'completed'">
                                    <span class="team-score">{{ match?.team_a?.score }}</span>
                                    <span class="mx-2">|</span>
                                    <span class="total-overs">{{ match?.team_a?.overs }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Result -->
                    <div class="result text-center" v-if="match?.status === 'completed'">
                        <span class="winner block" :style="{ color: match.result.color }" style="padding-bottom: 6px;">
                            {{ match.result.text }}
                        </span>
                        <span class="reason">
                            <span>{{ match.result.matchType }}</span>
                            {{ match?.team_a?.name }} vs {{ match?.team_b?.name }} {{ match.result.year }}
                        </span>
                    </div>

                    <div class="result text-center" v-else-if="match.status === 'live'">
                        <span class="inline-flex items-center justify-center space-x-1 text-red-500 font-bold text-sm">
                            <span class="h-2 w-2 rounded-full bg-red-500 animate-ping-fast"></span>
                            <span>LIVE</span>
                        </span>
                    </div>

                    <div class="result text-center" v-else>
                        <span class="winner block text-gray-400">Starts at {{ match.status }}</span>
                        <span class="reason text-gray-700">{{ match?.match_date }}</span>
                    </div>

                    <!-- Second Team -->
                    <div class="team-info" style="align-items: flex-end;">
                        <div class="flex justify-between items-center">
                            <div class="team-wrapper right-team-name text-right mr-2">
                                <div>
                                    <span class="team-name text-gray-600">{{ match?.team_b?.name }}</span>
                                </div>
                                <div v-if="match?.status === 'completed'">
                                    <span class="team-score">{{ match?.team_b?.score }}</span>
                                    <span class="mx-2">|</span>
                                    <span class="total-overs">{{ match?.team_b?.overs }}</span>
                                </div>
                            </div>
                            <img :src="match?.team_b?.logo" @error="onImageError($event)" :alt="match?.team_b?.name"
                                class="w-12 h-12 rounded-full" />
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </router-link>
</template>

<script setup>
const props = defineProps({
    match: {
        type: Object,
        required: true,
    }
});

const onImageError = (e) => {
    e.target.src = '/assets/img/unknown_team.png';
};
</script>

<style scoped>

</style>
