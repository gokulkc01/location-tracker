// ============================================
// CONFIGURATION FILE - UPDATE NGROK URLs HERE
// ============================================

// When using ngrok for mobile testing, update this URL:
// Run: ngrok http 5000
// Copy the "Forwarding" URL (e.g., https://abc123.ngrok-free.dev)

// Set to null for localhost, or paste your ngrok URL here:
export const NGROK_BACKEND_URL = null;
// Example: export const NGROK_BACKEND_URL = 'https://your-ngrok-url.ngrok-free.dev';

// ============================================
// DO NOT MODIFY BELOW THIS LINE
// ============================================

export const getApiUrl = () => {
    // If ngrok URL is configured, use it
    if (NGROK_BACKEND_URL) {
        return `${NGROK_BACKEND_URL}/api`;
    }

    // If environment variable is set, use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Default to localhost
    return 'http://localhost:5000/api';
};

export const getSocketUrl = () => {
    // If ngrok URL is configured, use it
    if (NGROK_BACKEND_URL) {
        return NGROK_BACKEND_URL;
    }

    // If environment variable is set, use it
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL;
    }

    // Default to localhost
    return 'http://localhost:5000';
};
