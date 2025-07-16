<!-- src/components/MatchCard.vue -->
<template>
    <div class="bg-white rounded-xl shadow-md p-4">
        <h2 class="text-sm font-semibold text-gray-800 mb-2">{{ match.title }}</h2>
        <p class="text-sm text-gray-600 mb-4">{{ formattedDate }}</p>

        <div class="flex justify-between items-center mb-4">
            <!-- Team A -->
            <div class="flex items-center gap-2">
                <img :src="match.team_a.logo" alt="Team A" class="w-10 h-10 rounded-full" />
                <div>
                    <p class="text-sm font-bold">{{ match.team_a.name }}</p>
                    <p class="text-xs text-gray-500">Group {{ match.team_a.group }}</p>
                </div>
            </div>

            <!-- VS -->
            <span class="text-xs font-semibold text-gray-500">vs</span>

            <!-- Team B -->
            <div class="flex items-center gap-2">
                <img :src="match.team_b.logo" alt="Team B" class="w-10 h-10 rounded-full" />
                <div>
                    <p class="text-sm font-bold">{{ match.team_b.name }}</p>
                    <p class="text-xs text-gray-500">Group {{ match.team_b.group }}</p>
                </div>
            </div>
        </div>

        <div class="text-xs text-gray-500">{{ match.tournament }}</div>
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
