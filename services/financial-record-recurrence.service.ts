import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = '/financial-record-recurrences';

export const financialRecordRecurrenceService = {
    getAll: getAll,
    deleteById: deleteById
}

function getAll(): Promise<any> {
    return fetchWrapper.get(`${baseUrl}`)
}

function deleteById(id: number): Promise<any> {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
}