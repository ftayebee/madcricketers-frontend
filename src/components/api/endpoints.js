export default {
    matches: {
        all: "/matches",
        completed: "/matches/completed",
        upcoming: "/matches/upcoming",
        live: "/matches/live",
        liveData: "/matches/get-team-data",
        scorecard: "/matches/scorecard",
        detail: (slug) => `/matches/detail/${slug}`,
        teamInfo: (id) => `/matches/detail/team-info/${id}`,
        yetToBat: (id) => `/matches/yet-to-bat/${id}`,
        headToHead: (id) => `/matches/head-to-head/${id}`,
    },
    tournaments: {
        all: "/tournaments",
        detail: (slug) => `/tournaments/${slug}`,
        matches: (slug) => `/tournaments/${slug}/matches`,
        squads: (slug) => `/tournaments/${slug}/squads`,
        pointsTable: (slug) => `/tournaments/${slug}/points-table`,
    },
    teams: {
        all: "/teams",
        detail: (id) => `/team/${id}`,
        logo: (id) => `/team/${id}/logo`,
    },
    players: {
        all: "/players",
        keyStats: "/players/key-stats",
        detail: (slug) => `/players/detail/${slug}`,
        stats: (slug) => `/players/detail/${slug}/stats`,
        registration: "/registration",
    },
    venues: {
        all: "/venues",
        detail: (id) => `/venue/${id}`,
    },
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        profile: "/auth/profile",
    },
    playerAuth: {
        login: "/player/login",
        logout: "/player/logout",
        profile: "/player/profile",
        summary: "/player/stats/summary",
        matches: "/player/stats/matches",
        tournaments: "/player/stats/tournaments",
    },
    news: {
        all: "/news",
        detail: (slug) => `/news/${slug}`,
    },
};
