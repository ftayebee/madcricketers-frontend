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
