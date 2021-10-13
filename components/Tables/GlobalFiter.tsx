import { useState } from "react";
import { useAsyncDebounce } from "react-table";

const TWO_HUNDRED_MS = 200;

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const [showInput, setShowInput] = useState<boolean>(false)
    const [value, setValue] = useState(globalFilter);
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, TWO_HUNDRED_MS);

    const toggleShowInput = () => {
        const newValue = !showInput
        setShowInput(newValue)
        setTimeout(() => {
            if(newValue) document.getElementById("input-filter").focus()
        }, 300);
    }

    return (
        <div>
            <i className={`${showInput ? "right-3 text-blueGray-300 mt-[0.6rem]" : "right-0 mt-[0.5rem]" } absolute  cursor-pointer fa fa-search`}
                onClick={toggleShowInput}></i>
            <input id="input-filter"
                className={`${!showInput && "hidden"} w-[7rem] sm:w-44 rounded-2xl px-2 py-2 text-sm transition-all duration-150 ease-linear bg-white border-0 shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                type="text"
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${window.innerWidth > 600 ? "Digite um filtro" : ""}`}
            />
        </div>
    )
}

export default GlobalFilter