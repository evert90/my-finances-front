import { useCallback, useEffect, useMemo, useState } from "react";
import Moment from "react-moment";
import { Row, useFilters, useGlobalFilter, usePagination, useTable } from "react-table";
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
    records: Array<Asset>,
    recordsState: React.Dispatch<React.SetStateAction<Array<Asset>>>,
    color: any
}

export const AssetTable: React.FC<AssetTableProps> = (props) => {
    const [data, setData] = useState<Array<Asset>>(props.records)

    const toast = useToast()

    useEffect(() => {
      setData([...props.records])
    }, [props])

    const removeFromTable = (record: Asset) => {
        props.recordsState(props.records.filter(it => it.id != record.id))
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Nome',
                accessor: 'name',
            },
            {
                Header: 'Tipo',
                accessor: 'type',
            },
            {
                Header: 'Data inicial',
                accessor: (row: Asset) => (row.initialDate.toLocaleString()),
            },
            {
                Header: 'Data final',
                accessor: (row: Asset) => (row.endDate.toLocaleString()),
            },
            {
                Header: 'Título',
                accessor: 'rendaFixaType',
            },
            {
                Header: 'Banco',
                accessor: 'bank',
            },
            {
                Header: 'Tipo de taxa',
                accessor: 'rendaFixaRateType',
            },
            {
                Header: 'Taxa',
                accessor: 'rate',
            },
            {
                Header: 'Liquidez',
                accessor: 'liquidez',
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
              Header: 'Tags',
              accessor: (row: Asset) => (row.tags.join(",")),
            },
          ],
          []
    )

    const customGlobalFilterFunction = useCallback(
        (rows: Row[], ids: any, query: string) => {
            return rows.filter((row) => {
                const record: Asset = row.original as Asset
                const queryLower = query.toLowerCase()
                const type = AssetType[record.type] as string
                const rendaFixaType = AssetRendaFixaType[record.rendaFixaType] as string
                const rendaFixaRateType = AssetRendaFixaRateType[record.rendaFixaRateType] as string

                return record.name.toLowerCase().includes(queryLower) ||
                    type?.toLowerCase() == queryLower ||
                    rendaFixaType?.toLowerCase() == queryLower ||
                    rendaFixaRateType?.toLowerCase() == queryLower ||
                    record.bank?.toLowerCase().includes(queryLower) ||
                    record.rate?.toString().includes(queryLower) ||
                    record.initialValue.toString().includes(queryLower) ||
                    record.endValue?.toString().includes(queryLower) ||
                    record.initialDate.format("DD/MM/YYYY").includes(queryLower) ||
                    record.endDate?.format("DD/MM/YYYY").includes(queryLower) ||
                    currencyService.format(record.initialValue).includes(queryLower) ||
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
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 100 },
            globalFilter: customGlobalFilterFunction
        },
        useFilters,
        useGlobalFilter,
        usePagination
    )

    return (
        <>
            <div className={"relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-white"}>
                <div className="px-4 py-3 mb-0 border-0 rounded-t">
                    <div className="relative flex justify-between w-full max-w-full px-1 text-center" id="lancamentos">
                        <h3 className={"text-xl font-bold text-blueGray-700"}>
                            Lançamentos
                        </h3>
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center table w-full bg-transparent border-collapse stripped">
                        <thead>
                            <tr>
                                <th className={"table-thead"}>
                                    Nome
                                </th>
                                <th className={"table-thead"}>
                                    Tipo
                                </th>
                                <th className={"table-thead"}>
                                    Banco
                                </th>
                                <th className={"table-thead"}>
                                    Título
                                </th>
                                <th className={"table-thead"}>
                                    Tipo de taxa
                                </th>
                                <th className={"table-thead"}>
                                    Taxa
                                </th>
                                <th className={"table-thead"}>
                                    Data inicial
                                </th>
                                <th className={"table-thead"}>
                                    Data final
                                </th>
                                <th className={"table-thead"}>
                                    Valor inicial
                                </th>
                                <th className={"table-thead"}>
                                    Valor final
                                </th>
                                <th className={"table-thead"}>
                                    Liquidez
                                </th>

                                <th className={"table-thead"}>
                                    Tags
                                </th>
                                <th className={"table-thead"}>

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {page.map((row: any, i) => {
                            const record: Asset = row.original as Asset

                            return <tr key={i} className={`${record.endValue ? "bg-orange-200" : "bg-white"} hover:bg-blueGray-100`}>
                                <td className="table-tbody-sm">
                                    {record.name}
                                </td>
                                <td className="table-tbody-sm">
                                    {AssetType[record.type]}
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
                                    {record.rate?.toFixed(2)}%
                                </td>
                                <td className="table-tbody-sm">
                                    <Moment date={record.initialDate} format="DD/MM/YYYY" />
                                </td>
                                <td className="table-tbody-sm">
                                    <Moment date={record.endDate} format="DD/MM/YYYY" />
                                </td>
                                <td className="table-tbody-sm">
                                    {currencyService.format(record.initialValue)}
                                </td>
                                <td className="table-tbody-sm">
                                    {record.endValue && currencyService.format(record.endValue)}
                                </td>
                                <td className="table-tbody-sm">
                                    {record.liquidez ? "Sim" : "Não"}
                                </td>
                                <td className="p-4 px-6 pl-[1.36rem] text-sm align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                                {record.tags?.map(tag =>
                                    <span key={tag.id} className="text-xs px-[0.35rem] py-[0.13rem] rounded ml-1 font-bold bg-green-500 text-white">
                                    {tag.name}
                                    </span>
                                )}
                                </td>
                                <td className="p-4 px-6 text-sm text-right align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
                                    <TableDropdown record={record} stateChanger={removeFromTable} />
                                </td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                    <table className="items-center table w-full bg-transparent border-collapse stripped">
                        <tbody>
                           <tr>
                                <td className={"table-thead"}></td>
                                <td className={"table-thead"}>Sem liquidez: {currencyService.format(assetService.getTotalSemLiquidez(props.records))}</td>
                                <td className={"table-thead"}>Com liquidez: {currencyService.format(assetService.getTotalComLiquidez(props.records))}</td>
                                <td className={"table-thead"}>Total: {currencyService.format(assetService.getTotal(props.records))}</td>
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