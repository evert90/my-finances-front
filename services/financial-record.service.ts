import getConfig from 'next/config';
import { FinancialRecord } from '../classes/FinancialRecord';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/financial-records`;

export const financialRecordService = {
    getAll,
    getByPeriod,
    getTotal,
    getTotalByPeriod,
    save
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}/`)
}

function getByPeriod(start: string, end: string) {
    return fetchWrapper.get(`${baseUrl}/search?` + new URLSearchParams({ start, end }))
}

function getTotal() {
    return fetchWrapper.get(`${baseUrl}/report/total`)
}

function getTotalByPeriod(start: string, end: string) {
    return fetchWrapper.get(`${baseUrl}/report/total/period?` + new URLSearchParams({ start, end }))
}

function save(financialRecord: FinancialRecord) {
    return fetchWrapper.post(`${baseUrl}/`, financialRecord)
        .then((response: FinancialRecord) => {
            return response;
        });
}