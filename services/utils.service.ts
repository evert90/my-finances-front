export const utilsService = {
    getNullable
}

function getNullable(value: any) {
    return value ? value : null
}