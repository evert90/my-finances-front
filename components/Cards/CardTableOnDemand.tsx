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
            <div className="block w-full overflow-x-auto">
                <table className="items-center table w-full text-sm bg-transparent border-collapse stripped">
                    <thead>
                        <tr>
                            <th className={"card-on-demand-thead-column"}>
                                Período
                            </th>
                            {CardOnDemandFilterBy[props.cardOnDemand.filterBy] === CardOnDemandFilterBy.INCOME_EXPENSE && [
                                <th key={0} className={"card-on-demand-thead-column "}>
                                    Receitas
                                </th>,
                                <th key={1} className={"card-on-demand-thead-column "}>
                                    Despesas
                                </th>,
                                <th key={2} className={"card-on-demand-thead-column "}>
                                    Diferença
                                </th>,
                                <th key={3} className={"card-on-demand-thead-column "}>
                                    Total
                                </th>
                            ]}
                            {CardOnDemandFilterBy[props.cardOnDemand.filterBy] === CardOnDemandFilterBy.TAGS && [
                                props.cardOnDemand.tags.map((tag, index) =>
                                    <th key={index} className={"card-on-demand-thead-column "}>
                                        {tag.name}
                                    </th>
                                ),
                                <th key={props.cardOnDemand.tags.length + 1} className={"card-on-demand-thead-column "}>
                                    Diferença
                                </th>,
                                <th key={props.cardOnDemand.tags.length + 2} className={"card-on-demand-thead-column "}>
                                    Total
                                </th>
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

                        return <tr key={period.start} className="border-t-[1px]">
                            <td className="capitalize card-on-demand-tbody-column">
                                {moment(period.start, 'YYYY-MM-DD').locale("pt-BR").format(periodService.periodTypeToDateFormat(props.cardOnDemand.periodType))}
                            </td>
                            <td className=" card-on-demand-tbody-column">
                                {currencyService.format(incomes)}
                            </td>
                            <td className=" card-on-demand-tbody-column">
                                {currencyService.format(expenses)}
                            </td>
                            <td className=" card-on-demand-tbody-column">
                                {total != 0 && totalPreviousPeriod ? currencyService.format(total - totalPreviousPeriod) : "-"}
                            </td>
                            <td className={`card-on-demand-tbody-column `}>
                                {currencyService.format(total)}
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
                            <td className="capitalize card-on-demand-tbody-column">
                                {moment(period.start, 'YYYY-MM-DD').locale("pt-BR").format(periodService.periodTypeToDateFormat(props.cardOnDemand.periodType))}
                            </td>
                            {props.cardOnDemand.tags.map((tag, index) =>{
                                const tagTotal = period?.totals?.find(it => it.tag.name == tag.name)?.total
                                total+= tagTotal || 0
                                return <td key={index} className={"card-on-demand-tbody-column "}>
                                    {tagTotal ? currencyService.format(tagTotal) : "-"}
                                </td>
                                })}
                            <td className="card-on-demand-tbody-column">
                                {total != 0  && totalPreviousPeriod != 0 ? currencyService.format(total - totalPreviousPeriod) : "-"}
                            </td>
                            <td className={`card-on-demand-tbody-column `}>
                                {currencyService.format(total)}
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