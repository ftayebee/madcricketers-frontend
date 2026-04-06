export const API_BASE_URL =
    window.location.href.startsWith("https://madcricketers.com") || window.location.href.startsWith("https://madcricketers.vercel.app/")
        ? "https://app.madcricketers.com/api"
        : "http://127.0.0.1:8001/api";


export const HEADERS = {
    'Content-Type': 'application/json',
};