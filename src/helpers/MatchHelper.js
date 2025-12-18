/**
 * MatchHelper.js
 * Reusable helper functions for match-related operations
 */

/**
 * Get team abbreviation from team name
 * @param {string} teamName - Full team name
 * @returns {string} Abbreviated team name (3 characters)
 */
export const getTeamAbbreviation = (teamName) => {
    if (!teamName) return 'TBD';
    return teamName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 3);
};

/**
 * Format match date to readable string
 * @param {string} dateString - Date string
 * @returns {string} Formatted date string
 */
export const formatMatchDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
};

/**
 * Format match date with time
 * @param {string} dateString - Date string
 * @param {string} timeString - Time string
 * @returns {string} Formatted date and time string
 */
export const formatMatchDateTime = (dateString, timeString) => {
    if (!dateString) return 'TBD';
    
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
    
    if (!timeString) return dateStr;
    
    return `${dateStr} at ${formatTime(timeString)}`;
};

/**
 * Format time to 12-hour format
 * @param {string} timeStr - Time string (can be 24h or 12h format)
 * @returns {string} Formatted 12-hour time string
 */
export const formatTime = (timeStr) => {
    if (!timeStr) return '';
    
    // Handle already formatted times
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
        return timeStr;
    }
    
    // Convert 24-hour to 12-hour format
    try {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes ? `:${minutes.toString().padStart(2, '0')}` : '';
        
        return `${displayHours}${displayMinutes} ${period}`;
    } catch {
        return timeStr;
    }
};

/**
 * Get time remaining until match starts
 * @param {string} date - Match date
 * @param {string} time - Match time
 * @param {string} status - Match status (optional)
 * @returns {string} Time remaining string
 */
export const getTimeRemaining = (date, time, status = 'upcoming') => {
    if (!date) return 'Date TBD';
    
    const now = new Date();
    const matchDate = new Date(date);
    
    // Set match date time if time is provided
    if (time) {
        const parsedTime = parseTimeString(time);
        matchDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
    } else {
        matchDate.setHours(0, 0, 0, 0);
    }
    
    const isToday = matchDate.toDateString() === now.toDateString();
    const isPast = matchDate < now;
    const timeDiffMs = matchDate - now;
    
    // Check if match is live
    const isLive = status === 'live' || 
        (isPast && timeDiffMs > -8 * 60 * 60 * 1000 && timeDiffMs < 0);
    
    if (isLive) {
        return '● LIVE';
    }
    
    // Check if match just ended
    const justEnded = isPast && timeDiffMs > -24 * 60 * 60 * 1000;
    if (justEnded) {
        const hoursAgo = Math.abs(Math.floor(timeDiffMs / (1000 * 60 * 60)));
        if (hoursAgo === 0) {
            const minutesAgo = Math.abs(Math.floor(timeDiffMs / (1000 * 60)));
            return `Ended ${minutesAgo}m ago`;
        }
        return `Ended ${hoursAgo}h ago`;
    }
    
    // For upcoming matches
    if (!isPast) {
        const daysDiff = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.floor(timeDiffMs / (1000 * 60 * 60));
        const minutesDiff = Math.floor(timeDiffMs / (1000 * 60));
        
        if (daysDiff === 0) {
            // Today
            if (hoursDiff > 0) {
                return `Today in ${hoursDiff}h${minutesDiff % 60 > 0 ? ` ${minutesDiff % 60}m` : ''}`;
            } else if (minutesDiff > 0) {
                return `Today in ${minutesDiff}m`;
            } else {
                return 'Today (Starting)';
            }
        } else if (daysDiff === 1) {
            return `Tomorrow${time ? ` at ${formatTime(time)}` : ''}`;
        } else if (daysDiff < 7) {
            // This week
            const options = { weekday: 'long' };
            const dayName = matchDate.toLocaleDateString('en-US', options);
            return `${dayName}${time ? ` at ${formatTime(time)}` : ''}`;
        } else {
            // Future date
            const options = { month: 'short', day: 'numeric' };
            const dateStr = matchDate.toLocaleDateString('en-US', options);
            return `${dateStr}${time ? ` at ${formatTime(time)}` : ''}`;
        }
    }
    
    // For past matches (older than 24 hours)
    if (isPast) {
        const options = { month: 'short', day: 'numeric' };
        return matchDate.toLocaleDateString('en-US', options);
    }
    
    return formatTime(time) || 'Time TBD';
};

/**
 * Parse time string to hours and minutes
 * @param {string} timeStr - Time string
 * @returns {object} Object with hours and minutes
 */
export const parseTimeString = (timeStr) => {
    let hours = 0, minutes = 0;
    
    if (timeStr.includes(':')) {
        const parts = timeStr.split(':');
        hours = parseInt(parts[0]) || 0;
        minutes = parseInt(parts[1]) || 0;
        
        // Handle 12-hour format with AM/PM
        if (timeStr.toUpperCase().includes('PM') && hours < 12) {
            hours += 12;
        }
        if (timeStr.toUpperCase().includes('AM') && hours === 12) {
            hours = 0;
        }
    } else {
        hours = parseInt(timeStr) || 0;
    }
    
    return { hours, minutes };
};

/**
 * Get unique tournaments from matches array
 * @param {Array} matches - Array of match objects
 * @returns {Array} Array of unique tournament names
 */
