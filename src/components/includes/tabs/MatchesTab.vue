<template>
    <div class="bg-slate-50 min-h-screen py-8">
        <div class="container mx-auto px-4 max-w-4xl">

            <h3 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
                <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                All Matches
            </h3>

            <!-- Empty state -->
            <div v-if="!tournament.matches || tournament.matches.length === 0"
                class="bg-white rounded-xl border border-slate-100 p-10 text-center text-slate-400 text-sm">
                No matches scheduled for this tournament yet.
            </div>

            <!-- Grouped by stage -->
            <template v-else>
                <div v-for="(matches, stage) in groupedByStage" :key="stage" class="mb-8">
                    <div v-if="stage && stage !== 'undefined'"
                        class="flex items-center gap-3 mb-3">
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ stage }}</span>
                        <div class="flex-1 h-px bg-slate-200"></div>
                        <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {{ matches.length }} matches
                        </span>
                    </div>
                    <div class="space-y-2">
                        <MatchRow v-for="match in matches" :key="match.id" :match="match" />
                    </div>
                </div>
            </template>

        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import MatchRow from './../MatchRow.vue'

const props = defineProps({
    tournament: {
        type: Object,
        required: true
    }
})

// Group matches by their stage field
const groupedByStage = computed(() => {
    const matches = props.tournament?.matches || []
    if (!matches.length) return {}

    return matches.reduce((acc, match) => {
        const stage = match.stage || 'General'
        if (!acc[stage]) acc[stage] = []
        acc[stage].push(match)
        return acc
    }, {})
})
</script>
