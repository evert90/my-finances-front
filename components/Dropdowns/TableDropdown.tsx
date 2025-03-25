import React, { useState } from "react";
import { createPopper } from "@popperjs/core";
import { FinancialRecord } from "../../class/FinancialRecord";
import { financialRecordService } from "../../services/financial-record.service";
import { useToast } from "../Toast/ToastProvider";
import { Asset } from "../../class/Asset";
import { assetService } from "../../services/asset.service";
import { useQueryClient } from '@tanstack/react-query';
import { FinancialRecordRecurrence } from "../../class/FinancialRecordRecurrence";
import { financialRecordRecurrenceService } from "../../services/financial-record-recurrence.service";
import { ModalRedemptionDate } from "../Modal/ModalRedemptionDate";
import { ModalEditValue } from "../Modal/ModalEditValue";

type TableDropdownProps = {
    record: FinancialRecord | FinancialRecordRecurrence | Asset
    callback: Function,
    onlyDelete?: boolean
}

const TableDropdown: React.FC<TableDropdownProps> = (props) => {

    const toast = useToast();

    const queryClient = useQueryClient();

    const [showModalAsset, setShowModalAsset] = useState<boolean>(false)

    const [showModalFinancialRecord, setShowModalFinancialRecord] = useState<boolean>(false)

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

    const handleSaveAsset = (updatedData) => {
        setShowModalAsset(false);
        editAsset(updatedData);
    };

    const handleSaveFinancialRecord = (updatedData) => {
        setShowModalFinancialRecord(false);
        editFinancialRecord(updatedData);
    };

    const editAsset = (updatedData) => {
        if (updatedData) {
            const oldValue = (props.record as Asset).endValue;
            (props.record as Asset).redemptionDate = updatedData.redemptionDate as any
            (props.record as Asset).endValue = updatedData.endValue as any
            assetService.save((props.record as Asset))
                .then((response) => {
                    queryClient.refetchQueries(["assets"])
                    toast.pushSuccess("Registro editado com sucesso", 5000)
                })
                .catch(error => {
                    (props.record as Asset).endValue = oldValue;
                    toast?.pushError("Erro ao editar registro. " + error, 7000, "truncate-2-lines");
                }).finally(() => { })
        }
    }

    const editFinancialRecord = (updatedData) => {
        if (updatedData) {
            const oldValue = (props.record as FinancialRecord).value;
            (props.record as FinancialRecord).value = updatedData.value as any
            financialRecordService.save((props.record as FinancialRecord))
                .then((response) => {
                    queryClient.refetchQueries(["financialRecords"])
                    toast.pushSuccess("Registro editado com sucesso", 5000)
                })
                .catch(error => {
                    (props.record as FinancialRecord).value = oldValue;
                    toast?.pushError("Erro ao editar registro. " + error, 7000, "truncate-2-lines");
                }).finally(() => { })
        }
    }

    const editRecord = (event: React.MouseEvent) => {
        event?.preventDefault();
        if ((props.record as Asset)?.initialDate) {
            setShowModalAsset(true);
        } else if ((props.record as FinancialRecord)?.value || (props.record as FinancialRecord)?.value === 0) {
            setShowModalFinancialRecord(true);
        }

    }

    const deleteRecord = (event: React.MouseEvent) => {
        event.preventDefault();
        const service: any = getService();
        service.deleteById(props.record.id)
            .then((response) => {
                toast.pushSuccess("Registro removido com sucesso", 5000)
                props.callback();
            })
            .catch(error => {
                toast?.pushError("Erro ao excluir registro. " + error, 7000, "truncate-2-lines");
            }).finally(() => { })
    }

    const getService = () => {
        return (props.record as Asset).initialDate ? assetService :
            (props.record as FinancialRecordRecurrence).recurrencePeriod ? financialRecordRecurrenceService : financialRecordService;
    }

    return (
        <>
            <a
                className="px-3 py-1 cursor-pointer text-blueGray-500"
                ref={btnDropdownRef}
                onClick={(e) => {
                    e.preventDefault();
                    dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                }}
            >
                <i className="fas fa-ellipsis-v"></i>
            </a>

            {showModalAsset ? (
                <ModalRedemptionDate setShowModalState={setShowModalAsset} record={props.record as Asset} onSave={handleSaveAsset}></ModalRedemptionDate>
            ) : null}

            {showModalFinancialRecord ? (
                <ModalEditValue setShowModalState={setShowModalFinancialRecord} record={props.record as FinancialRecord} onSave={handleSaveFinancialRecord}></ModalEditValue>
            ) : null}

            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? "block " : "hidden ") +
                    "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-[10rem]"
                }
            >
                {!props.onlyDelete &&
                    <a
                        className={
                            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-gray-100 cursor-pointer"
                        }
                        onClick={(e) => { closeDropdownPopover(); editRecord(e) }}
                    >
                        <i className="mr-2 fas fa-edit"></i> Editar
                    </a>
                }
                <a
                    className={
                        "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-gray-100 cursor-pointer"
                    }
                    onClick={(e) => { closeDropdownPopover(); deleteRecord(e) }}
                >
                    <i className="mr-2.5 fas fa-trash"></i> Remover
                </a>
            </div>
        </>
    );
};

export default TableDropdown;
