import moment from "moment";
import { ChartOnDemand } from "../class/ChartOnDemand";
import { FinancialRecordType } from "../class/FinancialRecordType";
import { PeriodTagTotal } from "../class/PeriodTagTotal";
import { PeriodTotal } from "../class/PeriodTotal"
import { TagTotal } from "../class/TagTotal";
import { ToastContextType } from "../components/Toast/ToastProvider";
import { financialRecordService } from "./financial-record.service";

export const chartService = {
    periodTotalToLineBarOptions,
    periodTotalToLineBarSeries,
    periodTagTotalToLineBarSeries,
    setChartValues
}

function periodTotalToLineBarOptions(data: Array<PeriodTotal> | Array<PeriodTagTotal>, colors?: Array<string>): ApexCharts.ApexOptions {
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
        yaxis: {
            tickAmount: 5,
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `R$ ${val}`,

        },
        colors,
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

function periodTagTotalToLineBarSeries(tags: Array<string>, data: Array<PeriodTagTotal>): Array<any> {
    return tags.map( tag => (
        {
            name: tag,
            data: data.map(period => period?.totals?.find(it => it?.tag?.name == tag)?.total || 0).reverse()
        }
    ))
}

async function setChartValues(chartOnDemand: ChartOnDemand, toast?: ToastContextType) {
    const promises: Array<Promise<any>> = []

    chartOnDemand.data.forEach(period => {
        promises.push(
            financialRecordService.getTotalByPeriodAndTags(period.start, period.end, chartOnDemand.tags.map(tag => tag.id))
            .then((totals: Array<TagTotal>) => {
                period.totals = totals
            })
            .catch(error => {
                toast?.pushError("Erro ao consultar totais de receitas/despesas: " + error, 7000, "truncate-2-lines")
            }).finally(() => {})
        )
    })

    await Promise.all(promises)
}