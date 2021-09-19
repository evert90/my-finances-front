import { FinancialRecord } from "../../classes/financial-record";
import { FinancialRecordType } from "../../classes/FinancialRecordType";
import TableDropdown from "../Dropdowns/TableDropdown";

type FinancialRecordTableProps = {
    records: Array<FinancialRecord>,
    color: any
}

export const FinancialRecordTable: React.FC<FinancialRecordTableProps> = (props) => {
  const dateOptions: Intl.DateTimeFormatOptions = { timeZone: 'UTC', month: 'numeric', day: 'numeric', year: 'numeric' };
  const currencyOptions = Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" });

  return (
      <>
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
            (props.color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
          }
        >
          <div className="px-4 py-3 mb-0 border-0 rounded-t">
            <div className="flex flex-wrap items-center">
              <div className="relative flex-1 flex-grow w-full max-w-full px-1">
                <h3
                  className={
                    "text-xl font-bold " +
                    (props.color === "light" ? "text-blueGray-700" : "text-white")
                  }
                >
                  Lançamentos
                </h3>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <table className="items-center table w-full bg-transparent border-collapse stripped">
              <thead>
                <tr>
                <th
                    className={
                      "column-fit px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (props.color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                    }
                  >
                    Tipo
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (props.color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                    }
                  >
                    Nome
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (props.color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                    }
                  >
                    Data
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (props.color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                    }
                  >
                    Valor
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (props.color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                    }
                  >
                    Tags
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (props.color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                    }
                  ></th>
                </tr>
              </thead>
              <tbody>
              {props.records.map(record =>
                <tr key={record.id} v-for="row in rows" className="odd:bg-blueGray-50 even:bg-white hover:bg-blueGray-100">
                  <td className="flex items-center justify-center p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                  {FinancialRecordType[record.type] == FinancialRecordType.INCOME ?
                    <div className="w-3.5 h-3.5 bg-green-700 rounded-full cursor-pointer" title="Receitas"></div> :
                    <div className="w-3.5 h-3.5 bg-red-600 rounded-full cursor-pointer" title="Despesas"></div>
                  }
                  </td>
                  <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">{record.name}</td>
                  <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">{record.date.toLocaleDateString('pt-BR', dateOptions)}</td>
                  <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">{currencyOptions.format(record.value)}</td>
                  <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                  {record.tags.map(tag =>
                    <span key={tag.id} className="text-xs px-2 py-0.5 rounded ml-1 font-bold bg-green-500 text-white">
                      {tag.name}
                    </span>
                  )}
                  </td>
                  <td className="p-4 px-6 text-sm text-right align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                    <TableDropdown />
                  </td>
                </tr>
              )}

              </tbody>
            </table>
          </div>
        </div>
      </>
    );
}