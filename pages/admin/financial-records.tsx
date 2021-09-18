import React from "react";

// components

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../classes/layout-component";
import { CardTable } from "../../components/Cards/CardTable";
import { FinancialRecordForm } from "../../components/FinancialRecord/FinancialRecordForm";
import { FinancialRecordTable } from "../../components/FinancialRecord/FinancialRecordTable";

const FinancialRecordsLayout: LayoutComponent = () => {
    return (
        <>
          <div className="relative pt-12 pb-9 md:pt-32">
            <div className="flex flex-wrap">
              <div className="w-full px-4">
                <FinancialRecordForm/>
              </div>
              <div className="w-full px-4">
                <FinancialRecordTable data={[]} color="light" />
              </div>
            </div>
          </div>
        </>
      );
}

FinancialRecordsLayout.layout = Admin;

export default FinancialRecordsLayout;