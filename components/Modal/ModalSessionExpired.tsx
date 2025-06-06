import { userService } from "../../services/user.service"

type ModalSessionExpiredProps = {
    setShowModalState: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalSessionExpired: React.FC<ModalSessionExpiredProps> = (props) => {

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-scroll outline-none z-70 focus:outline-none">
                <div className="relative w-[99%] h-auto max-w-3xl mx-auto my-6">
                    {/*content*/}
                    <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                            <h3 className="text-2xl font-semibold">
                                Sessão expirada
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
                                Clique no botão abaixo para atualizar a página
                            </p>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                            <button
                                className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-blueGray-800 active:bg-blueGray-600 hover:shadow-lg focus:outline-none"
                                type="button"
                                onClick={() => userService.logout()}
                            >
                                Atualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 bg-black opacity-25 z-60"></div>
        </>
    )
}