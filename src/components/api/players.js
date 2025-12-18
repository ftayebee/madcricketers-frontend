import apiClient from "./client";
import endpoints from "./endpoints";

export const fetchPlayerDetail = async (slug) => {
    try {
        const endpoint = endpoints.players.detail(slug);

        const res = await apiClient.get(endpoint);
        console.log(res.data.success)
        if (res.data.success && res.data.data) {
            return res.data.data;
        } else {
            console.warn("API returned unsuccessful response:", res.data);
            return null;
        }
    } catch (error) {
        console.error("Failed to load player info:", error);
        
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error status:", error.response.status);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error message:", error.message);
        }
        
        return null;
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

export const fetchPlayerList = async () => {
    try {
        const res = await apiClient.get(endpoints.players.all);
        return res.data.data;
    } catch (error) {
        console.error("Failed to register player:", error);
        return null;
    }
}

export const fetchPlayerKeyStats = async () => {
    try {
        const res = await apiClient.get(endpoints.players.keyStats);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch player key stats:", error);
        return null;
    }
}
