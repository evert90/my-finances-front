export const colorService = {
    getIncomesExpenses,
    getDefaultPallete
}

function getIncomesExpenses(): Array<string> {
    return ['rgb(21, 128, 61)', 'rgb(220, 38, 38)']
}

function getDefaultPallete(): Array<string> {
    return ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#2B908F", "#F9A3A4", "#90EE7E", "#69D2E7", "#C5D86D", "#C4BBAF"]
}