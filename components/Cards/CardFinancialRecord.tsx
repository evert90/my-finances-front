import { useState } from "react";
import Moment from "react-moment";
import { FinancialRecordType } from "../../class/FinancialRecordType";
import { Period } from "../../class/Period";
import { currencyService } from "../../services/currency.service";
import { periodService } from "../../services/period.service";

type CardFinancialRecordProps = {
    period: Period,
}

export const CardFinancialRecord: React.FC<CardFinancialRecordProps> = (props) => {

    props.period.records = props.period.records?.sort((a,b) => a.name.localeCompare(b.name))

    const [showInfo, setShowInfo] = useState(false)

    const incomeTotal: number = periodService.getPeriodIncomeTotal(props.period)

    const expenseTotal: number = periodService.getPeriodExpenseTotal(props.period)

    return (
        <>
            <div className={`${!props.period.records && "opacity-50"} relative flex flex-col w-full min-w-0 break-words bg-white rounded shadow-lg cursor-pointer lg:mb-7 scale-003`}>
            {!props.period.records &&
                <div className="center-card">
                    <i className="mx-auto mr-1 text-3xl text-blueGray-700 fas fa-circle-notch animate-spin"></i>
                </div>
            }
                <div className="py-3 pr-2 mb-0 border-0 rounded-t">
                    <div className="flex flex-wrap items-center">
                        <div className="relative flex-1 flex-grow w-full max-w-full px-4">
                            <h3 className="text-base font-semibold capitalize text-blueGray-700">
                                <Moment format="MMMM/YYYY" locale="pt-BR">{props.period.start}</Moment>
                            </h3>
                        </div>
                        <div className="relative flex-1 flex-grow w-full max-w-[25px] px-1 text-right">
                            <i className={`mt-1 mr-1 cursor-pointer text-base fas ${showInfo ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'} `}
                               onClick={() => setShowInfo(!showInfo)}
                            ></i>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead className="thead-light">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-left uppercase align-middle border border-l-0 border-r-0 border-solid bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap">
                                Nome
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-left uppercase align-middle border border-l-0 border-r-0 border-solid bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap">
                                Valor
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {props.period.records?.map(record =>
                            <tr key={record.id} className={`
                                ${FinancialRecordType[record.type] == FinancialRecordType.INCOME ? "text-green-600" : "text-red-600"}
                                ${showInfo ? "" : "hidden"}
                                border-t-[1px]
                                `}>
                                <td className={`p-4 px-6 text-xs font-medium align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap`}>{record.name}</td>
                                <td className="p-4 px-6 text-xs font-medium align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">{currencyService.format(record.value)}</td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-[1px]">
                                <td className="p-4 px-6 text-xs font-bold align-middle border-l-0 border-r-0 border-t-1 whitespace-nowrap">Total de receitas</td>
                                <td className="p-4 px-6 text-xs font-bold align-middle border-l-0 border-r-0 border-t-1 whitespace-nowrap">{currencyService.format(incomeTotal)}</td>
                            </tr>
                            <tr className="border-t-[1px]">
                                <td className="p-4 px-6 text-xs font-bold align-middle border-l-0 border-r-0 border-t-1 whitespace-nowrap">Total de despesas</td>
                                <td className="p-4 px-6 text-xs font-bold align-middle border-l-0 border-r-0 border-t-1 whitespace-nowrap">{currencyService.format(expenseTotal)}</td>
                            </tr>
                            <tr className="border-t-[1px]">
                                <td className="p-4 px-6 text-xs font-bold align-middle border-l-0 border-r-0 border-t-1 whitespace-nowrap">Total</td>
                                <td className="p-4 px-6 text-xs font-bold align-middle border-l-0 border-r-0 border-t-1 whitespace-nowrap">{currencyService.format(incomeTotal - expenseTotal)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );
}
