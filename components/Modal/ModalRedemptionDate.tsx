import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import { Asset } from "../../class/Asset";
import { useEffect, useReducer } from "react";
import { currencyService } from "../../services/currency.service";

type ModalRedemptionDateProps = {
    setShowModalState: React.Dispatch<React.SetStateAction<boolean>>,
    record: Asset,
    onSave: Function
}

export const ModalRedemptionDate: React.FC<ModalRedemptionDateProps> = (props) => {

    // form validation rules
    const validationSchema = Yup.object().shape({
        redemptionDate: Yup.string(),
        endValue: Yup.string(),
    }).test('both-or-none', 'Preencha ambos os campos ou nenhum', function (values) {
        const { redemptionDate, endValue } = values;
        if ((redemptionDate && !endValue) || (!redemptionDate && endValue)) {
            return this.createError({ path: redemptionDate ? 'endValue' : 'redemptionDate' });
        }
        return true;
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, control, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(formValues) {
        props.onSave(formValues)
    }

    useEffect(() => {
        //SETA O VALOR INICIAL
        if (props.record.endValue !== undefined) {
            reset({ endValue: props.record.endValue });
        }
    }, [props.record.endValue]);

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-scroll outline-none z-70 focus:outline-none">
                <div className="relative w-[99%] h-auto max-w-xl mx-auto my-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/*content*/}
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                                <h3 className="text-2xl font-semibold">
                                    Dados do investimento
                                </h3>
                                <button
                                    className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-70 focus:outline-none"
                                    title="Fechar"
                                    type="button"
                                    onClick={() => props.setShowModalState(false)}
                                >
                                    <span className="block w-6 h-6 -mt-1 text-2xl text-black bg-transparent outline-none opacity-70 focus:outline-none">
                                        ×
                                    </span>
                                </button>
                            </div>
                            {/*body*/}

                            <div className="relative flex-wrap px-6 py-2">

                                <div className="flex flex-wrap mt-6 mb-6">
                                    <div className="w-full px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block mb-2 text-xs font-bold text-left uppercase text-blueGray-600"
                                                htmlFor="grid-password"
                                            >
                                                Data do resgate
                                            </label>
                                            <input
                                                type="date"
                                                defaultValue={props.record.redemptionDate as any}
                                                {...register('redemptionDate')}
                                                className={`${errors.redepmtionDate ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-6 mb-3">
                                    <div className="w-full px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block mb-2 text-xs font-bold text-left uppercase text-blueGray-600"
                                                htmlFor="grid-password"
                                            >
                                                Valor
                                            </label>
                                            <Controller
                                                name="endValue"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        onFocus={e => e.target.select()}
                                                        value={currencyService.format(field.value)}
                                                        onChange={(e) => field.onChange(currencyService.toNumber(e.target.value))}
                                                        className={`${errors.endValue ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/*footer*/}
                            <div className="flex items-center justify-end px-6 py-6 border-t border-solid rounded-b border-blueGray-200">
                                <button
                                    className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-blueGray-800 active:bg-blueGray-600 hover:shadow-lg focus:outline-none"
                                    type="submit"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
            <div className="fixed inset-0 bg-black opacity-25 z-60"></div>
        </>
    )
}