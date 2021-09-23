import { Period } from "../class/Period";
import moment from "moment"

export const periodService = {
    getPeriodMonths
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