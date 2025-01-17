import React from "react";

// components

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../class/LayoutComponent";
import { FinancialRecordRecurrenceTable } from "../../components/FinancialRecordRecurrence/FinancialRecordRecurrenceTable";

const RecurrencesLayout: LayoutComponent = () => {

    return (
        <>
            <div className="relative pt-12 pb-9 md:pt-32">
                <div className="flex flex-wrap">
                    <div className="w-full px-4">
                        <FinancialRecordRecurrenceTable color="light" />
                    </div>
                </div>
            </div>
        </>
    );
}

RecurrencesLayout.layout = Admin;

export default RecurrencesLayout;