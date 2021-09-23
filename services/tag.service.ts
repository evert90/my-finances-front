import getConfig from 'next/config';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/tags`;

export const tagService = {
    getAll
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}/`)
}