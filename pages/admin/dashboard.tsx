import React, { useEffect, useLayoutEffect, useState } from "react";

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

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { PeriodTotal } from "../../class/PeriodTotal";
import { chartService } from "../../services/chart.service";
import { ModalAddChart } from "../../components/Modal/ModalAddChart";
import { ChartOnDemand } from "../../class/ChartOnDemand";
import { userService } from "../../services/user.service";

export const Dashboard: LayoutComponent = () => {

    const toast = useToast()

    const totalFinancialRecordsCards = 18
    const widthFinancialRecordsCard = 315

    //const [isLoading, setIsLoading] = useState<boolean>(true)
    const [incomeTotal, setIncomeTotal] = useState<number>(undefined)
    const [expenseTotal, setExpenseTotal] = useState<number>(undefined)
    const [financialRecordsCards, setFinancialRecordsCards] = useState<Array<Period>>(periodService.getPeriodMonths(totalFinancialRecordsCards))
    const [financialRecordsChartTotal, setFinancialRecordsChartTotal] = useState<Array<PeriodTotal>>(periodService.getPeriodTotalMonths(12))
    const [chartsOnDemand, setChartsOnDemand] = useState<Array<ChartOnDemand>>((process.browser && JSON.parse(localStorage.getItem(`chartsOnDemand${userService.getUserValue()?.user?.id}`))) || [])
    const [scrollX, setScrollX] = useState(0);

    const [showModal, setShowModal] = useState(false);

    const currencyOptions = Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" })

    const handleLeftArrow = () => {
        let x = scrollX + (window.innerWidth > 640 ? Math.round(window.innerWidth / 2) : 140)
        if(x > 0) {
            x = 0;
        }
        setScrollX(x)
    }

    const handleRightArrow = () => {
        let x = scrollX - (window.innerWidth > 640 ? Math.round(window.innerWidth / 2) : 140)
        let total = totalFinancialRecordsCards * widthFinancialRecordsCard
        if((window.innerWidth - total) > x ) {
            x = (window.innerWidth - total) - 60
        }
        setScrollX(x)
    }

    useEffect(() => {
        if(chartsOnDemand?.length > 0) {
            console.log("atualizando")
            chartsOnDemand.map(chartOnDemand => chartService.setChartValues(chartOnDemand, toast))
        }
     }, [])

    useEffect(() => {
        console.log("dashboard useeffect")
        financialRecordService.getTotal()
        .then((totals: Array<FinancialRecordTotal>) => {
            setIncomeTotal(totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.INCOME)?.total || 0)
            setExpenseTotal(totals?.find(it => FinancialRecordType[it.type] == FinancialRecordType.EXPENSE)?.total || 0)
        })
        .catch(error => {
            toast?.pushError("Erro ao consultar total de receitas/despesas. " + error, 7000, "truncate-2-lines")
        }).finally(() => {})

        financialRecordsChartTotal.map(period => {
            financialRecordService.getTotalByPeriod(period.start, period.end)
            .then((totals: Array<FinancialRecordTotal>) => {
                period.totals = totals
                setFinancialRecordsChartTotal([...financialRecordsChartTotal])
            })
            .catch(error => {
                toast?.pushError("Erro ao consultar totais de receitas/despesas " + error, 7000, "truncate-2-lines")
            }).finally(() => {})
        })

        financialRecordsCards.map(period => {
            financialRecordService.getByPeriod(period.start, period.end)
            .then((records: Array<FinancialRecord>) => {
                period.records = records.map(record => {record.date = moment(record.date, 'YYYY-MM-DD'); return record});
                setFinancialRecordsCards([...financialRecordsCards])
            })
            .catch(error => {
                toast?.pushError("Erro ao consultar de receitas/despesas de um período. " + error, 7000, "truncate-2-lines")
            }).finally(() => {})
        })
    }, [])

    useEffect(() => () => {console.log("SAINDOOOO")}, [])

    return (
        <>
            <div className="relative pt-12 pb-3 lg:pb-7 md:pt-32">
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



            <div className="flex flex-row mr-4 overflow-hidden md:ml-0" style={{marginLeft: scrollX < 0 ? "17px" : 0}}>
                <div className="-ml-3 sm:ml-0 absolute left-0 w-[50px] h-[250px] z-60 flex items-center justify-center ease-in">
                    <i className="cursor-pointer fa fa-chevron-left" onClick={handleLeftArrow}></i>
                </div>
                <div className="-mr-3 sm:mr-0 absolute right-0 w-[50px] h-[250px] z-60 flex items-center justify-center ease-in">
                    <i className="cursor-pointer fa fa-chevron-right" onClick={handleRightArrow}></i>
                </div>
                <div className="flex flex-row" style={{
                    marginLeft: scrollX,
                    width: totalFinancialRecordsCards * widthFinancialRecordsCard,
                    transition: "all ease 0.5s"
                }}>
                    {financialRecordsCards?.map(period =>
                        <div key={period.start} className="w-full px-4 mb-12 xl:mb-0">
                            <CardFinancialRecord period={period} />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap">
                <div className="w-full px-4 mb-8 xl:w-12/12">
                    <div className="bg-white rounded shadow-lg">
                        <Chart
                            options={chartService.periodTotalToLineBarOptions(financialRecordsChartTotal, ['rgb(21, 128, 61)', 'rgb(220, 38, 38)'])}
                            series={chartService.periodTotalToLineBarSeries(financialRecordsChartTotal)}
                            type="line"
                            width="100%"
                            height="450"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap">
                {chartsOnDemand?.map(chart =>
                <div key={chart.id} className="w-full px-4 mb-8 xl:w-12/12">
                    <div className="bg-white rounded shadow-lg">
                        <Chart
                            options={chartService.periodTotalToLineBarOptions(chart.data)}
                            series={chartService.periodTagTotalToLineBarSeries(chart.tags.map(tag => tag.name), chart.data)}
                            type={chart.type}
                            width={chart.width}
                            height={chart.height}
                        />
                    </div>
                </div>
                )}
            </div>

            <div className="flex flex-wrap">
                <div className="w-full px-4 mb-8 xl:w-12/12">
                    <div className="bg-white">
                    <button
                        className="w-full px-0 py-2 text-base font-bold text-center text-white transition-all duration-150 ease-linear rounded shadow outline-none disabled:opacity-50 bg-lightBlue-600 active:bg-blueGray-600 hover:shadow-lg focus:outline-none"
                        type="button"
                        onClick={() => setShowModal(true)}
                        >
                        <i className="mr-1 fas fa-chart-pie"></i> Adicionar novo gráfico
                    </button>
                    </div>
                </div>
            </div>
            {showModal ? (
                <ModalAddChart setShowModalState={setShowModal} setChartsOnDemandState={setChartsOnDemand} chartsOnDemand={chartsOnDemand} ></ModalAddChart>
            ) : null}
{/*
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
            </div> */}
        </>
    );
}

Dashboard.layout = Admin;

export default Dashboard;