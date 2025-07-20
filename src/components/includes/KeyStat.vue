<template>
    <div class="bg-white rounded-md shadow-md mt-0">
        <div class="text-md font-semibold text-gray-800 mb-0 px-3 py-2 bg-gray-200 rounded-md rounded-b-none">
            <span>{{ title }}</span> <!-- Dynamic title -->
        </div>
        <div class="p-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-4">
                    <!-- Player Info -->
                    <img :src="stat.player.image || 'https://via.placeholder.com/56'" alt="Player Image"
                        class="w-14 h-14 rounded-full object-cover" />
                    <div>
                        <p class="text-sm font-bold m-0">{{ stat.player.name }}</p> <!-- Player Name -->
                        <p class="text-xs text-gray-500">{{ stat.player.team }}</p> <!-- Team Name -->
                    </div>
                </div>
                <!-- Stat Value -->
                <div class="flex items-center gap-2">
                    <h4 class="text-lg font-bold text-blue-600">{{ stat.value }}</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    stat: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        default: ''
    }
})

console.log('KeyStat Component Loaded:', props.stat)
</script>
