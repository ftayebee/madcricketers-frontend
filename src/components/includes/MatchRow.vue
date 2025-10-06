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
                        <span v-if="match.result_summary" class="winner block" style="padding-bottom: 6px;color: #8FA31E;">
                            {{ match.result_summary }}
                        </span>
                        <span v-else class="reason" style="color: rgb(0 121 44);">
                            <span>{{ match.match_date }}</span>
                        </span>
                    </div>

                    <div class="result text-center" v-else-if="match.status === 'live'">
                        <span class="inline-flex items-center justify-center space-x-1 text-red-500 font-bold text-sm">
                            <span class="h-2 w-2 rounded-full bg-red-500 animate-ping-fast"></span>
                            <span>LIVE</span>
                        </span>
                    </div>

                    <div class="result text-center" v-else>
                        <span class="winner block text-gray-400">Starts at </span>
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

console.log(props.match);

const onImageError = (e) => {
    e.target.src = '/assets/img/unknown_team.png';
};
</script>

<style scoped>

</style>
