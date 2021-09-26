import moment from "moment";
import { FinancialRecordType } from "../class/FinancialRecordType";
import { PeriodTotal } from "../class/PeriodTotal"

export const chartService = {
    periodTotalToLineBarOptions,
    periodTotalToLineBarSeries
}

function periodTotalToLineBarOptions(data: Array<PeriodTotal>): ApexCharts.ApexOptions {
    return {
        chart: {
            id: "line-bar",
            toolbar: {
                offsetY: 3
            }
        },
        xaxis: {
            categories: data.map(period => {
                const category = moment(period.start, 'YYYY-MM-DD').locale("pt-BR").format("MMMM/YYYY")
                return category.charAt(0).toUpperCase() + category.slice(1)
            }).reverse(),
            tooltip: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `R$ ${val}`,

        },
        colors: ['rgb(21, 128, 61)', 'rgb(220, 38, 38)'],
        stroke: {
            curve: 'smooth'
        },
        tooltip: {
            enabled: true,
            x: {
                show: false
            }
        }
    }
}

function periodTotalToLineBarSeries(data: Array<PeriodTotal>): Array<any> {
    return [
        {
            name: "Receitas",
            data: data.map(period => period?.totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.INCOME)?.total || 0).reverse()
        },
        {
            name: "Despesas",
            data: data.map(period => period?.totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.EXPENSE)?.total || 0).reverse()
        }
    ]
}