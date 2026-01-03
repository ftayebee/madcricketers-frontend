/**
 * PlayerHelper.js
 * Reusable helper functions for player-related operations
 */

const formatGender = (gender) => {
    const genderMap = {
        'male': 'Male',
        'female': 'Female',
        'other': 'Other'
    }
    return genderMap[gender] || gender || 'Not Specified'
}

const formatReligion = (religion) => {
    const religionMap = {
        'islam': 'Islam',
        'hinduism': 'Hinduism',
        'christianity': 'Christianity',
        'buddhism': 'Buddhism',
        'other': 'Other'
    }
    return religionMap[religion] || religion || 'Not Specified'
}

const formatPlayerRole = (role) => {
    const roleMap = {
        'batsman': 'Batsman',
        'bowler': 'Bowler',
        'all-rounder': 'All Rounder',
        'wicketkeeper': 'Wicket Keeper'
    }
    return roleMap[role] || role || 'Not Specified'
}

const formatBattingStyle = (style) => {
    const styleMap = {
        'right-handed': 'Right-handed',
        'left-handed': 'Left-handed',
        'switch hitter': 'Switch Hitter'
    }
    return styleMap[style] || style || 'Not Specified'
}

const formatBowlingStyle = (style) => {
    const styleMap = {
        'fast': 'Fast',
        'medium': 'Medium',
        'spin': 'Spin',
        'none': 'None'
    }
    return styleMap[style] || style || 'Not Specified'
}

const formatJerseySize = (size) => {
    if (!size) return 'Not Specified'
    return size.toUpperCase()
}

const formatDate = (dateString) => {
    if (!dateString) return 'Not Provided'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export {
    formatGender,
    formatReligion,
    formatPlayerRole,
    formatBattingStyle,
    formatBowlingStyle,
    formatJerseySize,
    formatDate
}
