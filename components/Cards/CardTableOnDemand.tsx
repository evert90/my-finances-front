import moment from "moment";
import { CardOnDemand } from "../../class/CardOnDemand"
import { CardOnDemandFilterBy } from "../../class/CardOnDemandFilterBy"
import { FinancialRecordType } from "../../class/FinancialRecordType";
import { PeriodTagTotal } from "../../class/PeriodTagTotal"
import { PeriodTotal } from "../../class/PeriodTotal"
import { currencyService } from "../../services/currency.service";
import { periodService } from "../../services/period.service"

type CardTableOnDemandProps = {
    cardOnDemand: CardOnDemand
}

export const CardTableOnDemand: React.FC<CardTableOnDemandProps> = (props) => {
    return (
        <>
        <div
            className={`relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-white`}
            style={{minHeight: props.cardOnDemand.height + "px"}}
        >
            <div className="block w-full p-[0.6rem] pt-2 overflow-x-auto">
                <table className="items-center table w-full mt-1 text-sm bg-transparent border-collapse stripped">
                    <thead>
                        <tr>
                            <th className={"card-on-demand-thead-column"}>
                                Período
                            </th>
                            {CardOnDemandFilterBy[props.cardOnDemand.filterBy] === CardOnDemandFilterBy.INCOME_EXPENSE && [
                                <th key={0} className={"card-on-demand-thead-column"}>
                                    Receitas
                                </th>,
                                <th key={1} className={"card-on-demand-thead-column"}>
                                    Despesas
                                </th>,
                                <th key={2} className={"card-on-demand-thead-column"}>
                                    Resultado
                                </th>,
                               <th key={3} className={"card-on-demand-thead-column"}>
                               Diferença <i className="text-xs cursor-pointer fa fa-question-circle" title="Diferença para o resultado do período anterior"></i>
                           </th>,
                            ]}
                            {CardOnDemandFilterBy[props.cardOnDemand.filterBy] === CardOnDemandFilterBy.TAGS && [
                                props.cardOnDemand.tags.map((tag, index) =>
                                    <th key={index} className={"card-on-demand-thead-column "}>
                                        {tag.name}
                                    </th>
                                ),
                                <th key={props.cardOnDemand.tags.length + 1} className={"card-on-demand-thead-column "}>
                                    Resultado
                                </th>,
                                <th key={props.cardOnDemand.tags.length + 2} className={"card-on-demand-thead-column"}>
                                Diferença <i className="text-xs cursor-pointer fa fa-question-circle" title="Diferença para o resultado do período anterior"></i>
                            </th>,
                            ]}
                        </tr>
                    </thead>
                    <tbody>
                    {(CardOnDemandFilterBy[props.cardOnDemand.filterBy] === CardOnDemandFilterBy.INCOME_EXPENSE && (props.cardOnDemand?.data as Array<PeriodTotal>).map((period, index) => {
                        const incomes: number = period?.totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.INCOME)?.total || 0
                        const expenses: number = period?.totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.EXPENSE)?.total || 0
                        const total = incomes - expenses

                        let totalPreviousPeriod = undefined
                        if(index + 1 <= props.cardOnDemand?.data.length) {
                            const incomesPreviousMonth: number = (props.cardOnDemand?.data[index+1] as PeriodTotal)?.totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.INCOME)?.total || 0
                            const expensesPreviousMonth: number = (props.cardOnDemand?.data[index+1] as PeriodTotal)?.totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.EXPENSE)?.total || 0
                            totalPreviousPeriod = incomesPreviousMonth - expensesPreviousMonth
                        }

                        const difference = total != 0 && totalPreviousPeriod ? total - totalPreviousPeriod : undefined

                        return <tr key={period.start} className="border-t-[1px]">
                            <td className="capitalize card-on-demand-tbody-column text-xs-edit">
                                {moment(period.start, 'YYYY-MM-DD').locale("pt-BR").format(periodService.periodTypeToDateFormat(props.cardOnDemand.periodType))}
                            </td>
                            <td className=" card-on-demand-tbody-column text-xs-edit">
                                {currencyService.format(incomes)}
                            </td>
                            <td className=" card-on-demand-tbody-column text-xs-edit">
                                {currencyService.format(expenses)}
                            </td>
                            <td className={`${total > 0 && ""} ${total < 0 && "text-red-500"} card-on-demand-tbody-column font-semibold text-xs-edit`}>
                                {currencyService.format(total)}
                            </td>
                            <td className={`${difference > 0 && ""} ${difference < 0 && ""} font-semibold card-on-demand-tbody-column text-xs-edit`}>
                                {difference ? currencyService.format(difference) : "-"}
                            </td>
                        </tr>
                    }))}
                    {(CardOnDemandFilterBy[props.cardOnDemand.filterBy] === CardOnDemandFilterBy.TAGS && (props.cardOnDemand?.data as Array<PeriodTagTotal>).map((period, index) => {
                        let total: number = 0;
                        let totalPreviousPeriod = undefined
                        if(index + 1 <= props.cardOnDemand?.data.length) {
                            totalPreviousPeriod = (props.cardOnDemand?.data[index+1] as PeriodTagTotal)?.totals?.map(it => it.total).reduce((a, b) => a + b, 0) || 0
                        }

                        return <tr key={period.start} className="border-t-[1px]">
                            <td className="capitalize card-on-demand-tbody-column text-xs-edit">
                                {moment(period.start, 'YYYY-MM-DD').locale("pt-BR").format(periodService.periodTypeToDateFormat(props.cardOnDemand.periodType))}
                            </td>
                            {props.cardOnDemand.tags.map((tag, index) =>{
                                const tagTotal = period?.totals?.find(it => it.tag.name == tag.name)?.total
                                total+= tagTotal || 0
                                return <td key={index} className={"card-on-demand-tbody-column text-xs-edit"}>
                                    {tagTotal ? currencyService.format(tagTotal) : "-"}
                                </td>
                            })}
                            <td className={`${total > 0 && ""} ${total < 0 && "text-red-500"} card-on-demand-tbody-column text-xs-edit font-semibold`}>
                                {currencyService.format(total)}
                            </td>
                            <td className={`${total != 0  && totalPreviousPeriod != 0 && total - totalPreviousPeriod > 0 && ""} ${total != 0  && totalPreviousPeriod != 0 && total - totalPreviousPeriod < 0 && "text-red-500"} font-semibold card-on-demand-tbody-column text-xs-edit`}>
                                {total != 0  && totalPreviousPeriod != 0 ? currencyService.format(total - totalPreviousPeriod) : "-"}
                            </td>
                        </tr>
                    }))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}