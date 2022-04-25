
import { FinancialRecord } from '../class/FinancialRecord';
import { FinancialRecordRecurrence } from '../class/FinancialRecordRecurrence';
import { ToastContextType } from '../components/Toast/ToastProvider';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${fetchWrapper.getApiUrl()}/financial-records`;

export const financialRecordService = {
    getAll,
    getByPeriod,
    getTotal,
    getTotalByPeriod,
    getTotalByPeriodAndTags,
    save,
    deleteById,
    pay
}

function getAll(): Promise<any> {
    return fetchWrapper.get(`${baseUrl}/`)
}

function getByPeriod(start: string, end: string): Promise<any> {
    return fetchWrapper.get(`${baseUrl}/search?` + new URLSearchParams({ start, end }))
}

function getTotal(): Promise<any> {
    return fetchWrapper.get(`${baseUrl}/report/total`)
}


function getTotalByPeriod(start: string, end: string): Promise<any> {
    return fetchWrapper.get(`${baseUrl}/report/total/period?` + new URLSearchParams({ start, end }))
}

function getTotalByPeriodAndTags(start: string, end: string, tagIds: Array<number>) {
    return fetchWrapper.get(`${baseUrl}/report/total/period/tag?` + new URLSearchParams({ start, end, tagIds: tagIds.join(",") }))
}

function save(financialRecord: FinancialRecord | FinancialRecordRecurrence): Promise<FinancialRecord> {
    return fetchWrapper.post(`${baseUrl}/`, financialRecord)
        .then((response: FinancialRecord) => {
            return response;
        });
}

function pay(financialRecord: FinancialRecord, toast: ToastContextType) {
    let financialRecordCopy: FinancialRecord = {...financialRecord}

    financialRecordCopy.paid = true

    return save(financialRecordCopy)
        .then((response: FinancialRecord) => {
            financialRecord.paid = response.paid
            toast.pushSuccess("Pagamento salvo com sucesso", 5000)
        })
        .catch(error => {
            toast?.pushError("Erro ao salvar pagamento. " + error, 7000, "truncate-2-lines")
        });
}

function deleteById(id: number): Promise<any> {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
}