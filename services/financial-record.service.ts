import getConfig from 'next/config';
import { FinancialRecord } from '../classes/financial-record';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/financial-records`;

export const financialRecordService = {
    getAll,
    save
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}/`)
}

function save(financialRecord: FinancialRecord) {
    return fetchWrapper.post(`${baseUrl}/`, financialRecord)
        .then((response: FinancialRecord) => {
            return response;
        });
}