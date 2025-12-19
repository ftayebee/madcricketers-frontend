import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

Pusher.logToConsole = false;
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    wsHost: import.meta.env.VITE_PUSHER_HOST || `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
    wsPort: 443,
    wssPort: 443,
    enabledTransports: ['ws', 'wss'],
    disableStats: false,
});

window.Echo = echo;

export default echo;