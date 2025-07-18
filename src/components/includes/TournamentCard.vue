<template>
    <router-link :to="`/tournaments/${tournament.slug}`"
        class="tournament-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 mb-3 flex items-start gap-5 border border-gray-100 hover:border-blue-100">
        <!-- Logo -->
        <img :src="tournament?.logo || placeholderImg" @error="onImageError" alt="Tournament Logo"
            class="w-16 h-16 object-cover rounded-full border-2 border-gray-200" />

        <!-- Info Section -->
        <div class="flex-1">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800 mb-1">
                    {{ tournament?.name }}
                </h2>
                <span :class="statusClass" class="text-xs font-semibold px-3 py-1 rounded-full capitalize">
                    {{ tournament?.status }}
                </span>
            </div>

            <p class="text-sm text-gray-500 mt-2 mb-0">
                📅 {{ formattedDate }}
            </p>

            <p v-if="tournament?.description" class="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                {{ tournament?.description }}
            </p>
        </div>
    </router-link>
</template>

<script setup>
import { computed } from 'vue';
import placeholderImg from './../../assets/images/logo-placeholder.jpg';

const props = defineProps({
    tournament: {
        type: Object,
        required: true,
    },
});

const formattedDate = computed(() => {
    const start = new Date(props.tournament?.start_date).toLocaleDateString();
    const end = new Date(props.tournament?.end_date).toLocaleDateString();
    return `${start} - ${end}`;
});

const statusClass = computed(() => {
    switch (props.tournament?.status) {
        case 'upcoming':
            return 'bg-blue-100 text-blue-700';
        case 'live':
            return 'bg-green-100 text-green-700';
        case 'expired':
            return 'bg-red-100 text-red-600';
        default:
            return 'bg-yellow-100 text-yellow-700';
    }
});

const onImageError = (e) => {
    e.target.src = placeholderImg;
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>    