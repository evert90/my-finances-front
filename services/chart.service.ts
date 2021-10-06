import moment from "moment";
import { ChartOnDemand } from "../class/ChartOnDemand";
import { FinancialRecordType } from "../class/FinancialRecordType";
import { PeriodTagTotal } from "../class/PeriodTagTotal";
import { PeriodTotal } from "../class/PeriodTotal"
import { PeriodType } from "../class/PeriodType";
import { TagTotal } from "../class/TagTotal";
import { ToastContextType } from "../components/Toast/ToastProvider";
import { fetchWrapper } from "../helpers/fetch-wrapper";
import { financialRecordService } from "./financial-record.service";
import { periodService } from "./period.service";
import { userService } from "./user.service";

export const chartService = {
    periodTotalToChartOptions,
    periodTotalToLineBarSeries,
    periodTagTotalToChartSeries,
    setChartValues,
    getChartsOnDemandStorageName
}

function periodTotalToChartOptions(data: Array<PeriodTotal> | Array<PeriodTagTotal>, chartType: string, periodType: any, colors?: Array<string>): ApexCharts.ApexOptions {
    if(chartType == "bar") {
        return getPeriodTotalToBar(data, periodType, colors)
    } else if(chartType == "line") {
        return getPeriodTotalToLineArea(data, periodType, colors)
    }

    const dataDonutPie = data as Array<PeriodTagTotal>
    return getPeriodTotalToDonutPie(dataDonutPie, periodType, colors)
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
            formatter: (val) => `R$ ${val.toString().replace(".", ",")}`,
        },
        colors,
        stroke: {
            curve: 'smooth',
        },
        tooltip: {
            enabled: true,
            x: {
                show: false
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
            formatter: (val) => val.toString().replace(".", ","),
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
            }
        }
    }
}

function getPeriodTotalToDonutPie(data: Array<PeriodTagTotal>, periodType: any, colors?: Array<string>): ApexCharts.ApexOptions {
    return {
        chart: {
            toolbar: {
                offsetY: 3
            }
        },
        labels: data?.[0]?.totals?.map(it => it.tag.name)?.reverse(),
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
                formatter: (val) => `R$ ${val.toString().replace(".", ",")}`,
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

function periodTagTotalToChartSeries(tags: Array<string>, data: Array<PeriodTagTotal>, chartType: string): Array<any> {
    if(chartType == "donut" || chartType == "pie") console.log("retornando series", data?.[0]?.totals?.map(it => it.total || 0)?.reverse())

    return chartType == "donut" || chartType == "pie" ?
        data?.[0]?.totals?.map(it => it.total || 0)?.reverse() :
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
        chartOnDemand.data = periodService.getPeriodTagTotalDays(chartOnDemand.totalPeriods, chartOnDemand.type)
    } else if(PeriodType[chartOnDemand.periodType] == PeriodType.MONTHLY) {
        chartOnDemand.data = periodService.getPeriodTagTotalMonths(chartOnDemand.totalPeriods, chartOnDemand.type)
    } else if(PeriodType[chartOnDemand.periodType] == PeriodType.YEARLY) {
        chartOnDemand.data = periodService.getPeriodTagTotalYears(chartOnDemand.totalPeriods, chartOnDemand.type)
    }

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

function getChartsOnDemandStorageName() {
    return `chartsOnDemandV2_${fetchWrapper.getApiUrl()}_${userService.getUserValue()?.user?.id}`
}