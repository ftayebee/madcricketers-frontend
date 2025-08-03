import apiClient from "./client";
import endpoints from "./endpoints";

export const fetchPlayerDetail = async () => {
    try {
        const res = await apiClient.get(endpoints.tournaments);
        return res.data.data;
    } catch (error) {
        console.error("Failed to load player info:", error);
        return [];
    }
};

export const playerRegistration = async (data) => {
    try {
        const res = await apiClient.post(endpoints.players.registration, data);
        return res.data;
    } catch (error) {
        console.error("Failed to register player:", error);
        return null;
    }
}
