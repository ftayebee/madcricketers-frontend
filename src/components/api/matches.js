import apiClient from "./client";
import endpoints from "./endpoints";

export const fetchLiveMatches = async () => {
    try {
        const res = await apiClient.get(endpoints.matches.upcoming);
        return res.data.data;
    } catch (error) {
        console.error("Failed to load live matches:", error);
        return [];
    }
};

export const fetchCompletedMatches = async () => {
    try {
        const res = await apiClient.get(endpoints.matches.completed);
        return res.data.data;
    } catch (error) {
        console.error("Failed to load completed matches:", error);
        return [];
    }
};

export const fetchUpcomingMatches = async () => {
    return Promise.resolve([
        {
            id: 3,
            teamA: "Bangladesh",
            teamB: "Sri Lanka",
            startTime: "2025-07-20T14:00:00Z",
            status: "Upcoming",
        },
        {
            id: 4,
            teamA: "South Africa",
            teamB: "New Zealand",
            startTime: "2025-07-21T10:00:00Z",
            status: "Upcoming",
        },
    ]);
};

export const fetchMatchBySlug = async (slug) => {
    try {
        const res = await apiClient.get(endpoints.matches.detail(slug));
        return res.data.data;
    } catch (error) {
        console.error(`Failed to load match with slug ${slug}:`, error);
        return null;
    }
};
