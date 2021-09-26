import { Period } from "../class/Period";
import moment from "moment"
import { PeriodTotal } from "../class/PeriodTotal";

export const periodService = {
    getPeriodMonths,
    getPeriodTotalMonths
}

function getPeriodMonths(meses: number): Array<Period> {
    let periodos: Array<Period> = [];

    for(let i = -1; i - 1 < meses - 2; i++) {
        console.log("aqui", i)
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
        console.log("aquit", i)
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