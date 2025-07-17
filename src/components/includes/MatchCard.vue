<!-- src/components/MatchCard.vue -->
<template>
    <div class="bg-white rounded-xl shadow-md">
        <a class="block text-md font-semibold text-gray-800 mb-0 py-2 px-4 bg-gray-200 rounded-t-xl rounded-b-none"
            href="#">
            <span>{{ match.match_date }}</span>
            <span class="mx-2">|</span>
            <span>{{ match.tournament }}</span>
        </a>
        <div class="p-4">
            <p class="text-sm font-semibold mb-3">{{ match.title }}, {{ match.venue }}</p>
            <div class="flex justify-between items-center mb-4">
                <div class="flex flex-col gap-2">
                    <!-- Team A -->
                    <div class="flex items-center gap-2">
                        <img :src="match.team_a.logo" alt="Team A" class="w-8 h-8 rounded-full" />
                        <p class="text-sm font-bold m-0">{{ match.team_a.name }}</p>
                    </div>
                    <!-- Team B -->
                    <div class="flex items-center gap-2">
                        <img :src="match.team_b.logo" alt="Team A" class="w-8 h-8 rounded-full" />
                        <p class="text-sm font-bold m-0">{{ match.team_b.name }}</p>
                    </div>
                </div>

                <!-- Seperator with full height -->
                <span v-if="match.winning_team == null" class="mx-2 d-inline-block"
                    style="width: 1px; height: 100%; background-color: #ccc;"></span>
                <span v-if="match.winning_team == null" class="w-px bg-gray-300" style="height: auto;"></span>

                <!-- Time -->
                <div class="text-center" v-if="match.winning_team == null">
                    <p class="text-sm font-semibold mb-2">Starts At</p>
                    <h5 class="text-md text-orange-400">{{ match.match_time }}</h5>
                </div>
            </div>

            <div class="text-xs text-gray-500" v-if="match.winning_team != null">{{ match.tournament }}</div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

// Capture props into a local variable
const props = defineProps({
    match: {
        type: Object,
        required: true
    }
})

// Now use props.match in computed
const formattedDate = computed(() => {
    return new Date(props.match.match_date).toLocaleString()
})
</script>
