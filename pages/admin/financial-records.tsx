import React, { useEffect, useState } from "react";

// components

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../classes/LayoutComponent";
import { FinancialRecordTable } from "../../components/FinancialRecord/FinancialRecordTable";
import { FinancialRecordForm } from "../../components/FinancialRecord/FinancialRecordForm";
import { financialRecordService } from "../../services/financial-record.service";
import { FinancialRecord } from "../../classes/FinancialRecord";
import { useToast } from "../../components/Toast/ToastProvider";
import moment from "moment";

const FinancialRecordsLayout: LayoutComponent = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<Array<FinancialRecord>>([]);

  const toast = useToast();

  useEffect(() => {
    setIsLoading(true)

    financialRecordService.getAll()
      .then((records: Array<FinancialRecord>) => {
        setRecords(records.map(record => {record.date = moment(record.date, 'YYYY-MM-DD'); return record}))
      })
      .catch(error => {
        toast?.pushError("Erro ao consultar receitas/despesas. " + error, 999999999, "truncate-2-lines");
      }).finally(() => setIsLoading(false))

  }, [])

    return (
        <>
          <div className="relative pt-12 pb-9 md:pt-32">
            <div className="flex flex-wrap">
              <div className="w-full px-4">
                <FinancialRecordForm records={records}/>
              </div>
              <div className="w-full px-4">
                <FinancialRecordTable records={records} recordsState={setRecords} color="light"/>
              </div>
            </div>
          </div>
        </>
      );
}

FinancialRecordsLayout.layout = Admin;

export default FinancialRecordsLayout;