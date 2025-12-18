<template>
    <router-link :to="`/match/detail/${match.id}`" class="no-underline">
        <div class="match-card-container bg-white p-3 rounded-md shadow-sm m-3">
            <a :href="match.url" class="match-card-wrapper">
                <div class="grid grid-cols-3 gap-6">
                    <!-- First Team -->
                    <div class="team-info">
                        <div class="flex justify-start items-center">
                            <img v-if="match?.team_a?.logo && !match?.team_a?.logo.includes('team-dummy')" :src="match?.team_a?.logo" @error="onImageError($event)"
                                :alt="match?.team_a?.name" class="w-12 h-12 rounded-full" />
                            <div v-else class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                                <span class="font-bold text-green-700 text-lg">{{ getTeamAbbreviation(match.team_a?.name)
                                }}</span>
                            </div>
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
                        <span v-if="match.result_summary" class="winner block"
                            style="padding-bottom: 6px;color: #8FA31E;">
                            {{ match.result_summary }}
                        </span>
                        <span v-else class="reason" style="color: rgb(0 121 44);">
                            <span>{{ match.match_date }}</span>
                        </span>
                    </div>

                    <div class="result text-center" v-else-if="match.status === 'live'">
                        <span
                            class="inline-flex items-center justify-center space-x-1 text-red-500 font-bold text-sm">
                            <span class="h-2 w-2 rounded-full bg-red-500 animate-ping-fast"></span>
                            <span>LIVE</span>
                        </span>
                    </div>

                    <div class="result text-center" v-else>
                        <span class="winner block text-gray-400">Starts at </span>
                        <span class="reason text-gray-700">
                            {{ match?.match_date }}
                            {{ getTimeRemaining(match.date, match.match_time) }}
                        </span>
                    </div>

                    <!-- Second Team -->
                    <div class="team-info" style="align-items: flex-end;">
                        <div class="flex justify-end items-center">
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
                            <img v-if="match?.team_b?.logo && !match?.team_b?.logo.includes('team-dummy')" :src="match?.team_b?.logo" @error="onImageError($event)"
                                :alt="match?.team_b?.name" class="w-12 h-12 rounded-full" />

                            <div v-else class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                                <span class="font-bold text-red-700 text-lg">{{ getTeamAbbreviation(match.team_b?.name)
                                }}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </a>
        </div>
    </router-link>
</template>

<script setup>
import { getTeamAbbreviation } from './../../helpers/MatchHelper'

const props = defineProps({
    match: {
        type: Object,
        required: true,
    }
});

const getTimeRemaining = (date, time) => {
    if (!date) return 'TBD';

    const now = new Date();
    const matchDate = new Date(date);

    // Set match date to today's date with the provided time
    if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        const [hour, minute] = time.includes('PM')
            ? [hours === 12 ? 12 : hours + 12, minutes]
            : [hours === 12 ? 0 : hours, minutes];
        matchDate.setHours(hour, minute || 0, 0, 0);
    } else {
        // If no time specified, assume start of day
        matchDate.setHours(0, 0, 0, 0);
    }

    // Check if match is today
    const isToday = matchDate.toDateString() === now.toDateString();
    const isPast = matchDate < now;

    // If time is provided and match is today
    if (time && isToday && !isPast) {
        const diffMs = matchDate - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 0) {
            return `Starts in ${diffHours}h ${diffMinutes}m`;
        } else if (diffMinutes > 0) {
            return `Starts in ${diffMinutes}m`;
        } else {
            return 'Starting soon';
        }
    }

    // If time is empty but date is today
    if (!time && isToday) {
        const diffMs = matchDate - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours > 12) {
            return 'Today (time TBD)';
        } else {
            return `Today in ${diffHours}h`;
        }
    }

    // If time is empty and date is not today
    if (!time) {
        // Format date as "Mon, 18 Dec"
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return matchDate.toLocaleDateString('en-US', options);
    }

    // For future dates with time
    if (!isPast) {
        const diffMs = matchDate - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Tomorrow
            return `Tomorrow at ${formatTime(time)}`;
        } else if (diffDays === 1) {
            return `In ${diffDays} day`;
        } else if (diffDays < 7) {
            return `In ${diffDays} days`;
        } else {
            // Show date and time for dates further in future
            const options = { weekday: 'short', day: 'numeric', month: 'short' };
            const dateStr = matchDate.toLocaleDateString('en-US', options);
            return `${dateStr} at ${formatTime(time)}`;
        }
    }

    // For past matches
    return formatMatchDateTime(date, time);
};

const formatTime = (timeStr) => {
    if (!timeStr) return '';

    if (timeStr.includes('AM') || timeStr.includes('PM')) {
        return timeStr;
    }

    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes ? `:${minutes.toString().padStart(2, '0')}` : '';

    return `${displayHours}${displayMinutes} ${period}`;
};

const formatMatchDateTime = (date, time) => {
    const matchDate = new Date(date);
    const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };

    let result = matchDate.toLocaleDateString('en-US', options);

    if (time) {
        result += ` at ${formatTime(time)}`;
    }

    return result;
};

const onImageError = (e) => {
    e.target.src = '/assets/img/unknown_team.png';
};
</script>

<style scoped></style>
