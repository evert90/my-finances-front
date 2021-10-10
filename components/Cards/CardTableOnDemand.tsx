import { CardOnDemand } from "../../class/CardOnDemand"
import { CardOnDemandFilterBy } from "../../class/CardOnDemandFilterBy"
import { PeriodTagTotal } from "../../class/PeriodTagTotal"
import { PeriodTotal } from "../../class/PeriodTotal"

type CardTableOnDemandProps = {
    cardOnDemand: CardOnDemand
}

export const CardTableOnDemand: React.FC<CardTableOnDemandProps> = (props) => {
    return (
        <>
        <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"}>
            <div className="px-4 py-3 mb-0 border-0 rounded-t">
                <div className="flex flex-wrap items-center">
                    <div className="relative flex-1 flex-grow w-full max-w-full px-1">
                        <h3 className={"text-xl font-bold text-blueGray-700"}>
                            Lançamentos
                        </h3>
                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto">
                <table className="items-center table w-full bg-transparent border-collapse stripped">
                    <thead>
                        <tr>
                            <th className={"column-fit thead-column"}>
                                Período
                            </th>
                            {CardOnDemandFilterBy[props.cardOnDemand.filterBy] === CardOnDemandFilterBy.INCOME_EXPENSE && [
                                <th key={0} className={"thead-column"}>
                                    Receitas
                                </th>,
                                <th key={1} className={"thead-column"}>
                                    Despesas
                                </th>
                            ]}
                            {CardOnDemandFilterBy[props.cardOnDemand.filterBy] === CardOnDemandFilterBy.TAGS &&
                            props.cardOnDemand.tags.map((tag, index) =>
                                <th key={index} className={"thead-column"}>
                                    {tag.name}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                    {(CardOnDemandFilterBy[props.cardOnDemand.filterBy] === CardOnDemandFilterBy.INCOME_EXPENSE && (props.cardOnDemand?.data as Array<PeriodTotal>).map(period =>
                        <tr key={period.start} v-for="row in rows" className="odd:bg-blueGray-50 even:bg-white hover:bg-blueGray-100">
                            <td className="flex items-center justify-center p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">

                            </td>
                            <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">{record.name}</td>
                            <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap"><Moment date={record.date} format="DD/MM/YYYY" /></td>
                            <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">{currencyService.format(record.value)}</td>
                            <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                            {record.tags.map(tag =>
                                <span key={tag.id} className="text-xs px-2 py-0.5 rounded ml-1 font-bold bg-green-500 text-white">
                                {tag.name}
                                </span>
                            )}
                            </td>

                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}