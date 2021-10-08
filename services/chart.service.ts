import moment from "moment";
import { ChartOnDemand } from "../class/ChartOnDemand";
import { ChartOnDemandFilterBy } from "../class/ChartOnDemandFilterBy";
import { FinancialRecordTotal } from "../class/FinancialRecordTotal";
import { FinancialRecordType } from "../class/FinancialRecordType";
import { PeriodTagTotal } from "../class/PeriodTagTotal";
import { PeriodTotal } from "../class/PeriodTotal"
import { PeriodType } from "../class/PeriodType";
import { TagTotal } from "../class/TagTotal";
import { ToastContextType } from "../components/Toast/ToastProvider";
import { fetchWrapper } from "../helpers/fetch-wrapper";
import { currencyService } from "./currency.service";
import { financialRecordService } from "./financial-record.service";
import { periodService } from "./period.service";
import { userService } from "./user.service";

export const chartService = {
    periodTotalToChartOptions,
    periodTotalToChartSeries,
    periodTagTotalToChartSeries,
    setChartValues,
    getChartsOnDemandStorageName,
    chartOnDemandToOptions,
    chartOnDemandToSeries
}

function chartOnDemandToOptions(chart: ChartOnDemand): ApexCharts.ApexOptions {
    return periodTotalToChartOptions(
        chart.data,
        chart.type,
        chart.periodType,
        chart.filterBy,
        ChartOnDemandFilterBy[chart.filterBy] == ChartOnDemandFilterBy.INCOME_EXPENSE ? ['rgb(21, 128, 61)', 'rgb(220, 38, 38)'] : undefined
    )

}


function chartOnDemandToSeries(chart: ChartOnDemand) {
    return ChartOnDemandFilterBy[chart.filterBy] == ChartOnDemandFilterBy.TAGS ?
        periodTagTotalToChartSeries(chart.tags.map(tag => tag.name), chart.data as Array<PeriodTagTotal>, chart.type) :
        periodTotalToChartSeries(chart.data as Array<PeriodTotal>, chart.type)
}

function periodTotalToChartOptions(data: Array<PeriodTotal> | Array<PeriodTagTotal>, chartType: string, periodType: any, filterBy: string, colors?: Array<string>): ApexCharts.ApexOptions {
    console.log("filterby", filterBy)
    if(chartType == "bar") {
        return getPeriodTotalToBar(data, periodType, colors)
    } else if(chartType == "line" || chartType == "area") {
        return getPeriodTotalToLineArea(data, periodType, colors)
    }

    const dataDonutPie = data as Array<PeriodTagTotal>
    return getPeriodTotalToDonutPie(dataDonutPie, filterBy, colors)
}

