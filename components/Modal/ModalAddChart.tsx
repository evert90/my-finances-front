import { useEffect, useState } from 'react';
import Select from 'react-select'
import { ChartOnDemand } from '../../class/ChartOnDemand';
import { Tag } from '../../class/Tag';
import { TagTotal } from '../../class/TagTotal';
import { financialRecordService } from '../../services/financial-record.service';
import { periodService } from '../../services/period.service';
import { tagService } from '../../services/tag.service';
import { useToast } from '../Toast/ToastProvider';
import { v4 as uuidv4 } from 'uuid';
import { chartService } from '../../services/chart.service';
import { userService } from '../../services/user.service';

type ModalAddChartProps = {
    chartsOnDemand: Array<ChartOnDemand>,
    setChartsOnDemandState: React.Dispatch<React.SetStateAction<Array<ChartOnDemand>>>,
    setShowModalState: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalAddChart: React.FC<ModalAddChartProps> = (props) => {

    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState([])
    const [optionsTags, setOptionsTags] = useState([])

    const toast = useToast()

    useEffect(() => {
        setIsLoading(true)

        tagService.getAll()
          .then((tags: Array<Tag>) => {
            setOptionsTags(tags.map(tag => ({...tag, label: tag.name, value: tag.name})))
          })
          .catch(error => {
            toast?.pushError("Erro ao consultar tags. " + error, 7000, "truncate-2-lines");
          }).finally(() => setIsLoading(false))

    }, [])

    const customStyles = {
        control: (base, state) => ({
            ...base,
            height: 44,
            minHeight: 35,
            borderColor: state.isFocused ? "rgb(14, 160, 226)" : base.borderColor,
            "&:hover": {
            borderColor: state.isFocused ? "rgb(14, 160, 226)" : base.borderColor
            },
            borderLeft: state.isFocused ? "5px solid rgb(14, 160, 226)" : null
        })
    };

    async function save() {
        let chartOnDemand = new ChartOnDemand(
            uuidv4(),
            "line",
            "100%",
            "450",
            values.map(value => new Tag(value.id, value.label)),
            12,
            periodService.getPeriodTagTotalMonths(12)
        );

        await chartService.setChartValues(chartOnDemand, toast)
        const charts = [...props.chartsOnDemand, chartOnDemand]
        props.setChartsOnDemandState(charts)
        localStorage.setItem(`chartsOnDemand${userService.getUserValue()?.user?.id}`, JSON.stringify(charts))
        props.setShowModalState(false)
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="relative w-auto max-w-3xl mx-auto my-6">
                    {/*content*/}
                    <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                            <h3 className="text-3xl font-semibold">
                                Novo gráfico
                            </h3>
                            <button
                                className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-70 focus:outline-none"
                                title="Fechar"
                                onClick={() => props.setShowModalState(false)}
                            >
                                <span className="block w-6 h-6 -mt-1 text-2xl text-black bg-transparent outline-none opacity-70 focus:outline-none">
                                ×
                                </span>
                            </button>
                        </div>
                        {/*body*/}
                        <div className="relative flex-auto p-6">
                            <div className="w-full px-4 lg:w-[35rem]">
                                <div className="relative w-full mb-3">
                                    <Select
                                        name="tags"
                                        classNamePrefix="react-select-tw"
                                        instanceId={1}
                                        isClearable
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        isMulti
                                        onChange={(value: []) => setValues(value)}
                                        options={optionsTags}
                                        placeholder="Selecione as tags..."
                                        styles={customStyles}
                                        value={values}
                                    />
                                </div>
                            </div>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                            <button
                                className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-lightBlue-600 active:bg-lightBlue-700 hover:shadow-lg focus:outline-none"
                                type="button"
                                onClick={() => save()}
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
    )
}