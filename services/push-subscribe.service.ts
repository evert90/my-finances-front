import { fetchWrapper } from "../helpers/fetch-wrapper";

const baseUrl = '/push-subscription';

const subscribeUserToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error('Push messaging is not supported');
        return;
    }

    try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register('/sw.js');

        // Request user permission for notifications
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.error('Permission not granted for Notifications');
            return;
        }

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
        });

        // Send subscription to the server
        await save(subscription);
    } catch (error) {
        console.error('Failed to subscribe user: ', error);
    }
};

async function save(subscription: any): Promise<any> {
    return fetchWrapper.post(`${baseUrl}`, subscription)
        .then((response: any) => {
            return response;
        });
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

export const pushSubscriptionService = {
    subscribeUserToPush: subscribeUserToPush
}