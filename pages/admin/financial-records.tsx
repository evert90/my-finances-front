import React from "react";

// components

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../class/LayoutComponent";
import { FinancialRecordTable } from "../../components/FinancialRecord/FinancialRecordTable";
import { FinancialRecordForm } from "../../components/FinancialRecord/FinancialRecordForm";

const FinancialRecordsLayout: LayoutComponent = () => {

    return (
        <>
            <div className="relative pt-12 pb-9 md:pt-32">
                <div className="flex flex-wrap">
                    <div className="w-full px-4">
                        <FinancialRecordForm />
                    </div>
                    <div className="w-full px-4">
                        <FinancialRecordTable color="light" />
                    </div>
                </div>
            </div>
        </>
    );
}

FinancialRecordsLayout.layout = Admin;

export default FinancialRecordsLayout;