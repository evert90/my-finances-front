import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import Moment from "react-moment";
import { Row, useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { Asset } from "../../class/Asset";
import { AssetRendaFixaRateType } from "../../class/AssetRendaFixaRateType";
import { AssetRendaFixaType } from "../../class/AssetRendaFixaType";
import { AssetType } from "../../class/AssetType";
import { assetService } from "../../services/asset.service";
import { currencyService } from "../../services/currency.service";
import { scrollService } from "../../services/scroll.service";
import TableDropdown from "../Dropdowns/TableDropdown";
import GlobalFilter from "../Tables/GlobalFiter";
import { useToast } from "../Toast/ToastProvider";

type AssetTableProps = {
    color: any
}

export const AssetTable: React.FC<AssetTableProps> = () => {
    const { data: dataQuery, isLoading, isFetching } = useQuery<Array<Asset>>(
        ["assets"],
        assetService.getAll,
        {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            keepPreviousData: true,
            retry: false,
            onSuccess: (data) => setData(data),
            onError: (err) => toast?.pushError("Erro ao consultar investimentos. " + err, 7000, "truncate-2-lines")
        }
    );

    const [data, setData] = useState(dataQuery || []);

    const queryClient = useQueryClient();

    const toast = useToast();

    const removeFromTable = () => {
        queryClient.refetchQueries(["assets"])
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Descrição',
                accessor: 'name',
            },
            {
                Header: 'Banco',
                accessor: 'bank',
            },
            {
                Header: 'Título',
                accessor: 'rendaFixaType',
            },
            {
                Header: 'Tipo',
                accessor: 'rendaFixaRateType',
            },
            {
                Header: 'Taxa',
                accessor: 'rate',
            },
            {
                Header: 'Data inicial',
                accessor: (row: Asset) => (row.initialDate.toLocaleString()),
            },
            {
                Header: 'Data final',
                accessor: (row: Asset) => (row.endDate?.toLocaleString()),
            },
            {
                Header: 'Valor inicial',
                accessor: 'initialValue',
            },
            {
                Header: 'Valor final',
                accessor: 'endValue',
            },
            {
                Header: 'Rendimento',
                accessor: (row: Asset) => (getDifferenceSortable(row.initialValue, row.endValue)),
            },
            {
              Header: 'Tags',
              accessor: (row: Asset) => (row.tags.join(",")),
              disableSortBy: true
            },
            {
                Header: '',
                id: 'actions',
                accessor: (row: Asset) => (""),
                disableSortBy: true
            },
          ],
          []
    )


    const getDifference = (initialValue: number, endValue: number, initialDate: moment.Moment, endDate: moment.Moment) => {
        const difference = endValue && initialValue && currencyService.format(endValue - initialValue);
        let differencePercentage: number = endValue && initialValue && ((endValue - initialValue) / initialValue * 100);
        const differenceByYear = getDifferenceByYear(initialDate, endDate, differencePercentage)
        return !!difference && !!differencePercentage ? `${difference} (${differenceByYear})` : "";
    }

    const getDifferenceTotalPercentage = (initialValue: number, endValue: number) => {
        const difference = endValue && initialValue && currencyService.format(endValue - initialValue);
        let differencePercentage: number = endValue && initialValue && ((endValue - initialValue) / initialValue * 100);
        return !!difference && !!differencePercentage ? `${differencePercentage.toFixed(2)}%` : "";
    }

    const getDifferenceByYear = (initialDate: moment.Moment, endDate: moment.Moment, differencePercentage: number) => {
        const diasNoAno = 365;

        const diferencaEmDias = moment(endDate).diff(moment(initialDate), 'days');

        const tempoAnosDecimais = diferencaEmDias / diasNoAno;

        const taxaAnual = differencePercentage / tempoAnosDecimais;

        return taxaAnual.toFixed(2) + "% a.a";
    }


    const getDifferenceSortable = (initialValue: number, endValue: number) => {
        return endValue && initialValue && endValue - initialValue;
    }

    const customGlobalFilterFunction = useCallback(
        (rows: Row[], ids: any, query: string) => {
            return rows.filter((row) => {
                const record: Asset = row.original as Asset
                const queryLower = query.toLowerCase()
                const type = AssetType[record.type] as string
                const rendaFixaType = AssetRendaFixaType[record.rendaFixaType] as string
                const rendaFixaRateType = AssetRendaFixaRateType[record.rendaFixaRateType] as string
                const initialDate = moment(record.initialDate, 'YYYY-MM-DD')
                const endDate = record.endDate ? moment(record.endDate, 'YYYY-MM-DD') : undefined

                return record.name?.toLowerCase().includes(queryLower) ||
                    type?.toLowerCase() == queryLower ||
                    rendaFixaType?.toLowerCase() == queryLower ||
                    rendaFixaRateType?.toLowerCase() == queryLower ||
                    record.bank?.toLowerCase().includes(queryLower) ||
                    record.rate?.toString().includes(queryLower) ||
                    record.initialValue.toString().includes(queryLower) ||
                    record.endValue?.toString().includes(queryLower) ||
                    initialDate.format("DD/MM/YYYY").includes(queryLower) ||
                    endDate?.format("DD/MM/YYYY").includes(queryLower) ||
                    currencyService.format(record.initialValue).includes(queryLower) ||
                    getDifference(record.initialValue, record.endValue, record.initialDate, record.redemptionDate ?? record.endDate)?.includes(queryLower) ||
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
            initialState: { pageIndex: 0, pageSize: 100 },
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
            <div className={`${(isLoading || isFetching) && "opacity-50"} relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-white`}>
                <div className="px-4 py-3 mb-0 border-0 rounded-t">
                    <div className="relative flex justify-between w-full max-w-full px-1 text-center" id="lancamentos">
                        <h3 className={"text-xl font-bold text-blueGray-700"}>
                            Lançamentos
                        </h3>
                        <div className={`${data?.length == 0 && "hidden"} flex flex-row justify-center mr-[6rem]`}>
                            <nav className="block">
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
                        <div>
                        {!isLoading && !isFetching &&
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                        }
                        </div>
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
                                className={"table-thead"}
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
                            const record: Asset = row.original as Asset

                            return <tr key={i} className={`${record.endValue ? "bg-orange-200" : "bg-white"} hover:bg-blueGray-100`}>
                                <td className="table-tbody-sm">
                                    {record.name}
                                </td>
                                <td className="table-tbody-sm">
                                    {record.bank}
                                </td>
                                <td className="table-tbody-sm">
                                    {AssetRendaFixaType[record.rendaFixaType]}
                                </td>
                                <td className="table-tbody-sm">
                                    {AssetRendaFixaRateType[record.rendaFixaRateType]}
                                </td>
                                <td className="table-tbody-sm">
                                    {record.rate && record.rate.toFixed(2) + "%" }
                                </td>
                                <td className="table-tbody-sm">
                                    <Moment date={record.initialDate} format="DD/MM/YYYY" />
                                </td>
                                <td className="table-tbody-sm" title={record.redemptionDate && record.redemptionDate != record.endDate && (!!record.endDate && "Data do resgate: " + moment(record.redemptionDate).format('DD/MM/YYYY') || "Data do resgate")}>
                                    {record.endDate && <Moment date={record.endDate} format="DD/MM/YYYY" /> || record.redemptionDate && <Moment date={record.redemptionDate} format="DD/MM/YYYY" />}
                                </td>
                                <td className="table-tbody-sm">
                                    {currencyService.format(record.initialValue)}
                                </td>
                                <td className="table-tbody-sm">
                                    {Number.isFinite(record.endValue) && currencyService.format(record.endValue)}
                                </td>
                                <td className="table-tbody-sm" title={`${getDifferenceTotalPercentage(record.initialValue, record.endValue)}`}>
                                    {getDifference(record.initialValue, record.endValue, record.initialDate, record.redemptionDate ?? record.endDate)}
                                </td>
                                <td className="p-4 px-6 pl-[1.36rem] text-sm align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                                {record.tags?.map(tag =>
                                    <span key={tag.id} className="text-xs px-[0.35rem] py-[0.13rem] rounded ml-1 font-bold bg-green-500 text-white">
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
                    <table className="items-center table w-full bg-transparent border-collapse stripped">
                        <tbody>
                           <tr>
                                <td className={"table-thead"}></td>
                                <td className={"table-thead"}>Sem liquidez: {currencyService.format(assetService.getTotalSemLiquidez(data))}</td>
                                <td className={"table-thead"}>Com liquidez: {currencyService.format(assetService.getTotalComLiquidez(data))}</td>
                                <td className={"table-thead"}>Total: {currencyService.format(assetService.getTotal(data))}</td>
                            </tr>
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