import { Period } from "../class/Period";
import moment from "moment"
import { PeriodTotal } from "../class/PeriodTotal";
import { PeriodTagTotal } from "../class/PeriodTagTotal";

export const periodService = {
    getPeriodMonths,
    getPeriodTotalMonths,
    getPeriodTagTotalMonths
}

function getPeriodMonths(meses: number): Array<Period> {
    let periodos: Array<Period> = [];

    for(let i = -1; i - 1 < meses - 2; i++) {
        let dataInicial = moment()
            .startOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        let dataFinal = moment()
            .endOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        periodos.push(new Period(dataInicial, dataFinal, []))
    }

    return periodos
}

function getPeriodTotalMonths(meses: number): Array<PeriodTotal> {
    let periodos: Array<PeriodTotal> = [];

    for(let i = -1; i - 1 < meses - 2; i++) {
        let dataInicial = moment()
            .startOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        let dataFinal = moment()
            .endOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        periodos.push(new PeriodTotal(dataInicial, dataFinal, []))
    }

    return periodos
}

function getPeriodTagTotalMonths(meses: number): Array<PeriodTagTotal> {
    let periodos: Array<PeriodTagTotal> = [];

    for(let i = -1; i - 1 < meses - 2; i++) {
        let dataInicial = moment()
            .startOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        let dataFinal = moment()
            .endOf('month')
            .subtract(i, 'months')
            .format('YYYY-MM-DD');

        periodos.push(new PeriodTagTotal(dataInicial, dataFinal, []))
    }

    return periodos
}