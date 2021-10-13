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
import { ModalAddCard } from "../../components/Modal/ModalAddCard";
import { CardOnDemand } from "../../class/CardOnDemand";
import { CardOnDemandWidthType } from "../../class/CardOnDemandWidthType";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation} from 'swiper'
SwiperCore.use([Navigation])

// Import Swiper styles
// swiper bundle styles
import 'swiper/swiper-bundle.min.css'

// swiper core styles
import 'swiper/swiper.min.css'

// modules styles
import 'swiper/components/navigation/navigation.min.css'

import { CardOnDemandFilterBy } from "../../class/CardOnDemandFilterBy";
import { currencyService } from "../../services/currency.service";
import { CardTableOnDemand } from "../../components/Cards/CardTableOnDemand";
import { colorService } from "../../services/color.service";
import { CardOnDemandDropdown } from "../../components/Dropdowns/CardOnDemandDropdown";

export const Dashboard: LayoutComponent = () => {

    const toast = useToast()

    const totalFinancialRecordsCards = 12

    const [incomeTotal, setIncomeTotal] = useState<number>(undefined)
    const [expenseTotal, setExpenseTotal] = useState<number>(undefined)
    const [financialRecordsCards, setFinancialRecordsCards] = useState<Array<Period>>(periodService.getPeriodMonths(totalFinancialRecordsCards))
    const [financialRecordsChartTotal, setFinancialRecordsChartTotal] = useState<Array<PeriodTotal>>(periodService.getPeriodTotalMonths(12, "line"))
    const [cardsOnDemand, setCardsOnDemand] = useState<Array<CardOnDemand>>((process.browser && JSON.parse(localStorage.getItem(chartService.getCardsOnDemandStorageName()))) || [])
    const [showChartDefault, setShowChartDefault] = useState<boolean>(process.browser && !localStorage.getItem("removeChartDefault") || cardsOnDemand?.length == 0)

    const [showModal, setShowModal] =  useState<boolean>(false)

    const removeCardOnDemand = (cardToRemove: CardOnDemand) => {
        const removed = cardsOnDemand.filter(chart => chart.id != cardToRemove.id)
        setCardsOnDemand(removed)
        localStorage.setItem(chartService.getCardsOnDemandStorageName(), JSON.stringify(removed))
        if(removed?.length == 0) {
            localStorage.removeItem("removeChartDefault")
        }
        setShowChartDefault(removed?.length == 0)
    }

    const editCardOnDemand = (cardToEdit: CardOnDemand) => {
        const toEdit = cardsOnDemand.findIndex(chart => chart.id == cardToEdit.id)
        let response = prompt("Digite a nova altura", cardToEdit.height)
        if(response && response != "") {
            cardsOnDemand[toEdit].height = response
            setCardsOnDemand([...cardsOnDemand])
            localStorage.setItem(chartService.getCardsOnDemandStorageName(), JSON.stringify(cardsOnDemand))
        }
    }

    const orderCardOnDemand = (cardToEdit: CardOnDemand, direction: string) => {
        const toEdit = cardsOnDemand.findIndex(chart => chart.id == cardToEdit.id)
        if(direction == "UP" && toEdit > 0 && toEdit - 1 < cardsOnDemand.length) {
            const temp = cardsOnDemand[toEdit];
            cardsOnDemand[toEdit] = cardsOnDemand[toEdit - 1];
            cardsOnDemand[toEdit - 1] = temp;
        } else if(direction == "DOWN" && toEdit >= 0 && toEdit + 1 < cardsOnDemand.length) {
            const temp = cardsOnDemand[toEdit];
            cardsOnDemand[toEdit] = cardsOnDemand[toEdit + 1];
            cardsOnDemand[toEdit + 1] = temp;
        }
        setCardsOnDemand([...cardsOnDemand])
        localStorage.setItem(chartService.getCardsOnDemandStorageName(), JSON.stringify(cardsOnDemand))
    }

    const removeChartDefault = () => {
        localStorage.setItem("removeChartDefault", "true")
        setShowChartDefault(false);
    }

    const addFinancialRecordsCards = () => {
        console.log("adding")
        var totalNewPeriods: number = 6
        var newPeriods: Array<Period> = periodService.getPeriodMonths(financialRecordsCards.length + totalNewPeriods)
        financialRecordsCards.push(...newPeriods?.slice(-totalNewPeriods))
        financialRecordsCards?.slice(-totalNewPeriods).map(period => {
            financialRecordService.getByPeriod(period.start, period.end)
            .then((records: Array<FinancialRecord>) => {
                period.records = records.map(record => {record.date = moment(record.date, 'YYYY-MM-DD'); return record});
                setFinancialRecordsCards([...financialRecordsCards])
            })
            .catch(error => {
                toast?.pushError("Erro ao consultar de receitas/despesas de um período. " + error, 7000, "truncate-2-lines")
            }).finally(() => {})
        })
    }

    useEffect(() => {
        if(cardsOnDemand?.length > 0) {
            console.log("atualizando cards on demand")
            cardsOnDemand.map(cardOnDemand => chartService.setCardValues(cardOnDemand, toast))
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

    return (
        <>
            <div className="relative pt-12 pb-3 lg:pb-7 md:pt-32">
                {/* Card stats */}
                <div className="flex flex-wrap">
                    <div className={`w-full px-4 lg:w-6/12 xl:6-3/12`}>
                        <CardStats
                            statSubtitle="Receitas"
                            statTitle={isNaN(incomeTotal) ? null : currencyService.format(incomeTotal)}
                            statArrow="up"
                            statPercent="3.48"
                            statPercentColor="text-emerald-500"
                            statDescripiron="Since last month"
                            statIconName="far fa-chart-bar"
                            statIconColor="bg-red-500"
                        />
                    </div>
                    <div className={`w-full px-4 lg:w-6/12 xl:6-3/12`}>
                        <CardStats
                            statSubtitle="Despesas"
                            statTitle={isNaN(incomeTotal) ? null : currencyService.format(expenseTotal)}
                            statArrow="down"
                            statPercent="3.48"
                            statPercentColor="text-red-500"
                            statDescripiron="Since last week"
                            statIconName="fas fa-chart-pie"
                            statIconColor="bg-orange-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-row pl-4 pr-4 mb-7 lg:mb-0">
                <div className="ml-3 md:ml-7 absolute w-[1px] left-0 h-[250px] flex items-center justify-center">
                    <i className="text-xl cursor-pointer fa fa-chevron-left cards-swiper-button-prev hover:scale-125"></i>
                </div>
                <div className="mr-3 md:mr-7 absolute right-0 h-[250px] flex items-center justify-center">
                    <i className="text-xl cursor-pointer fa fa-chevron-right cards-swiper-button-next hover:scale-125"></i>
                </div>

                <Swiper
                    breakpoints={{
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 20
                        },
                        480: {
                            slidesPerView: 1,
                            spaceBetween: 30
                        },
                        800: {
                            slidesPerView: 2,
                            spaceBetween: 30
                            },
                            1000: {
                            slidesPerView: 3,
                            spaceBetween: 35
                            },
                            1200: {
                            slidesPerView: 4,
                            spaceBetween: 40
                            },
                    }}
                    navigation={{
                        nextEl: ".cards-swiper-button-next",
                        prevEl: ".cards-swiper-button-prev",
                    }}
                    onReachEnd={addFinancialRecordsCards}
                >
                    {financialRecordsCards?.map((period, index) => {
                        return ((index == 0 && (periodService.getPeriodIncomeTotal(period) != 0 || periodService.getPeriodExpenseTotal(period) != 0)) || index != 0) &&
                         <div key={period.start} className="w-full px-4 mb-12 xl:mb-0">
                            <SwiperSlide key={period.start}>
                                <CardFinancialRecord period={period} />
                            </SwiperSlide>
                        </div>
                    })}
                </Swiper>

            </div>

            {showChartDefault &&
            <div className="flex flex-wrap">
                <div className="w-full px-4 mb-8 xl:w-12/12" id={"chart-receitas-despesas"}>
                    <div className={`${financialRecordsChartTotal.some(period => period.totals == null) && "opacity-50"} bg-white rounded shadow-lg`}>
                        <div className="pr-2 py-2 mb-0 border-0 border-b-[1px] rounded-t bg-white">
                            <div className="flex flex-wrap items-center">
                                <div className="relative flex-1 flex-grow w-full max-w-full px-4">
                                    <h3 className="text-base font-semibold text-blueGray-700">
                                        Receitas e despesas
                                    </h3>
                                </div>
                                <div className="relative flex-1 flex-grow w-full max-w-[25px] px-1 text-right">
                                    <i className={`${cardsOnDemand?.length == 0 && "hidden"} mr-[-0.125rem] cursor-pointer text-base fas fa-trash `}
                                        title="Remover"
                                        onClick={() => removeChartDefault()}
                                    ></i>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded shadow-lg">
                            <Chart
                                options={chartService.periodTotalToChartOptions(financialRecordsChartTotal, "line", "MONTHLY", "INCOME_EXPENSE", colorService.getIncomesExpenses())}
                                series={chartService.periodTotalToChartSeries(financialRecordsChartTotal, "line")}
                                type="line"
                                width="100%"
                                height="430"
                            />
                        </div>
                    </div>
                </div>
            </div>
            }

            <div className="flex flex-wrap">
                {cardsOnDemand?.map(card =>
                    <div key={card.id} className={`w-full px-4 mb-8 card-on-demand-width-${CardOnDemandWidthType[card.width].replace('%', '')}`}>
                       <div className={`border-b-[1px] pr-2 py-2 mb-0 border-0 rounded-t bg-white`}>
                            <div className="flex flex-wrap items-center">
                                <div className="relative flex-1 flex-grow w-full max-w-full px-4">
                                    <h3 className="text-base font-semibold text-blueGray-700 text-overflow-ellipsis-1-line">
                                        {CardOnDemandFilterBy[card.filterBy] == CardOnDemandFilterBy.TAGS ? card.tags.map((tag, index) => {
                                            const separator = index + 2 < card.tags.length ? ", " : index + 1 < card.tags.length ? " e " : ""
                                            return `${tag.name}${separator}`
                                        }) : "Receitas e despesas"
                                    }
                                        {(card.type == "donut" || card.type == "pie") && ` (${card.totalPeriods} ${periodService.periodTypeToLabel(card.periodType, card.totalPeriods)})`}
                                    </h3>
                                </div>
                                <div className="relative flex-1 flex-grow w-full max-w-[20px] px-1 text-right">
                                    <CardOnDemandDropdown cardOnDemand={card} edit={editCardOnDemand} remove={removeCardOnDemand} order={orderCardOnDemand}></CardOnDemandDropdown>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded shadow-lg" style={{minHeight: card.height + "px"}}>
                            {card.type == "table" ?
                            <CardTableOnDemand cardOnDemand={card}></CardTableOnDemand> :
                            <Chart
                                options={chartService.chartOnDemandToOptions(card)}
                                series={chartService.chartOnDemandToSeries(card)}
                                type={card.type}
                                width={"100%"}
                                height={card.height}
                            />
                            }
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap">
                <div className="w-full px-4 mb-5 xl:w-12/12 mt[-2px]">
                    <div className="bg-white">
                    <button
                        className="w-full px-0 py-2 text-base font-bold text-center text-white transition-all duration-150 ease-linear rounded shadow outline-none disabled:opacity-50 bg-lightBlue-600 active:bg-blueGray-600 hover:shadow-lg focus:outline-none"
                        type="button"
                        onClick={() => setShowModal(true)}
                        >
                        <i className="mr-1 fas fa-sticky-note"></i> Adicionar novo card
                    </button>
                    </div>
                </div>
            </div>
            {showModal ? (
                <ModalAddCard setShowModalState={setShowModal} setChartsOnDemandState={setCardsOnDemand} chartsOnDemand={cardsOnDemand} ></ModalAddCard>
            ) : null}
        </>
    );
}

Dashboard.layout = Admin;

export default Dashboard;