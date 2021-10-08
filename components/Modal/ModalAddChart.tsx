import { useEffect, useState } from 'react';
import Select from 'react-select'
import { ChartOnDemand } from '../../class/ChartOnDemand';
import { Tag } from '../../class/Tag';
import { tagService } from '../../services/tag.service';
import { useToast } from '../Toast/ToastProvider';
import { v4 as uuidv4 } from 'uuid';
import { chartService } from '../../services/chart.service';

import { ChartOnDemandType } from '../../class/ChartOnDemandType';
import { PeriodType } from '../../class/PeriodType';
import { ChartOnDemandWidthType } from '../../class/ChartOnDemandWidthType';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { ChartOnDemandFilterBy } from '../../class/ChartOnDemandFilterBy';

type ModalAddChartProps = {
    chartsOnDemand: Array<ChartOnDemand>,
    setChartsOnDemandState: React.Dispatch<React.SetStateAction<Array<ChartOnDemand>>>,
    setShowModalState: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalAddChart: React.FC<ModalAddChartProps> = (props) => {

    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState<Array<any>>([])
    const [optionsTags, setOptionsTags] = useState([])
    const [showTags, setShowTags] = useState<boolean>(false)

    const toast = useToast()

    const keys = Object.keys

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

    // form validation rules
    const validationSchema = Yup.object().shape({
        filterBy: Yup.string().required(),
        periodType: Yup.string().required(),
        totalPeriods: Yup.string().required(),
        type: Yup.string().required(),
        height: Yup.string().required(),
        width: Yup.string().required(),
    });

  const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit({ filterBy, periodType, totalPeriods, type, height, width }) {
        if((showTags && values?.length > 0) || !showTags) {
            let typeLowerCase:string = type
            type = typeLowerCase?.toLowerCase()

            let chartOnDemand = new ChartOnDemand(
                uuidv4(),
                type,
                width,
                height,
                values.map(value => new Tag(value.id, value.label)),
                periodType,
                totalPeriods,
                [],
                filterBy
            );

            await chartService.setChartValues(chartOnDemand, toast)
            const charts = [...props.chartsOnDemand, chartOnDemand]
            props.setChartsOnDemandState(charts)
            localStorage.setItem(chartService.getChartsOnDemandStorageName(), JSON.stringify(charts))
            props.setShowModalState(false)
      }
    }


    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-scroll outline-none z-70 focus:outline-none">
                <div className="relative w-[99%] h-[99%] md:h-auto max-w-3xl mx-auto my-6">
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative flex-wrap p-6 pb-2">
                                <label
                                    className="block mb-2 ml-4 text-xs font-bold uppercase text-blueGray-600"
                                    htmlFor="grid-password"
                                >
                                    Filtrar por
                                </label>
                                <div className="w-full px-4">
                                    <div className="relative w-full mb-3">
                                        <select
                                            {...register('filterBy')}
                                            className={`${errors.filterBy && 'is-invalid'} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-1 border-coolGray-300 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                            onBlur={(val) => {setShowTags(ChartOnDemandFilterBy[val.target.value] == ChartOnDemandFilterBy.TAGS)}}
                                        >
                                            <option value="" label="Selecione o filtro"/>
                                            {keys(ChartOnDemandFilterBy).map(filterBy =>
                                            <option key={ChartOnDemandFilterBy[filterBy]} value={filterBy} label={ChartOnDemandFilterBy[filterBy]}/>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={`${!showTags && "hidden"} relative flex-wrap p-6 pt-0 pb-2`}>
                                <label
                                    className="block mb-2 ml-4 text-xs font-bold uppercase text-blueGray-600"
                                    htmlFor="grid-password"
                                >
                                    Tags
                                </label>
                                <div className="w-full px-4">
                                    <div className="relative w-full mb-3">
                                        <Select
                                            name="tags"
                                            classNamePrefix={`${formState.submitCount > 0 && values?.length == 0 && "react-select-is-invalid"} react-select-tw`}
                                            instanceId={1}
                                            isClearable
                                            isDisabled={isLoading}
                                            isLoading={isLoading}
                                            isMulti
                                            onChange={(value: []) => setValues(value)}
                                            options={optionsTags}
                                            placeholder="Selecione as tags"
                                            styles={customStyles}
                                            value={values}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="relative flex flex-col p-6 pt-0 pb-2">
                                <div className="flex-auto">
                                    <div className="flex flex-wrap">
                                        <div className="w-full px-4 lg:w-6/12">
                                            <div className="relative w-full mb-3">
                                                <label
                                                    className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                                    htmlFor="grid-password"
                                                >
                                                Período
                                                </label>
                                                <select
                                                    {...register('periodType')}
                                                    className={`${errors.periodType && 'is-invalid'} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-1 border-coolGray-300 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                                >
                                                    <option value="" label="Selecione o período"/>
                                                    {keys(PeriodType).map(type =>
                                                    <option key={PeriodType[type]} value={type} label={PeriodType[type]}/>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full px-4 lg:w-6/12">
                                            <div className="relative w-full mb-3">
                                                <label
                                                    className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                                    htmlFor="grid-password"
                                                >
                                                Quantidade por período
                                                </label>
                                                <input
                                                    {...register('totalPeriods')}
                                                    type="number"
                                                    min={0}
                                                    className={`${errors.totalPeriods && 'is-invalid'} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-1 border-coolGray-300 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                                    placeholder={"Ex.: 31 dias, 12 meses, 2 anos"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative flex flex-col p-6 pt-0 pb-2">
                                <div className="flex-auto">
                                    <div className="flex flex-wrap">
                                        <div className="w-full px-4 lg:w-6/12">
                                            <div className="relative w-full mb-3">
                                                <label
                                                    className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                                    htmlFor="grid-password"
                                                >
                                                Tipo
                                                </label>
                                                <select
                                                    {...register('type')}
                                                    className={`${errors.type && 'is-invalid'} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-1 border-coolGray-300 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                                >
                                                    <option value="" label="Selecione o tipo"/>
                                                    {keys(ChartOnDemandType).map(type =>
                                                    <option key={ChartOnDemandType[type]} value={type} label={ChartOnDemandType[type]}/>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full px-4 lg:w-3/12">
                                            <div className="relative w-full mb-3">
                                                <label
                                                    className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                                    htmlFor="grid-password"
                                                >
                                                Altura
                                                </label>
                                                <input
                                                    {...register('height')}
                                                    type="number"
                                                    min={0}
                                                    className={`${errors.height && 'is-invalid'} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-1 border-coolGray-300 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                                    defaultValue={450}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full px-4 lg:w-3/12">
                                            <div className="relative w-full mb-3">
                                                <label
                                                    className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                                    htmlFor="grid-password"
                                                >
                                                Largura
                                                </label>
                                                <select
                                                    {...register('width')}
                                                    className={`${errors.width && 'is-invalid'} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-1 border-coolGray-300 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                                >
                                                    <option value="" label="Selecione a largura"/>
                                                    {keys(ChartOnDemandWidthType).map(type =>
                                                    <option key={ChartOnDemandWidthType[type]} value={type} label={ChartOnDemandWidthType[type]}/>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                                <button
                                    className="w-full px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-lightBlue-600 active:bg-lightBlue-700 hover:shadow-lg focus:outline-none"
                                    type="submit"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 bg-black opacity-25 z-60"></div>
        </>
    )
}