import { Period } from "../class/Period";
import moment from "moment"
import { PeriodTotal } from "../class/PeriodTotal";
import { PeriodTagTotal } from "../class/PeriodTagTotal";
import { FinancialRecordType } from "../class/FinancialRecordType";
import { PeriodType } from "../class/PeriodType";

export const periodService = {
    getPeriodMonths,
    getPeriodTotalDays,
    getPeriodTotalMonths,
    getPeriodTotalYears,
    getPeriodTagTotalDays,
    getPeriodTagTotalMonths,
    getPeriodTagTotalYears,
    getPeriodIncomeTotal,
    getPeriodExpenseTotal,
    periodTypeToDateFormat,
    periodTypeToLabel
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

function getPeriodTotalDays(days: number, type: string): Array<PeriodTotal> {
    let periodos: Array<PeriodTotal> = [];

    if(type == 'donut' || type == 'pie') {
        let dataInicial = moment()
        .subtract(days, 'days')
        .format('YYYY-MM-DD');

        let dataFinal = moment()
            .format('YYYY-MM-DD');

        periodos.push(new PeriodTotal(dataInicial, dataFinal, null))
    } else {

        for(let i = 0; i < days; i++) {
            let dataInicial = moment()
                .startOf('day')
                .subtract(i, 'days')
                .format('YYYY-MM-DD');

            let dataFinal = moment()
                .startOf('day')
                .subtract(i, 'days')
                .format('YYYY-MM-DD');

            periodos.push(new PeriodTotal(dataInicial, dataFinal, null))
        }

    }

    return periodos
}


function getPeriodTotalMonths(months: number, type: string): Array<PeriodTotal> {
    let periodos: Array<PeriodTotal> = [];

    if(type == 'donut' || type == 'pie') {
        let dataInicial = moment()
        .endOf('month')
        .subtract(months, 'months')
        .format('YYYY-MM-DD');

        let dataFinal = moment()
            .endOf('month')
            .format('YYYY-MM-DD');

        periodos.push(new PeriodTotal(dataInicial, dataFinal, null))
    } else {

        for(let i = 0; i < months; i++) {
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

    }

    return periodos
}

function getPeriodTotalYears(years: number, type: string): Array<PeriodTotal> {
    let periodos: Array<PeriodTotal> = [];

    if(type == 'donut' || type == 'pie') {
        let dataInicial = moment()
        .startOf('year')
        .subtract(years - 1, 'years')
        .format('YYYY-MM-DD');

        let dataFinal = moment()
            .endOf('year')
            .format('YYYY-MM-DD');

        periodos.push(new PeriodTotal(dataInicial, dataFinal, null))
    } else {

        for(let i = 0; i < years; i++) {
            let dataInicial = moment()
                .startOf('year')
                .subtract(i, 'years')
                .format('YYYY-MM-DD');

            let dataFinal = moment()
                .endOf('year')
                .subtract(i, 'years')
                .format('YYYY-MM-DD');

            periodos.push(new PeriodTotal(dataInicial, dataFinal, null))
        }
    }

    return periodos
}

function getPeriodTagTotalDays(days: number, type: string): Array<PeriodTagTotal> {
    let periodos: Array<PeriodTagTotal> = [];

    if(type == 'donut' || type == 'pie') {
        let dataInicial = moment()
        .subtract(days, 'days')
        .format('YYYY-MM-DD');

        let dataFinal = moment()
            .format('YYYY-MM-DD');

        periodos.push(new PeriodTagTotal(dataInicial, dataFinal, null))
    } else {

        for(let i = 0; i < days; i++) {
            let dataInicial = moment()
                .startOf('day')
                .subtract(i, 'days')
                .format('YYYY-MM-DD');

            let dataFinal = moment()
                .startOf('day')
                .subtract(i, 'days')
                .format('YYYY-MM-DD');

            periodos.push(new PeriodTagTotal(dataInicial, dataFinal, null))
        }

    }

    return periodos
}


function getPeriodTagTotalMonths(months: number, type: string): Array<PeriodTagTotal> {
    let periodos: Array<PeriodTagTotal> = [];

    if(type == 'donut' || type == 'pie') {
        let dataInicial = moment()
        .endOf('month')
        .subtract(months, 'months')
        .format('YYYY-MM-DD');

        let dataFinal = moment()
            .endOf('month')
            .format('YYYY-MM-DD');

        periodos.push(new PeriodTagTotal(dataInicial, dataFinal, null))
    } else {

        for(let i = 0; i < months; i++) {
            let dataInicial = moment()
                .startOf('month')
                .subtract(i, 'months')
                .format('YYYY-MM-DD');

            let dataFinal = moment()
                .subtract(i, 'months')
                .endOf('month')
                .format('YYYY-MM-DD');

            periodos.push(new PeriodTagTotal(dataInicial, dataFinal, null))
        }

    }

    return periodos
}

function getPeriodTagTotalYears(years: number, type: string): Array<PeriodTagTotal> {
    let periodos: Array<PeriodTagTotal> = [];

    if(type == 'donut' || type == 'pie') {
        let dataInicial = moment()
        .startOf('year')
        .subtract(years - 1, 'years')
        .format('YYYY-MM-DD');

        let dataFinal = moment()
            .endOf('year')
            .format('YYYY-MM-DD');

        periodos.push(new PeriodTagTotal(dataInicial, dataFinal, null))
    } else {

        for(let i = 0; i < years; i++) {
            let dataInicial = moment()
                .startOf('year')
                .subtract(i, 'years')
                .format('YYYY-MM-DD');

            let dataFinal = moment()
                .endOf('year')
                .subtract(i, 'years')
                .format('YYYY-MM-DD');

            periodos.push(new PeriodTagTotal(dataInicial, dataFinal, null))
        }
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

function periodTypeToDateFormat(periodType: PeriodType) {
    if(PeriodType[periodType] == PeriodType.DAILY) {
        return "DD/MM"
    } else if(PeriodType[periodType] == PeriodType.MONTHLY) {
        return "MMM/YYYY"
    } else if(PeriodType[periodType] == PeriodType.YEARLY) {
        return "YYYY"
    }
}

function periodTypeToLabel(periodType: PeriodType, totalPeriods: number) {
    if(PeriodType[periodType] == PeriodType.DAILY) {
        return totalPeriods > 1 ? "dias" : "dia"
    } else if(PeriodType[periodType] == PeriodType.MONTHLY) {
        return  totalPeriods > 1 ? "meses" : "mês"
    } else if(PeriodType[periodType] == PeriodType.YEARLY) {
        return  totalPeriods > 1 ? "anos" : "ano"
    }
}