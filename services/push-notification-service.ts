import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `/push-notification`;

export const pushNotificationService = {
    sendNotificationTest: sendNotificationTest
}

function sendNotificationTest(): Promise<any> {
    return fetchWrapper.post(`${baseUrl}/`, {})
}

