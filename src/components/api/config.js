export const API_BASE_URL =
    window.location.href.startsWith("https://madcricketers.com")
        ? "https://app.madcricketers.com/api"
        : "http://127.0.0.1:8000/api";


export const HEADERS = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}` // Add if needed
};