import React from "react";
import { createPopper } from "@popperjs/core";
import { FinancialRecord } from "../../class/FinancialRecord";
import { financialRecordService } from "../../services/financial-record.service";
import { useToast } from "../Toast/ToastProvider";
import { Asset } from "../../class/Asset";
import { AssetRendaFixaRateType } from "../../class/AssetRendaFixaRateType";
import { assetService } from "../../services/asset.service";

type TableDropdownProps = {
  record: FinancialRecord | Asset
  stateChanger: Function
}

const TableDropdown: React.FC<TableDropdownProps> = (props) => {

    const toast = useToast();

    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef: any = React.createRef();
    const popoverDropdownRef: any = React.createRef();

    const openDropdownPopover = () => {
        const instance = createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "left-start",
        });
        setDropdownPopoverShow(true);
        setTimeout(() => {
            instance.update();
        }, 50)
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };

    const editRecord = (event: React.MouseEvent) => {
        event.preventDefault();
        if((props.record as Asset)?.initialDate) {
            let response = prompt("Digite o valor final")
            if(response && response != "") {
                (props.record as Asset).endValue = response as any
                assetService.save((props.record as Asset))
                .then((response) => {
                    toast.pushSuccess("Registro editado com sucesso", 5000)
                })
                .catch(error => {
                    toast?.pushError("Erro ao editar registro. " + error, 7000, "truncate-2-lines");
                }).finally(() => {})
            }

        } else if((props.record as FinancialRecord)?.value || (props.record as FinancialRecord)?.value === 0) {

            let response = prompt("Digite o novo valor")
            if(response && response != "") {
                (props.record as FinancialRecord).value = response as any
                financialRecordService.save((props.record as FinancialRecord))
                .then((response) => {
                    toast.pushSuccess("Registro editado com sucesso", 5000)
                })
                .catch(error => {
                    toast?.pushError("Erro ao editar registro. " + error, 7000, "truncate-2-lines");
                }).finally(() => {})
            }

        }

    }

    const deleteRecord = (event: React.MouseEvent) => {
        event.preventDefault();
        const service: any = (props.record as Asset).initialDate ? assetService : financialRecordService;
        service.deleteById(props.record.id)
            .then((response) => {
                toast.pushSuccess("Registro removido com sucesso", 5000)
                props.stateChanger(props.record)
            })
            .catch(error => {
                toast?.pushError("Erro ao excluir registro. " + error, 7000, "truncate-2-lines");
            }).finally(() => {})
    }

    return (
        <>
            <a
                className="px-3 py-1 text-blueGray-500"
                href="#pablo"
                ref={btnDropdownRef}
                onClick={(e) => {
                    e.preventDefault();
                    dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                }}
            >
                <i className="fas fa-ellipsis-v"></i>
            </a>

            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? "block " : "hidden ") +
                    "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-[10rem]"
                }
            >
                <a
                    href="#pablo"
                    className={
                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-gray-100"
                    }
                    onClick={(e) => {closeDropdownPopover(); editRecord(e)}}
                >
                    <i className="mr-2 fas fa-edit"></i> Editar
                </a>
                <a
                    href="#pablo"
                    className={
                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-gray-100"
                    }
                    onClick={(e) => {closeDropdownPopover(); deleteRecord(e)}}
                >
                    <i className="mr-2.5 fas fa-trash"></i> Remover
                </a>
            </div>
        </>
    );
};

export default TableDropdown;
