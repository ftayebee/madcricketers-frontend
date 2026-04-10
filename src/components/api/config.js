export const API_BASE_URL =
    window.location.href.startsWith("https://madcricketers.com") || window.location.href.startsWith("https://www.madcricketers.com") || window.location.href.startsWith("https://madcricketers.vercel.app/")
        ? "https://app.madcricketers.com/api"
        : "http://127.0.0.1:8000/api";

console.log(API_BASE_URL + " | " + window.location.href)

export const HEADERS = {
    'Content-Type': 'application/json',
};