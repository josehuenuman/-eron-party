import { API_BASE_URL } from '../utils/constants.js';

const VAPID_PUBLIC_KEY = 'BM8-R4-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8-8'; // Placeholder, will fetch from API or env

export const pushService = {
    // Convert VAPID key to Uint8Array
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },

    // Check if push is supported
    isSupported() {
        return 'serviceWorker' in navigator && 'PushManager' in window;
    },

    // Get current subscription
    async getSubscription() {
        if (!this.isSupported()) return null;
        const registration = await navigator.serviceWorker.ready;
        return await registration.pushManager.getSubscription();
    },

    // Subscribe to push notifications
    async subscribe() {
        if (!this.isSupported()) throw new Error('Push notifications not supported');

        try {
            // 1. Get VAPID key from backend
            const response = await fetch(`${API_BASE_URL}/push/vapid-key`, { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to get VAPID key');
            const { publicKey } = await response.json();

            // 2. Subscribe via Service Worker
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(publicKey)
            });

            // 3. Send subscription to backend
            await this.saveSubscription(subscription);

            return subscription;
        } catch (error) {
            console.error('Error subscribing to push:', error);
            throw error;
        }
    },

    // Unsubscribe
    async unsubscribe() {
        if (!this.isSupported()) return;

        try {
            const subscription = await this.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                // Optionally notify backend to remove subscription
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
            throw error;
        }
    },

    // Send subscription to backend
    async saveSubscription(subscription) {
        const response = await fetch(`${API_BASE_URL}/push/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
            credentials: 'include' // Important for auth
        });

        if (!response.ok) {
            throw new Error('Failed to save subscription on server');
        }
    }
};
