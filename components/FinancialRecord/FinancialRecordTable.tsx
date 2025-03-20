import Moment from "react-moment";
import { FinancialRecord } from "../../class/FinancialRecord";
import { FinancialRecordType } from "../../class/FinancialRecordType";
import { currencyService } from "../../services/currency.service";
import TableDropdown from "../Dropdowns/TableDropdown";
import { useTable, usePagination, useGlobalFilter, useFilters, Row, useSortBy } from 'react-table';
import { useCallback, useMemo, useState } from "react";
import { scrollService } from "../../services/scroll.service";
import GlobalFilter from "../Tables/GlobalFiter";
import { financialRecordService } from "../../services/financial-record.service";
import { useToast } from "../Toast/ToastProvider";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import moment from "moment";

type FinancialRecordTableProps = {
    color: any
}

export const FinancialRecordTable: React.FC<FinancialRecordTableProps> = (props) => {

    const { data: dataQuery, isLoading, isFetching } = useQuery<Array<FinancialRecord>>(
        ["financialRecords"],
        financialRecordService.getAll,
        {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            keepPreviousData: true,
            retry: false,
            onSuccess: (data) => setData(data),
            onError: (err) => toast?.pushError("Erro ao consultar receitas/despesas. " + err, 7000, "truncate-2-lines")
        }
    );

    const queryClient = useQueryClient();

    const toast = useToast();

    const [data, setData] = useState(dataQuery || []);

    const removeFromTable = () => {
        queryClient.refetchQueries(["financialRecords"]);
    }

    const columns = useMemo(
        () => [
            {
              Header: 'Tipo',
              accessor: 'type',
            },
            {
              Header: 'Nome',
              accessor: 'name',
            },
            {
              Header: 'Data',
              accessor: (row: FinancialRecord) => (row.date.toLocaleString()),
            },
            {
              Header: 'Valor',
              accessor: 'value',
            },
            {
              Header: 'Tags',
              accessor: (row: FinancialRecord) => (row.tags.join(",")),
              disableSortBy: true
            },
            {
                Header: '',
                id: 'actions',
                accessor: (row: FinancialRecord) => (""),
                disableSortBy: true
            },
          ],
          []
    )

    const customGlobalFilterFunction = useCallback(
        (rows: Row[], ids: any, query: string) => {
            return rows.filter((row) => {
                const record: FinancialRecord = row.original as FinancialRecord
                const queryLower = query.toLowerCase()
                const type = FinancialRecordType[record.type] as string
                const date = record.date = moment(record.date, 'YYYY-MM-DD')

                return type?.toLowerCase() == queryLower ||
                    record.name.toLowerCase().includes(queryLower) ||
                    date.format("DD/MM/YYYY").includes(queryLower) ||
                    currencyService.format(record.value).includes(queryLower) ||
                    record.tags?.filter(tag => tag.name?.toLowerCase().includes(queryLower))?.length
            });
        },
        [],
    );

    const {
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
        headerGroups
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 50 },
            autoResetPage: false,
            globalFilter: customGlobalFilterFunction
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    )

    return (
        <>
            <div className={`${(isLoading || isFetching) && "opacity-50"} relative flex flex-col min-w-0 break-words w-full shadow-lg rounded ` +
                    (props.color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
               }
            >
                <div className="px-4 py-3 mb-0 border-0 rounded-t">
                    <div className="relative flex justify-between w-full max-w-full px-1 text-center" id="lancamentos">
                        <h3
                        className={
                            "text-xl font-bold " +
                            (props.color === "light" ? "text-blueGray-700" : "text-white")
                        }
                        >
                        Lançamentos
                        </h3>
                        {!isLoading && !isFetching &&
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                        }
                    </div>
                </div>
                <div className={`block w-full overflow-x-auto`}>
                    {(isLoading || isFetching) &&
                    <div className="center-card">
                        <i className="mx-auto mb-2 mr-1 text-2xl text-blueGray-700 fas fa-circle-notch animate-spin"></i>
                    </div>
                    }
                    <table className="items-center table w-full bg-transparent border-collapse stripped">
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th key={column.id}
                                className={`table-thead text-sm ${column.id === 'type' ? 'column-fit' : ''}`}
                                {...column.getHeaderProps(column.getSortByToggleProps({title: "Ordenar"}))}
                                onClick={() => column.toggleSortBy(!column.isSortedDesc)}
                                >
                                {column.render("Header")}
                                <span style={{marginLeft: "4px"}}>
                                    {column.isSorted
                                    ? column.isSortedDesc
                                        ? <i className="fas fa-chevron-down"></i>
                                        : <i className="fas fa-chevron-up"></i>
                                    : ""}
                                </span>
                                </th>
                            ))}
                            </tr>
                        ))}
                        </thead>
                    <tbody>
                    {page.map((row: any, i) => {
                        const record: FinancialRecord = row.original as FinancialRecord

                        return <tr key={i} v-for="row in rows" className="odd:bg-blueGray-50 even:bg-white hover:bg-blueGray-100">
                            <td className="flex items-center justify-center p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                            {FinancialRecordType[record.type] == FinancialRecordType.INCOME ?
                                <div className="w-2.5 h-2.5 mt-2 bg-green-700 rounded-full cursor-pointer" title="Receitas"></div> :
                                <div className="w-2.5 h-2.5 mt-2 bg-red-600 rounded-full cursor-pointer" title="Despesas"></div>
                            }
                            </td>
                            <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                                <div className="flex flex-row">
                                    {record.name}
                                    {FinancialRecordType[record.type] == FinancialRecordType.EXPENSE && !record.paid &&
                                        <div>
                                            <i className="mt-[3.5px] ml-2 text-sm cursor-pointer far fa-clock"
                                                title="Pagamento pendente"
                                                onClick={() => financialRecordService.pay(record, toast)}
                                            ></i>
                                        </div>
                                    }
                                </div>
                            </td>
                            <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap"><Moment date={record.date} format="DD/MM/YYYY" /></td>
                            <td className="p-4 px-6 text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">{currencyService.format(record.value)}</td>
                            <td className="p-4 px-6 pl-[1.36rem] text-base align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                            {record.tags?.map(tag =>
                                <span key={tag.id} className="text-xs px-2 py-0.5 rounded ml-1 font-bold bg-green-500 text-white">
                                {tag.name}
                                </span>
                            )}
                            </td>
                            <td className="p-4 px-6 text-sm text-right align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                                <TableDropdown record={record} callback={removeFromTable} />
                            </td>
                        </tr>
                    })}
                    </tbody>
                    </table>
                </div>
                <div className={`${data?.length == 0 && "hidden"} flex flex-row justify-center py-2 my-2 border-t-[1px]`}>
                    <nav className="block mt-2">
                        <ul className="flex flex-wrap pl-0 list-none rounded">
                            <li>
                                <button onClick={() => {gotoPage(0); scrollService.toElement("lancamentos", -100)}}
                                    disabled={!canPreviousPage}
                                    className="relative flex items-center justify-center w-8 h-8 p-0 mx-1 text-xs font-semibold leading-tight bg-white border border-solid rounded-full first:ml-0 border-blueGray-500 text-blueGray-500 hover:bg-blueGray-500 hover:text-white">
                                    <i className="-ml-px fas fa-chevron-left"></i>
                                    <i className="-ml-px fas fa-chevron-left"></i>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => {previousPage(); scrollService.toElement("lancamentos", -100)}}
                                    disabled={!canPreviousPage}
                                    className="relative flex items-center justify-center w-8 h-8 p-0 mx-1 text-xs font-semibold leading-tight bg-white border border-solid rounded-full first:ml-0 border-blueGray-500 text-blueGray-500 hover:bg-blueGray-500 hover:text-white">
                                    <i className="-ml-px fas fa-chevron-left"></i>
                                </button>
                            </li>
                            <li>
                               <select className="relative flex items-center justify-center w-[4.6rem] h-8 p-0 pl-2 mx-1 text-xs font-semibold leading-tight bg-white border border-solid rounded-full first:ml-0 border-blueGray-500 text-blueGray-500 hover:bg-blueGray-500 hover:text-white focus:ring-blueGray-500 focus:outline-none"
                                    value={pageIndex}
                                    onChange={e => {gotoPage(Number(e.target.value)); scrollService.toElement("lancamentos", -100)}}
                                    >
                                    {Array.from(Array(pageOptions.length).keys()).map(page => (
                                        <option key={page} value={page}>
                                            {page + 1} de {pageOptions.length}
                                        </option>
                                    ))}
                                </select>
                            </li>
                            <li>
                                <button onClick={() => {nextPage(); scrollService.toElement("lancamentos", -100)}}
                                    disabled={!canNextPage}
                                    className="relative flex items-center justify-center w-8 h-8 p-0 mx-1 text-xs font-semibold leading-tight bg-white border border-solid rounded-full first:ml-0 border-blueGray-500 text-blueGray-500 hover:bg-blueGray-500 hover:text-white">
                                    <i className="-mr-px fas fa-chevron-right"></i>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => {gotoPage(pageCount - 1); scrollService.toElement("lancamentos", -100)}}
                                    disabled={!canNextPage}
                                    className="relative flex items-center justify-center w-8 h-8 p-0 mx-1 text-xs font-semibold leading-tight bg-white border border-solid rounded-full first:ml-0 border-blueGray-500 text-blueGray-500 hover:bg-blueGray-500 hover:text-white">
                                    <i className="-mr-px fas fa-chevron-right"></i>
                                    <i className="-mr-px fas fa-chevron-right"></i>
                                </button>
                            </li>
                            <li>
                                <select className="relative flex items-center justify-center h-8 p-0 pl-2 mx-1 text-xs font-semibold leading-tight bg-white border border-solid rounded-full w-14 first:ml-0 border-blueGray-500 text-blueGray-500 hover:bg-blueGray-500 hover:text-white focus:ring-blueGray-500 focus:outline-none"
                                    value={pageSize}
                                    onChange={e => {
                                        setPageSize(Number(e.target.value))
                                    }}
                                    >
                                    {[10, 15, 20, 30, 40, 50, 75, 100, 1000].map(pageSize => (
                                        <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

        </>
        );
}