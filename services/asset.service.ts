import { fetchWrapper } from "../helpers/fetch-wrapper";

const baseUrl = `${fetchWrapper.getApiUrl()}/assets`;

export const assetService = {
    getAll,
    deleteById,
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}/`)
}

function deleteById(id: number) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
}