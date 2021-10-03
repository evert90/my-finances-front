import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${fetchWrapper.getApiUrl()}/tags`;

export const tagService = {
    getAll
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}/`)
}