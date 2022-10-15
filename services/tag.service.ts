import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `/tags`;

export const tagService = {
    getAll: getAll
}

function getAll(): Promise<any> {
    return fetchWrapper.get(`${baseUrl}/`)
}