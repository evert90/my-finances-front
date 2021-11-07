import React, { useEffect, useState } from "react";

// components

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../class/LayoutComponent";
import { Asset } from "../../class/Asset";
import { useToast } from "../../components/Toast/ToastProvider";
import moment from "moment";
import { assetService } from "../../services/asset.service";
import { AssetForm } from "../../components/Assets/AssetForm";
import { AssetTable } from "../../components/Assets/AssetTable";

const AssetsLayout: LayoutComponent = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [records, setRecords] = useState<Array<Asset>>([])

    const toast = useToast()

    useEffect(() => {
        setIsLoading(true)

        assetService.getAll()
            .then((records: Array<Asset>) => {
                setRecords(records.map(record => {
                    record.initialDate = moment(record.initialDate, 'YYYY-MM-DD')
                    record.endDate = record.endDate ? moment(record.endDate, 'YYYY-MM-DD') : undefined
                    return record
                }))
            })
            .catch(error => {
                toast?.pushError("Erro ao consultar bens. " + error, 7000, "truncate-2-lines");
            }).finally(() => setIsLoading(false))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="relative pt-12 pb-9 md:pt-32">
                <div className="flex flex-wrap">
                    <div className="w-full px-4">
                        <AssetForm records={records} recordsState={setRecords} />
                    </div>
                    <div className="w-full px-4">
                        <AssetTable records={records} recordsState={setRecords} color="light" />
                    </div>
                </div>
            </div>
        </>
    );
}

AssetsLayout.layout = Admin;

export default AssetsLayout;