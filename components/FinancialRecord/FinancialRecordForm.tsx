import { useEffect, useState } from "react";
import { FinancialRecordType } from "../../class/FinancialRecordType";
import CreatableSelect from 'react-select/creatable';
import { useToast } from "../Toast/ToastProvider";
import { tagService } from "../../services/tag.service";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { FinancialRecord } from "../../class/FinancialRecord";
import { financialRecordService } from "../../services/financial-record.service";
import { Tag } from "../../class/Tag";
import { RecurrencePeriod } from "../../class/RecurrencePeriod";
import { FinancialRecordRecurrence } from "../../class/FinancialRecordRecurrence";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage } from "../../helpers/fetch-wrapper";

export const FinancialRecordForm: React.FC = () => {

    const [showForm, setShowForm] = useState(false);
    const [showPaidAndNotification, setShowPaidAndNotification] = useState(false);
    const [showRecurrenceOptions, setshowRecurrenceOptions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [optionsTags, setOptionsTags] = useState([]);
    const [values, setValues] = useState([]);

    const toast = useToast();

    const queryClient = useQueryClient();

    const mutation = useMutation(
        (newFinancialRecord: FinancialRecord): Promise<FinancialRecord> => financialRecordService.save(newFinancialRecord),
        {
            onSuccess: () => {
                queryClient.refetchQueries(["financialRecords"])
                toast.pushSuccess("Registro salvo com sucesso", 5000);
            },
            onError: (error: ErrorMessage) => {
                toast?.pushError("Erro ao salvar registro. " + error, 7000, "truncate-2-lines");
            }
        }
    )

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

    const keys = Object.keys;

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
        name: Yup.string().required(),
        date: Yup.string().required(),
        value: Yup.string().required(),
        type: Yup.string().required()
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ name, date, value, tags, type, details, recurrence, paid, notification }) {
        let financialRecord = new FinancialRecordRecurrence(
            null,
            name,
            details,
            value,
            date,
            type,
            values,
            getPaidOrNotification(type, paid),
            getPaidOrNotification(type, notification),
            getRecurrence(recurrence),
            getRecurrence(recurrence) ? RecurrencePeriod.MONTHLY : null,
            getRecurrence(recurrence) ? 1 : null,
            getRecurrence(recurrence) ? true : null)

        return mutation.mutate(financialRecord);
    }

    const getPaidOrNotification = (type: string, item: string): boolean => {
        return FinancialRecordType[type] == FinancialRecordType.EXPENSE ? item == "Sim" : null
    }

    const getRecurrence = (recurrence: string): boolean => {
        return recurrence == "Sim"
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
                                        Data
                                    </label>
                                    <input
                                        type="date"
                                        {...register('date')}
                                        className={`${errors.date ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    />
                                </div>
                            </div>
                            <div className="w-full px-4 lg:w-4/12">
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Valor
                                    </label>
                                    <input
                                        type="number" min="0" step="any"
                                        {...register('value')}
                                        className={`${errors.value ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                        defaultValue=""
                                    />
                                </div>
                            </div>
                            <div className={`w-full px-4 lg:w-12/12`}>
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
                            <div className={`w-full px-4 ${showPaidAndNotification ? "lg:w-3/12" : "lg:w-6/12"}`}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Tipo
                                    </label>
                                    <select
                                        {...register('type')}
                                        onChange={(e) => setShowPaidAndNotification(FinancialRecordType[e.target.value] == FinancialRecordType.EXPENSE)}
                                        className={`${errors.type ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    >
                                        <option value="" label="Selecione o tipo" />
                                        {keys(FinancialRecordType).map(type =>
                                            <option key={FinancialRecordType[type]} value={type} label={FinancialRecordType[type]} />
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className={`w-full px-4 ${showPaidAndNotification ? "lg:w-3/12" : "lg:w-6/12"}`}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Recorrência
                                    </label>
                                    <select
                                        {...register('recurrence')}
                                        onChange={(e: any) => setshowRecurrenceOptions(e?.target?.value == "Sim")}
                                        className={`${errors.recurrence ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    >
                                        <option defaultChecked key="Não" value="Não" label="Não" />
                                        <option key="Sim" value="Sim" label="Sim" />
                                    </select>
                                </div>
                            </div>
                            <div className={`${!showPaidAndNotification && "hidden"} w-full px-4 lg:w-3/12`}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Pago
                                    </label>
                                    <select
                                        {...register('paid')}
                                        className={`${errors.paid ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    >
                                        <option key="Não" value="Não" label="Não" />
                                        <option defaultChecked key="Sim" value="Sim" label="Sim" />
                                    </select>
                                </div>
                            </div>
                            <div className={`${!showPaidAndNotification && "hidden"} w-full px-4 lg:w-3/12`}>
                                <div className="relative w-full mb-3">
                                    <label
                                        className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                                        htmlFor="grid-password"
                                    >
                                        Notificação <i className={`cursor-pointer fas fa-question-circle`} title="Você receberá notificações próximo a data de vencimento"></i>
                                    </label>
                                    <select
                                        {...register('notification')}
                                        className={`${errors.notification ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                    >
                                        <option key="Não" value="Não" label="Não" />
                                        <option defaultChecked key="Sim" value="Sim" label="Sim" />
                                    </select>
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