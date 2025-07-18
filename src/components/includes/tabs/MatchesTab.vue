<template>
    <div class="container mx-auto px-4 bg-white min-h-screen">
        <div class="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Featured Matches -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Featured Matches</h3>
                    <div class="">
                        <MatchRow v-for="match in tournament.matches" :key="match.id" :match="match" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MatchRow from './../MatchRow.vue'

const props = defineProps({
    tournament: {
        type: Object,
        required: true
    },
})

const pointGroups = ['Group A', 'Group B', 'Group C', 'Group D']
const activeGroup = ref('Group A')

const pointsTable = {
    'Group A': [
        { name: 'India U19', p: 3, w: 3, l: 0, nrr: '+3.240', pts: 6 },
        { name: 'Bangladesh U19', p: 3, w: 2, l: 1, nrr: '-0.374', pts: 4 },
        { name: 'Ireland U19', p: 3, w: 1, l: 2, nrr: '-0.778', pts: 2 },
        { name: 'USA U19', p: 4, w: 0, l: 4, nrr: '-2.340', pts: 0 }
    ],
    // Add other groups similarly
}

const keyStats = [
    {
        label: 'Most Runs',
        player: { name: 'U Saharan', image: '/players/usaharan.png' },
        value: '397 Runs'
    },
    {
        label: 'Most Wickets',
        player: { name: 'K Maphaka', image: '/players/kmaphaka.png' },
        value: '21 Wickets'
    },
    {
        label: 'Most Sixes',
        player: { name: 'S Stolk', image: '/players/stolk.png' },
        value: '11 Sixes'
    },
    {
        label: 'Best Strike Rate',
        player: { name: 'S Stolk', image: '/players/stolk.png' },
        value: '141.61'
    }
]
</script>