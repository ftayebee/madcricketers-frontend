import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Enable Pusher logging
Pusher.logToConsole = import.meta.env.DEV; // Only in development

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
    forceTLS: true,
    encrypted: true,
    wsHost: import.meta.env.VITE_PUSHER_HOST || undefined,
    wsPort: import.meta.env.VITE_PUSHER_PORT || undefined,
    wssPort: import.meta.env.VITE_PUSHER_PORT || undefined,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
        }
    }
});

// Debug Echo events
if (import.meta.env.DEV) {
    echo.connector.pusher.connection.bind('connecting', () => {
        console.log('🔄 Connecting to Pusher...');
    });

    echo.connector.pusher.connection.bind('connected', () => {
        console.log('✅ Connected to Pusher');
    });

    echo.connector.pusher.connection.bind('disconnected', () => {
        console.log('❌ Disconnected from Pusher');
    });

    echo.connector.pusher.connection.bind('error', (error) => {
        console.error('❌ Pusher connection error:', error);
    });
}

export default echo;