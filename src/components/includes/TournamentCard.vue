<template>
    <router-link :to="`/tournaments/${tournament.slug}`" class="no-underline group block">
        <div class="bg-white rounded-xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden cursor-pointer">

            <!-- Colored status strip -->
            <div class="h-0.5 w-full" :class="stripColor"></div>

            <div class="flex items-center gap-3 p-3">

                <!-- Logo -->
                <div class="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <img v-if="tournament.logo && !tournament.logo.includes('team-dummy')"
                        :src="tournament.logo" @error="onImgError($event)"
                        class="w-full h-full object-cover" alt="" />
                    <svg v-else class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor"
                        stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                    </svg>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-800 m-0 truncate leading-tight group-hover:text-red-600 transition-colors">
                        {{ tournament.name }}
                    </p>
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                        <span v-if="tournament.format"
                            class="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium uppercase tracking-wide">
                            {{ tournament.format }}
                        </span>
                        <span class="text-xs text-slate-400">{{ formattedDate }}</span>
                    </div>
                </div>

                <!-- Right: Status + matches count -->
                <div class="flex flex-col items-end gap-1 flex-shrink-0">
                    <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full capitalize', statusClass]">
                        {{ tournament.status }}
                    </span>
                    <span v-if="tournament.matches_count" class="text-xs text-slate-400">
                        {{ tournament.matches_count }} matches
                    </span>
                </div>

            </div>
        </div>
    </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    tournament: {
        type: Object,
        required: true,
    }
})

const formattedDate = computed(() => {
    if (!props.tournament.start_date) return ''
    const start = new Date(props.tournament.start_date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
    if (!props.tournament.end_date) return start
    const end = new Date(props.tournament.end_date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short'
    })
    return `${start} – ${end}`
})

const statusClass = computed(() => {
    switch (props.tournament.status) {
        case 'live':
        case 'ongoing':
            return 'bg-emerald-100 text-emerald-700'
        case 'upcoming':
            return 'bg-blue-100 text-blue-700'
        case 'completed':
        case 'expired':
            return 'bg-slate-100 text-slate-500'
        default:
            return 'bg-yellow-100 text-yellow-700'
    }
})

const stripColor = computed(() => {
    switch (props.tournament.status) {
        case 'live':
        case 'ongoing':
            return 'bg-emerald-500'
        case 'upcoming':
            return 'bg-blue-400'
        case 'completed':
        case 'expired':
            return 'bg-slate-300'
        default:
            return 'bg-yellow-400'
    }
})

const onImgError = (e) => {
    e.target.style.display = 'none'
}
</script>
