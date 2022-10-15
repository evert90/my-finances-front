
export const currencyService = {
    format: format
}

function format(value: number) {
    return Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" }).format(value);
}