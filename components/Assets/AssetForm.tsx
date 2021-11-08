import { useEffect, useState } from "react";
import { Asset } from "../../class/Asset";
import { Tag } from "../../class/Tag";
import { tagService } from "../../services/tag.service";
import { useToast } from "../Toast/ToastProvider";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { assetService } from "../../services/asset.service";
import moment from "moment";
import CreatableSelect from 'react-select/creatable';
import { AssetType } from "../../class/AssetType";
import { AssetRendaFixaType } from "../../class/AssetRendaFixaType";
import { AssetRendaFixaRateType } from "../../class/AssetRendaFixaRateType";
import { utilsService } from "../../services/utils.service";

type AssetFormProps = {
    records: Array<Asset>,
    recordsState: React.Dispatch<React.SetStateAction<Array<Asset>>>,
}

export const AssetForm: React.FC<AssetFormProps> = (props) => {


    const [showForm, setShowForm] = useState(false);
    const [showRendaFixa, setShowRendaFixa] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [values, setValues] = useState([]);
    const [optionsTags, setOptionsTags] = useState([]);

    const toast = useToast();

    const keys = Object.keys;

    useEffect(() => {
        setIsLoading(true)

        tagService.getAll()
            .then((tags: Array<Tag>) => {
                setOptionsTags(tags.map(tag => ({ ...tag, label: tag.name, value: tag.name })))
            })
            .catch(error => {
                toast?.pushError("Erro ao consultar tags. " + error, 7000, "truncate-2-lines");
            }).finally(() => setIsLoading(false))

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleCreate = (inputValue: any) => {
        const options: any = optionsTags;
        const newOption = createOption(inputValue);
        setOptionsTags([...options, newOption]);
        setValues([...values, newOption]);
    };

    const createOption = (label: string) => ({
        id: undefined,
        label,
        name: label,
        value: label
    });

    // form validation rules
    const validationSchema = Yup.object().shape({
        initialDate: Yup.string().required(),
        initialValue: Yup.string().required(),
        type: Yup.string().required()
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(form: Asset) {
        const asset: Asset = new Asset(
            null,
            utilsService.getNullable(form.name),
            utilsService.getNullable(form.details),
            form.initialValue,
            utilsService.getNullable(form.endValue),
            form.initialDate,
            utilsService.getNullable(form.endDate),
            form.type,
            values,
            AssetType[form.type] == AssetType.RENDA_FIXA ? utilsService.getNullable(form.rendaFixaType) : null,
            AssetType[form.type] == AssetType.RENDA_FIXA ? utilsService.getNullable(form.rendaFixaRateType) : null,
            AssetType[form.type] == AssetType.RENDA_FIXA ? utilsService.getNullable(form.bank) : null,
            AssetType[form.type] == AssetType.RENDA_FIXA ? utilsService.getNullable(form.rate): null,
            getLiquidez(form.type, (form.liquidez as any))
        )

        return assetService.save(asset)
            .then((response: Asset) => {
                response.initialDate = moment(response.initialDate, 'YYYY-MM-DD')
                response.endDate = response.endDate ? moment(response.endDate, 'YYYY-MM-DD') : undefined
                props.records.push(response)
                props.records.sort((a: Asset, b: Asset) => a.endDate?.unix() - b.endDate?.unix())
                props.recordsState(props.records)
                toast.pushSuccess("Registro salvo com sucesso", 5000);
            })
            .catch(error => {
                toast?.pushError("Erro ao salvar registro. " + error, 7000, "truncate-2-lines");
                setError('apiError', { message: error?.message });
            });
    }

    const getLiquidez = (type: string, liquidez: string): boolean => {
        return AssetType[type] == AssetType.RENDA_FIXA ? liquidez == "Sim" : null
    }

    return (
        <>
            <div className="relative flex flex-col w-full min-w-0 mb-6 break-words border-0 rounded-lg shadow-lg bg-blueGray-100">
                <div className="px-4 py-4 mb-0 bg-white rounded-t cursor-pointer lg:w-12/12" onClick={() => setShowForm(!showForm)}>
                    <div className="flex justify-between text-center">
                        <h6 className="text-xl font-bold text-blueGray-700">Formulário</h6>
                        <i
                            className={`mt-1 cursor-pointer text-xl fas ${showForm ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'} `}
                        ></i>
                    </div>
                </div>
                <div className={`${showForm ? '' : 'hidden'} flex-auto px-4 py-2 pt-0 lg:px-2`}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-wrap mt-6 mb-6">
                            <div className="w-full px-4 lg:w-4/12">
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name')}
                                        className={`${errors.name ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                        defaultValue=""
                                    />
                                </div>
                            </div>
                            <div className="w-full px-4 lg:w-4/12">
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Data inicial
                                    </label>
                                    <input
                                        type="date"
                                        {...register('initialDate')}
                                        className={`${errors.initialDate ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    />
                                </div>
                            </div>
                            <div className="w-full px-4 lg:w-4/12">
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Data final
                                    </label>
                                    <input
                                        type="date"
                                        {...register('endDate')}
                                        className={`${errors.endDate ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    />
                                </div>
                            </div>
                            <div className="w-full px-4 lg:w-4/12">
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Valor inicial
                                    </label>
                                    <input
                                        type="number" min="1" step="any"
                                        {...register('initialValue')}
                                        className={`${errors.initialValue ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                        defaultValue=""
                                    />
                                </div>
                            </div>
                            <div className="w-full px-4 lg:w-4/12">
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Valor final
                                    </label>
                                    <input
                                        type="number" min="1" step="any"
                                        {...register('endValue')}
                                        className={`${errors.endValue ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                        defaultValue=""
                                    />
                                </div>
                            </div>
                            <div className={`w-full px-4 ${showRendaFixa ? "lg:w-4/12" : "lg:w-4/12"}`}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Tipo
                                    </label>
                                    <select
                                        {...register('type')}
                                        onChange={(e) => setShowRendaFixa(AssetType[e.target.value] == AssetType.RENDA_FIXA)}
                                        className={`${errors.type ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    >
                                        <option value="" label="Selecione o tipo" />
                                        {keys(AssetType).map(type =>
                                            <option key={AssetType[type]} value={type} label={AssetType[type]} />
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className={`${!showRendaFixa && "hidden"} w-full px-4 lg:w-4/12`}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Banco
                                    </label>
                                    <input
                                        type="text"
                                        {...register('bank')}
                                        className={`${errors.bank ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                        defaultValue=""
                                    />
                                </div>
                            </div>
                            <div className={`${!showRendaFixa && "hidden"} w-full px-4 lg:w-2/12`}>
                                <div className="relative w-full mb-3">
                                    <label className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Tipo de renda fixa
                                    </label>
                                    <select
                                        {...register('rendaFixaType')}
                                        className={`${errors.rendaFixaType ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    >
                                        <option value="" label="Selecione o tipo de renda fixa" />
                                        {keys(AssetRendaFixaType).map(type =>
                                            <option key={AssetRendaFixaType[type]} value={type} label={AssetRendaFixaType[type]} />
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className={`${!showRendaFixa && "hidden"} w-full px-4 lg:w-2/12`}>
                                <div className="relative w-full mb-3">
                                    <label className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Tipo de taxa
                                    </label>
                                    <select
                                        {...register('rendaFixaRateType')}
                                        className={`${errors.rendaFixaRateType ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    >
                                        <option value="" label="Selecione o tipo de taxa" />
                                        {keys(AssetRendaFixaRateType).map(type =>
                                            <option key={AssetRendaFixaRateType[type]} value={type} label={AssetRendaFixaRateType[type]} />
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className={`${!showRendaFixa && "hidden"} w-full px-4 lg:w-2/12`}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Taxa
                                    </label>
                                    <input
                                        type="number" min="1" step="any"
                                        {...register('rate')}
                                        className={`${errors.rate ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                        defaultValue=""
                                    />
                                </div>
                            </div>
                            <div className={`${!showRendaFixa && "hidden"} w-full px-4 lg:w-2/12`}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Liquidez
                                    </label>
                                    <select
                                        {...register('liquidez')}
                                        className={`${errors.liquidez ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    >
                                        <option value="" label="Selecione a liquidez" />
                                        <option key="Sim" value="Sim" label="Sim" />
                                        <option key="Não" value="Não" label="Não" />
                                    </select>
                                </div>
                            </div>
                            <div className={`w-full px-4  ${showRendaFixa ? "lg:w-12/12" : "lg:w-12/12"}`}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Tags
                                    </label>
                                    <CreatableSelect
                                        {...register('tags')}
                                        name="tags"
                                        classNamePrefix="react-select-tw"
                                        instanceId={1}
                                        isClearable
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        isMulti
                                        onChange={(value: []) => setValues(value)}
                                        onCreateOption={handleCreate}
                                        options={optionsTags}
                                        placeholder="Crie ou selecione as tags..."
                                        styles={customStyles}
                                        value={values}
                                    />
                                </div>
                            </div>
                            <div className="w-full px-4 lg:w-12/12">
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Descrição
                                    </label>
                                    <textarea
                                        {...register('details')}
                                        rows={3}
                                        className="w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row-reverse w-full px-4 pt-4">
                                <button
                                    className="w-full px-0 py-2 mb-1 text-base font-bold text-center text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none disabled:opacity-50 bg-lightBlue-600 active:bg-blueGray-600 hover:shadow-lg focus:outline-none"
                                    type="submit"
                                    disabled={formState.isSubmitting}
                                >
                                    {formState.isSubmitting && <i className="mx-auto mr-2 text-white fas fa-circle-notch animate-spin text-1xl"></i>}
                                    <i className="mr-2 fas fa-cloud-upload-alt"></i> Salvar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}