import moment from "moment";
import { CardOnDemand } from "../class/CardOnDemand";
import { CardOnDemandFilterBy } from "../class/CardOnDemandFilterBy";
import { FinancialRecordType } from "../class/FinancialRecordType";
import { PeriodTagTotal } from "../class/PeriodTagTotal";
import { PeriodTotal } from "../class/PeriodTotal"
import { fetchWrapper } from "../helpers/fetch-wrapper";
import { colorService } from "./color.service";
import { currencyService } from "./currency.service";
import { periodService } from "./period.service";
import { userService } from "./user.service";

export const chartService = {
    periodTotalToChartOptions: periodTotalToChartOptions,
    periodTotalToChartSeries: periodTotalToChartSeries,
    periodTagTotalToChartSeries: periodTagTotalToChartSeries,
    getCardsOnDemandStorageName: getCardsOnDemandStorageName,
    chartOnDemandToOptions: chartOnDemandToOptions,
    chartOnDemandToSeries: chartOnDemandToSeries
}

function chartOnDemandToOptions(chart: CardOnDemand): ApexCharts.ApexOptions {
    return periodTotalToChartOptions(
        chart.data,
        chart.type,
        chart.periodType,
        chart.filterBy,
        CardOnDemandFilterBy[chart.filterBy] == CardOnDemandFilterBy.INCOME_EXPENSE ? colorService.getIncomesExpenses() : undefined
    )

}

function chartOnDemandToSeries(chart: CardOnDemand) {
    return CardOnDemandFilterBy[chart.filterBy] == CardOnDemandFilterBy.TAGS ?
        periodTagTotalToChartSeries(chart.tags.map(tag => tag.name), chart.data as Array<PeriodTagTotal>, chart.type) :
        periodTotalToChartSeries(chart.data as Array<PeriodTotal>, chart.type)
}

function periodTotalToChartOptions(data: Array<PeriodTotal> | Array<PeriodTagTotal>, chartType: string, periodType: any, filterBy: string, colors?: Array<string>): ApexCharts.ApexOptions {
    if (!colors) colors = colorService.getDefaultPallete()

    if (chartType == "bar") {
        return getPeriodTotalToBar(data, periodType, colors)
    } else if (chartType == "line" || chartType == "area") {
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
                return category.charAt(0).toUpperCase() + category?.slice(1)
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
                return category.charAt(0).toUpperCase() + category?.slice(1)
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
            formatter: (val) => { const valNumber: number = val as number; return `${valNumber?.toFixed(2).toString().replace(".", ",")}` },
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
            },
        },
        labels: CardOnDemandFilterBy[filterBy] == CardOnDemandFilterBy.TAGS ?
            data?.[0]?.totals?.sort((a, b) => a.tag.name?.toLowerCase() < b.tag.name?.toLowerCase() ? -1 : 1).map(it => it.tag.name) :
            ["Receitas", "Despesas"],
        dataLabels: {
            enabled: true
        },
        colors,
        stroke: {
            curve: 'smooth',
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    minAngleToShowLabel: 1
                }
            }
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
        data?.[0]?.totals?.sort((a, b) => a.tag.name?.toLowerCase() < b.tag.name?.toLowerCase() ? -1 : 1).map(it => it.total || 0) || [] :
        tags.map(tag => (
            {
                name: tag,
                data: data.map(period => period?.totals?.find(it => it?.tag?.name == tag)?.total || 0).reverse()
            }
        ))
}

function getCardsOnDemandStorageName() {
    return `cardsOnDemand_${fetchWrapper.getApiUrl()}_${userService.getUserValue()?.id}`
}