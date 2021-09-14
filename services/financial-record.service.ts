import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/financial-records`;

export const financialRecordService = {
    getByType,
    save
}

function getByType() {

}

function save() {

}