import { useEffect, useState } from 'react';
import Select from 'react-select'
import { CardOnDemand } from '../../class/CardOnDemand';
import { Tag } from '../../class/Tag';
import { tagService } from '../../services/tag.service';
import { useToast } from '../Toast/ToastProvider';
import { v4 as uuidv4 } from 'uuid';
import { chartService } from '../../services/chart.service';

import { CardOnDemandType } from '../../class/CardOnDemandType';
import { PeriodType } from '../../class/PeriodType';
import { CardOnDemandWidthType } from '../../class/CardOnDemandWidthType';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { CardOnDemandFilterBy } from '../../class/CardOnDemandFilterBy';
import { cardService } from '../../services/card.service';

type ModalServiceTermsProps = {
    setShowModalState: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalServiceTerms: React.FC<ModalServiceTermsProps> = (props) => {

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-scroll outline-none z-70 focus:outline-none">
                <div className="relative w-[99%] h-[99%] md:h-auto max-w-3xl mx-auto my-6">
                    {/*content*/}
                    <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                            <h3 className="text-2xl font-semibold">
                                Termos de serviço
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
                        <div className="relative flex-wrap px-6 py-2">
                            <p className="my-4 leading-relaxed text-blueGray-500">
                                Este site é um projeto pessoal de testes utilizando NextJs e Tailwind. Os dados desse e dos demais formulários não são armazenados. Cada usuário deve prover o seu servidor de armazenamento e configurar o endereço  no link <b>&quot;Alterar api?&quot;</b>, presente na área de login.

                            </p>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                            <button
                                className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-blueGray-800 active:bg-blueGray-600 hover:shadow-lg focus:outline-none"
                                type="button"
                                onClick={() => props.setShowModalState(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 bg-black opacity-25 z-60"></div>
        </>
    )
}