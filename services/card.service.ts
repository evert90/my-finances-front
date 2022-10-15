import { CardOnDemand } from "../class/CardOnDemand";
import { CardOnDemandFilterBy } from "../class/CardOnDemandFilterBy";
import { FinancialRecordTotal } from "../class/FinancialRecordTotal";
import { PeriodType } from "../class/PeriodType";
import { TagTotal } from "../class/TagTotal";
import { ToastContextType } from "../components/Toast/ToastProvider";
import { financialRecordService } from "./financial-record.service";
import { periodService } from "./period.service";

export const cardService = {
    setValues: setValues
}

async function setValues(cardOnDemand: CardOnDemand, toast?: ToastContextType) {
    const promises: Array<Promise<any>> = []

    if(PeriodType[cardOnDemand.periodType] == PeriodType.DAILY) {
        cardOnDemand.data = CardOnDemandFilterBy[cardOnDemand.filterBy] == CardOnDemandFilterBy.TAGS ?
            periodService.getPeriodTagTotalDays(cardOnDemand.totalPeriods, cardOnDemand.type) :
            periodService.getPeriodTotalDays(cardOnDemand.totalPeriods, cardOnDemand.type)
    } else if(PeriodType[cardOnDemand.periodType] == PeriodType.MONTHLY) {
        cardOnDemand.data = CardOnDemandFilterBy[cardOnDemand.filterBy] == CardOnDemandFilterBy.TAGS ?
            periodService.getPeriodTagTotalMonths(cardOnDemand.totalPeriods, cardOnDemand.type) :
            periodService.getPeriodTotalMonths(cardOnDemand.totalPeriods, cardOnDemand.type)
    } else if(PeriodType[cardOnDemand.periodType] == PeriodType.YEARLY) {
        cardOnDemand.data = CardOnDemandFilterBy[cardOnDemand.filterBy] == CardOnDemandFilterBy.TAGS ?
            periodService.getPeriodTagTotalYears(cardOnDemand.totalPeriods, cardOnDemand.type) :
            periodService.getPeriodTotalYears(cardOnDemand.totalPeriods, cardOnDemand.type)
    }

    cardOnDemand.data.forEach(period => {
        let promise: Promise<any> = CardOnDemandFilterBy[cardOnDemand.filterBy] == CardOnDemandFilterBy.TAGS ?
            financialRecordService.getTotalByPeriodAndTags(period.start, period.end, cardOnDemand.tags.map(tag => tag.id)) :
            financialRecordService.getTotalByPeriod(period.start, period.end)
        promises.push(
            promise
            .then((totals: Array<TagTotal> | Array<FinancialRecordTotal>) => {
                period.totals = totals
            })
            .catch(error => {
                toast?.pushError("Erro ao consultar dados para gerar gráfico: " + error, 7000, "truncate-2-lines")
            }).finally(() => {})
        )
    })

    await Promise.all(promises)
}