import apiClient from './client';
import endpoints from './endpoints';

export const fetchTournaments = async () => {
    try {
        const res = await apiClient.get(endpoints.tournaments);
        return res.data.data;
    } catch (error) {
        console.error('Failed to load tournaments:', error);
        return [];
    }
};

export const fetchTournamentBySlug = async (slug) => {
    try {
        const res = await apiClient.get(`${endpoints.tournaments}/${slug}`);
        return res.data.data;
    } catch (error) {
        console.error(`Failed to load tournament with slug ${slug}:`, error);
        return null;
    }
}