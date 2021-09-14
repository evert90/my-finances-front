import React from "react";

// components

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../classes/layout-component";
import { CardTable } from "../../components/Cards/CardTable";
import { FinancialRecordForm } from "../../components/FinancialRecord/FinancialRecordForm";
import { FinancialRecordType } from "../../classes/FinancialRecordType";
import { FinancialRecordTable } from "../../components/FinancialRecord/FinancialRecordTable";

const IncomesLayout: LayoutComponent = () => {
    return (
        <>
          <div className="relative pt-12 pb-9 md:pt-32">
            <div className="flex flex-wrap">
              <div className="w-full px-4">
                <FinancialRecordForm type={FinancialRecordType.INCOME}/>
              </div>
              <div className="w-full px-4">
                <FinancialRecordTable data={[]} color="light" />
              </div>
            </div>
          </div>
        </>
      );
}

IncomesLayout.layout = Admin;

export default IncomesLayout;