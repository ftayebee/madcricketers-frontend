<template>
    <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <!-- Label bar -->
        <div class="px-4 py-2 bg-slate-800 flex items-center justify-between">
            <span class="text-xs font-bold text-white uppercase tracking-wide">{{ title }}</span>
        </div>
        <!-- Content -->
        <div class="px-4 py-3 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
                <!-- Player photo -->
                <div class="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <img v-if="stat.player?.image" :src="stat.player.image"
                        @error="hideImg($event)" class="w-full h-full object-cover" />
                    <div v-else
                        class="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                        {{ abbr(stat.player?.name) }}
                    </div>
                </div>
                <!-- Name + team -->
                <div class="min-w-0">
                    <p class="text-sm font-bold text-slate-900 m-0 truncate">{{ stat.player?.name }}</p>
                    <p class="text-xs text-slate-400 m-0 truncate">{{ stat.player?.team }}</p>
                </div>
            </div>
            <!-- Value -->
            <div class="flex-shrink-0 text-right">
                <span class="text-xl font-extrabold text-red-600">{{ stat.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getTeamAbbreviation } from './../../helpers/MatchHelper'

defineProps({
    stat: { type: Object, required: true },
    title: { type: String, default: '' }
})

const abbr = (name) => getTeamAbbreviation(name)
const hideImg = (e) => { e.target.style.display = 'none' }
</script>