export const getUniqueTournaments = (matches) => {
    const tournaments = new Set();
    matches.forEach(match => {
        if (match.tournament) {
            const tournamentName = typeof match.tournament === 'object'
                ? match.tournament.name || match.tournament
                : match.tournament;
            if (tournamentName && tournamentName !== 'All Tournaments') {
                tournaments.add(tournamentName);
            }
        }
    });
    return Array.from(tournaments).sort();
};

/**
 * Get unique dates from matches array
 * @param {Array} matches - Array of match objects
 * @returns {Array} Array of unique formatted dates
 */
export const getUniqueDates = (matches) => {
    const dates = new Set();
    matches.forEach(match => {
        if (match.date) dates.add(formatMatchDate(match.date));
    });
    return Array.from(dates).sort((a, b) => {
        const dateA = new Date(a.split(', ').slice(1).join(', '));
        const dateB = new Date(b.split(', ').slice(1).join(', '));
        return dateA - dateB;
    });
};

/**
 * Sort matches by date (closest first for upcoming, most recent first for completed)
 * @param {Array} matches - Array of match objects
 * @param {string} type - 'upcoming' or 'completed'
 * @returns {Array} Sorted array of matches
 */
export const sortMatchesByDate = (matches, type = 'upcoming') => {
    return [...matches].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (type === 'upcoming') {
            // Upcoming: closest first
            if (dateA.getTime() === dateB.getTime()) {
                return (a.match_time || '').localeCompare(b.match_time || '');
            }
            return dateA - dateB;
        } else {
            // Completed: most recent first
            return dateB - dateA;
        }
    });
};

/**
 * Filter matches by tournament and search query
 * @param {Array} matches - Array of match objects
 * @param {string} selectedTournament - Selected tournament filter
 * @param {string} searchQuery - Search query
 * @param {string} searchField - Field to search in (default: 'teams')
 * @returns {Array} Filtered array of matches
 */
export const filterMatches = (matches, selectedTournament = 'All Tournaments', searchQuery = '', searchField = 'teams') => {
    let filtered = [...matches].filter(match => match && match.team_a && match.team_b);
    
    // Filter by tournament
    if (selectedTournament !== 'All Tournaments') {
        filtered = filtered.filter(match => {
            const matchTournament = typeof match.tournament === 'object'
                ? match.tournament.name || match.tournament
                : match.tournament;
            return matchTournament === selectedTournament;
        });
    }
    
    // Filter by search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(match => {
            if (searchField === 'teams') {
                return (
                    match.team_a?.name?.toLowerCase().includes(query) ||
                    match.team_b?.name?.toLowerCase().includes(query)
                );
            } else if (searchField === 'all') {
                return (
                    match.team_a?.name?.toLowerCase().includes(query) ||
                    match.team_b?.name?.toLowerCase().includes(query) ||
                    (typeof match.tournament === 'string' ? match.tournament.toLowerCase() :
                        match.tournament?.name?.toLowerCase() || '').includes(query) ||
                    match.venue?.toLowerCase().includes(query)
                );
            }
            return true;
        });
    }
    
    return filtered;
};

/**
 * Format match score for display
 * @param {object} match - Match object
 * @returns {string} Formatted score string
 */
export const formatMatchScore = (match) => {
    if (!match) return '';
    
    const teamAScore = match.team_a_score || 0;
    const teamBScore = match.team_b_score || 0;
    const teamAWickets = match.team_a_wickets || 0;
    const teamBWickets = match.team_b_wickets || 0;
    
    return `${teamAScore}/${teamAWickets} - ${teamBScore}/${teamBWickets}`;
};

/**
 * Get match status badge class based on status
 * @param {string} status - Match status
 * @returns {object} Tailwind classes for badge
 */
export const getMatchStatusClasses = (status) => {
    const baseClasses = 'text-xs font-medium px-2 py-1 rounded';
    
    switch (status) {
        case 'live':
            return `${baseClasses} bg-red-100 text-red-800`;
        case 'upcoming':
            return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'completed':
            return `${baseClasses} bg-green-100 text-green-800`;
        default:
            return `${baseClasses} bg-gray-100 text-gray-800`;
    }
};

/**
 * Get match result text
 * @param {object} match - Match object
 * @returns {string} Result text
 */
export const getMatchResult = (match) => {
    if (!match || !match.team_a || !match.team_b) return '';
    
    const teamAScore = match.team_a_score || 0;
    const teamBScore = match.team_b_score || 0;
    
    if (teamAScore > teamBScore) {
        return `${match.team_a.name} won by ${teamAScore - teamBScore} runs`;
    } else if (teamBScore > teamAScore) {
        return `${match.team_b.name} won by ${teamBScore - teamAScore} runs`;
    } else {
        return 'Match tied';
    }
};

/**
 * Check if match is today
 * @param {string} dateString - Date string
 * @returns {boolean} True if date is today
 */
export const isToday = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const date = new Date(dateString);
    return today.toDateString() === date.toDateString();
};

/**
 * Check if match is tomorrow
 * @param {string} dateString - Date string
 * @returns {boolean} True if date is tomorrow
 */
export const isTomorrow = (dateString) => {
    if (!dateString) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(dateString);
    return tomorrow.toDateString() === date.toDateString();
};

export default {
    getTeamAbbreviation,
    formatMatchDate,
    formatMatchDateTime,
    formatTime,
    getTimeRemaining,
    parseTimeString,
    getUniqueTournaments,
    getUniqueDates,
    sortMatchesByDate,
    filterMatches,
    formatMatchScore,
    getMatchStatusClasses,
    getMatchResult,
    isToday,
    isTomorrow
};