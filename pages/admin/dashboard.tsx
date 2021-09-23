import React, { useEffect, useLayoutEffect, useState } from "react";

import { CardBarChart } from "../../components/Cards/CardBarChart";
import { CardLineChart } from "../../components/Cards/CardLineChart";
import { CardPageVisits } from "../../components/Cards/CardPageVisits";
import { CardSocialTraffic } from "../../components/Cards/CardSocialTraffic";

import { LayoutComponent } from "../../class/LayoutComponent";
import { Admin } from "../../layouts/Admin";
import { CardStats } from "../../components/Cards/CardStats";
import { financialRecordService } from "../../services/financial-record.service";
import { FinancialRecordTotal } from "../../class/FinancialRecordTotal";
import { useToast } from "../../components/Toast/ToastProvider";
import { FinancialRecordType } from "../../class/FinancialRecordType";

import moment from 'moment';
import { CardFinancialRecord } from "../../components/Cards/CardFinancialRecord";
import { FinancialRecord } from "../../class/FinancialRecord";
import { Period } from "../../class/Period";
import { periodService } from "../../services/period.service";

export const Dashboard: LayoutComponent = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [incomeTotal, setIncomeTotal] = useState<number>(undefined)
    const [expenseTotal, setExpenseTotal] = useState<number>(undefined)
    const [incomeMonthTotal, setIncomeMonthTotal] = useState<number>(undefined)
    const [expenseMonthTotal, setExpenseMonthTotal] = useState<number>(undefined)
    const [financialRecordsCards, setFinancialRecordsCards] = useState<Array<Period>>(periodService.getPeriodMonths(4))

    const toast = useToast()

    const currencyOptions = Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" })

    const startOfCurrentMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfCurrentMonth   = moment().endOf('month').format('YYYY-MM-DD');

    useEffect(() => {
        console.log("dashboard useeffect")
        financialRecordService.getTotal()
        .then((totals: Array<FinancialRecordTotal>) => {
            setIncomeTotal(totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.INCOME)?.total || 0)
            setExpenseTotal(totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.EXPENSE)?.total || 0)
        })
        .catch(error => {
            toast?.pushError("Erro ao consultar total de receitas/despesas. " + error, 999999999, "truncate-2-lines")
        }).finally(() => {})

        financialRecordService.getTotalByPeriod(startOfCurrentMonth, endOfCurrentMonth)
        .then((totals: Array<FinancialRecordTotal>) => {
            setIncomeMonthTotal(totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.INCOME)?.total || 0)
            setExpenseMonthTotal(totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.EXPENSE)?.total || 0)
        })
        .catch(error => {
            toast?.pushError("Erro ao consultar total de receitas/despesas do mês atual. " + error, 999999999, "truncate-2-lines")
        }).finally(() => {})

        financialRecordsCards.map(period => {
            financialRecordService.getByPeriod(period.start, period.end)
            .then((records: Array<FinancialRecord>) => {
                console.log("period", period.start)
                console.log("records", records)
                period.records = records.map(record => {record.date = moment(record.date, 'YYYY-MM-DD'); return record});
                console.log("saving in", financialRecordsCards)
                console.log("after", financialRecordsCards)
                setFinancialRecordsCards([...financialRecordsCards])
            })
            .catch(error => {
                toast?.pushError("Erro ao consultar de receitas/despesas de um período. " + error, 999999999, "truncate-2-lines")
            }).finally(() => {})
        })

    }, [])


    return (
        <>
            <div className="relative pt-12 pb-9 md:pt-32">
                {/* Card stats */}
                <div className="flex flex-wrap">
                    <div className="w-full px-4 lg:w-6/12 xl:6-3/12">
                    <CardStats
                        statSubtitle="Receitas"
                        statTitle={currencyOptions.format(incomeTotal)}
                        statArrow="up"
                        statPercent="3.48"
                        statPercentColor="text-emerald-500"
                        statDescripiron="Since last month"
                        statIconName="far fa-chart-bar"
                        statIconColor="bg-red-500"
                    />
                    </div>
                    <div className="w-full px-4 lg:w-6/12 xl:6-3/12">
                    <CardStats
                        statSubtitle="Despesas"
                        statTitle={currencyOptions.format(expenseTotal)}
                        statArrow="down"
                        statPercent="3.48"
                        statPercentColor="text-red-500"
                        statDescripiron="Since last week"
                        statIconName="fas fa-chart-pie"
                        statIconColor="bg-orange-500"
                    />
                    </div>
{/*                     <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
                    <CardStats
                        statSubtitle="Receitas mês atual"
                        statTitle={currencyOptions.format(incomeMonthTotal)}
                        statArrow="down"
                        statPercent="1.10"
                        statPercentColor="text-orange-500"
                        statDescripiron="Since yesterday"
                        statIconName="fas fa-users"
                        statIconColor="bg-pink-500"
                    />
                    </div>
                    <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
                    <CardStats
                        statSubtitle="Despesas mês atual"
                        statTitle={currencyOptions.format(expenseMonthTotal)}
                        statArrow="up"
                        statPercent="12"
                        statPercentColor="text-emerald-500"
                        statDescripiron="Since last month"
                        statIconName="fas fa-percent"
                        statIconColor="bg-lightBlue-500"
                    />
                    </div> */}
                </div>
            </div>

            <div className="flex flex-wrap">
                {financialRecordsCards?.map(period =>
                <div key={period.start} className="w-full px-4 mb-12 xl:w-3/12 xl:mb-0">
                    <CardFinancialRecord period={period} />
                </div>
                )}
            </div>

            <div className="flex flex-wrap">
                <div className="w-full px-4 mb-12 xl:w-8/12 xl:mb-0">
                    <CardLineChart />
                </div>
                <div className="w-full px-4 xl:w-4/12">
                    <CardBarChart />
                </div>
            </div>
            <div className="flex flex-wrap mt-4">
                <div className="w-full px-4 mb-12 xl:w-8/12 xl:mb-0">
                    <CardPageVisits />
                </div>
                <div className="w-full px-4 xl:w-4/12">
                    <CardSocialTraffic />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = Admin;

export default Dashboard;