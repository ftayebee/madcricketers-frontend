import apiClient from "./client";
import endpoints from "./endpoints";

export const fetchLiveMatches = async () => {
    try {
        const res = await apiClient.get(endpoints.matches.live);
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
    try {
        const res = await apiClient.get(endpoints.matches.upcoming);
        return res.data.data;
    } catch (error) {
        console.error("Failed to load completed matches:", error);
        return [];
    }
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

export const fetchTeamInfo = async (id) => {
    try {
        const res = await apiClient.get(endpoints.matches.teamInfo(id));
        return res.data;
    } catch (error) {
        console.error(`Failed to load team form ${id}:`, error);
        return null;
    }
}


export const fetchCricketMatchData = async (payload) => {
    try {
        const res = await apiClient.get(
            endpoints.matches.liveData,
            {
                params: payload
            }
        );

        return res.data;
    } catch (error) {
        console.error('Failed to load team data:', error);
        return null;
    }
};

export const fetchMatchScorecard = async (payload) => {
    try {
        const res = await apiClient.get(
            endpoints.matches.scorecard,
            {
                params: payload
            }
        );

        return res.data;
    } catch (error) {
        console.error('Failed to load team data:', error);
        return null;
    }
}