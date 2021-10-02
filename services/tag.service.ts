import getConfig from 'next/config';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = process.browser && localStorage.getItem("apiUrl") ? `${localStorage.getItem("apiUrl")}/tags` : `${publicRuntimeConfig.apiUrl}/tags`;

export const tagService = {
    getAll
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}/`)
}