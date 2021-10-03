import { Period } from "../class/Period";
import moment from "moment"
import { PeriodTotal } from "../class/PeriodTotal";
import { PeriodTagTotal } from "../class/PeriodTagTotal";
import { FinancialRecordType } from "../class/FinancialRecordType";

export const periodService = {
    getPeriodMonths,
    getPeriodTotalMonths,
    getPeriodTagTotalMonths,
    getPeriodIncomeTotal,
    getPeriodExpenseTotal
}

function getPeriodMonths(meses: number): Array<Period> {
    let periodos: Array<Period> = [];

    for(let i = -1; i < meses - 1; i++) {
        let dataInicial = moment()
            .startOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        let dataFinal = moment()
            .endOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        periodos.push(new Period(dataInicial, dataFinal, null))
    }

    return periodos
}

function getPeriodTotalMonths(meses: number): Array<PeriodTotal> {
    let periodos: Array<PeriodTotal> = [];

    for(let i = 0; i < meses; i++) {
        let dataInicial = moment()
            .startOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        let dataFinal = moment()
            .endOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        periodos.push(new PeriodTotal(dataInicial, dataFinal, null))
    }

    return periodos
}

function getPeriodTagTotalMonths(meses: number): Array<PeriodTagTotal> {
    let periodos: Array<PeriodTagTotal> = [];

    for(let i = 0; i < meses; i++) {
        let dataInicial = moment()
            .startOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        let dataFinal = moment()
            .endOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        periodos.push(new PeriodTagTotal(dataInicial, dataFinal, null))
    }

    return periodos
}

function getPeriodIncomeTotal(period: Period) {
    return period.records
        ?.filter(it => FinancialRecordType[it.type] == FinancialRecordType.INCOME)
        ?.map(it => it.value)
        ?.reduce((a, b) => a + b, 0) || 0
}

function getPeriodExpenseTotal(period: Period) {
    return period.records
        ?.filter(it => FinancialRecordType[it.type] == FinancialRecordType.EXPENSE)
        ?.map(it => it.value)
        ?.reduce((a, b) => a + b, 0) || 0
}