function getPeriodTotalToLineArea(data: Array<PeriodTotal> | Array<PeriodTagTotal>, periodType: any, colors?: Array<string>): ApexCharts.ApexOptions {
    return {
        chart: {
            toolbar: {
                offsetY: 3
            }
        },
        xaxis: {
            categories: data.map(period => {
                const category = moment(period.start, 'YYYY-MM-DD').locale("pt-BR").format(periodService.periodTypeToDateFormat(periodType))
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
            formatter: (val) => { const valNumber: number = val as number; return valNumber ? currencyService.format(valNumber) : undefined },
        },
        colors,
        stroke: {
            curve: 'smooth',
        },
        tooltip: {
            enabled: true,
            x: {
                show: false
            },
            y: {
                formatter: (val) => val ? currencyService.format(val) : undefined,
            }
        }
    }
}

function getPeriodTotalToBar(data: Array<PeriodTotal> | Array<PeriodTagTotal>, periodType: any, colors?: Array<string>): ApexCharts.ApexOptions {
    return {
        chart: {
            toolbar: {
                offsetY: 3
            }
        },
        xaxis: {
            categories: data.map(period => {
                const category = moment(period.start, 'YYYY-MM-DD').locale("pt-BR").format(periodService.periodTypeToDateFormat(periodType))
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
            formatter: (val) => {const valNumber: number = val as number; return `${valNumber?.toFixed(2).toString().replace(".", ",")}`},
            offsetY: -20,
            style: {
              fontSize: '10px',
              colors: ["#304758"]
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                  position: 'top', // top, center, bottom
                },
                columnWidth: "70%",
            }

        },
        colors,
        stroke: {
            curve: 'smooth',
            colors: ['transparent'],
            width: 4,
        },
        tooltip: {
            enabled: true,
            x: {
                show: false
            },
            y: {
                formatter: (val) => val ? currencyService.format(val) : undefined,
            }
        }
    }
}

function getPeriodTotalToDonutPie(data: Array<PeriodTagTotal>, filterBy: string, colors?: Array<string>): ApexCharts.ApexOptions {
    return {
        chart: {
            toolbar: {
                offsetY: 3
            }
        },
        labels: ChartOnDemandFilterBy[filterBy] == ChartOnDemandFilterBy.TAGS ?
            data?.[0]?.totals?.map(it => it.tag.name)?.reverse() :
            ["Receitas", "Despesas"],
        dataLabels: {
            enabled: true
        },
        colors,
        stroke: {
            curve: 'smooth',
        },
        tooltip: {
            enabled: true,
            x: {
                show: false
            },
            y: {
                formatter: (val) => val ? currencyService.format(val) : undefined,
            }

        }
    }
}

function periodTotalToChartSeries(data: Array<PeriodTotal>, chartType: string): Array<any> {
    return chartType == "donut" || chartType == "pie" ?
        data?.[0]?.totals?.map(it => it.total || 0)?.reverse() || [] :
        [
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

function periodTagTotalToChartSeries(tags: Array<string>, data: Array<PeriodTagTotal>, chartType: string): Array<any> {
    return chartType == "donut" || chartType == "pie" ?
        data?.[0]?.totals?.map(it => it.total || 0)?.reverse() || [] :
        tags.map( tag => (
            {
                name: tag,
                data: data.map(period => period?.totals?.find(it => it?.tag?.name == tag)?.total || 0).reverse()
            }
        ))
}

async function setChartValues(chartOnDemand: ChartOnDemand, toast?: ToastContextType) {
    const promises: Array<Promise<any>> = []

    if(PeriodType[chartOnDemand.periodType] == PeriodType.DAILY) {
        chartOnDemand.data = ChartOnDemandFilterBy[chartOnDemand.filterBy] == ChartOnDemandFilterBy.TAGS ?
            periodService.getPeriodTagTotalDays(chartOnDemand.totalPeriods, chartOnDemand.type) :
            periodService.getPeriodTotalDays(chartOnDemand.totalPeriods, chartOnDemand.type)
    } else if(PeriodType[chartOnDemand.periodType] == PeriodType.MONTHLY) {
        chartOnDemand.data = ChartOnDemandFilterBy[chartOnDemand.filterBy] == ChartOnDemandFilterBy.TAGS ?
            periodService.getPeriodTagTotalMonths(chartOnDemand.totalPeriods, chartOnDemand.type) :
            periodService.getPeriodTotalMonths(chartOnDemand.totalPeriods, chartOnDemand.type)
    } else if(PeriodType[chartOnDemand.periodType] == PeriodType.YEARLY) {
        chartOnDemand.data = ChartOnDemandFilterBy[chartOnDemand.filterBy] == ChartOnDemandFilterBy.TAGS ?
            periodService.getPeriodTagTotalYears(chartOnDemand.totalPeriods, chartOnDemand.type) :
            periodService.getPeriodTotalYears(chartOnDemand.totalPeriods, chartOnDemand.type)
    }

    chartOnDemand.data.forEach(period => {
        let promise: Promise<any> = ChartOnDemandFilterBy[chartOnDemand.filterBy] == ChartOnDemandFilterBy.TAGS ?
            financialRecordService.getTotalByPeriodAndTags(period.start, period.end, chartOnDemand.tags.map(tag => tag.id)) :
            financialRecordService.getTotalByPeriod(period.start, period.end)
        promises.push(
            promise
            .then((totals: Array<TagTotal> | Array<FinancialRecordTotal>) => {
                console.log("totals", totals)
                period.totals = totals
            })
            .catch(error => {
                toast?.pushError("Erro ao consultar dados para gerar gráfico: " + error, 7000, "truncate-2-lines")
            }).finally(() => {})
        )
    })

    await Promise.all(promises)
}

function getChartsOnDemandStorageName() {
    return `chartsOnDemandV3_${fetchWrapper.getApiUrl()}_${userService.getUserValue()?.user?.id}`
}