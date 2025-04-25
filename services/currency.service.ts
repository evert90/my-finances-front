
export const currencyService = {
    format: format,
    reducer: reducer,
    toNumber: toNumber
}

function format(value: number) {
    if(value == undefined) {
        return "";
    }
    return Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" }).format(value);
}

function reducer(state, action) {
    let rawValue = action.value?.replace(/[^0-9]/g, "");
    let numericValue = parseFloat(rawValue) / 100;
    return { formatted: Number.isFinite(numericValue) ? currencyService.format(numericValue) : "", raw: Number.isFinite(numericValue) ? numericValue : undefined };
}

function toNumber(value: string): number | undefined {
    let rawValue = value?.replace(/[^0-9]/g, "");
    let numericValue = parseFloat(rawValue) / 100;
    return Number.isFinite(numericValue) ? numericValue : undefined
}