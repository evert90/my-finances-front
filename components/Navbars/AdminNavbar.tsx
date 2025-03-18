import React, { RefObject } from "react";
import UserDropdown from "../Dropdowns/UserDropdown";
import Link from "next/link";
import { useRouter } from "next/router";
import { createPopper } from "@popperjs/core";

export const AdminNavbar = () => {
  const router = useRouter();

  const [dashboardPopoverShow, setDahsboardPopoverShow] = React.useState(false);
  const [financialRecordsPopoverShow, setFinancialRecordsPopoverShow] = React.useState(false);
  const [financialRecordRecurrencesPopoverShow, setFinancialRecordRecurrencesPopoverShow] = React.useState(false);
  const [assetsPopoverShow, setAssetsPopoverShow] = React.useState(false);
  const [debtsPopoverShow, setDebtsPopoverShow] = React.useState(false);
  const [productsPopoverShow, setProductsPopoverShow] = React.useState(false);

  const dashboardRef: RefObject<HTMLInputElement> = React.createRef();
  const dashboardPopoverRef: RefObject<HTMLInputElement> = React.createRef();
  const financialRecordsRef: RefObject<HTMLInputElement> = React.createRef();
  const financialRecordsPopoverRef: RefObject<HTMLInputElement> = React.createRef();
  const assetsRef: RefObject<HTMLInputElement> = React.createRef();
  const assetsPopoverRef: RefObject<HTMLInputElement> = React.createRef();
  const debtsRef: RefObject<HTMLInputElement> = React.createRef();
  const debtsPopoverRef: RefObject<HTMLInputElement> = React.createRef();
  const productsRef: RefObject<HTMLInputElement> = React.createRef();
  const productsPopoverRef: RefObject<HTMLInputElement> = React.createRef();
  const financialRecordRecurrencesRef: RefObject<HTMLInputElement> = React.createRef();
  const financialRecordRecurrencesPopoverRef: RefObject<HTMLInputElement> = React.createRef();

  const openTooltip = (iconRef: RefObject<HTMLInputElement>, popoverRef: RefObject<HTMLInputElement>, setPopover: any) => {
    const instance = createPopper(iconRef.current, popoverRef.current, {
      placement: "bottom",
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 15],
          },
        },
      ],
    });
    setTimeout(() => {
      instance.update();
    }, 50)
    setPopover(true);
  };
  const closeTooltip = (setPopover: any) => {
    setPopover(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 flex flex-wrap items-center justify-between hidden w-full px-2 py-1 bg-white shadow-md md:flex navbar-expand-lg background-navbar">
        <div className="flex flex-wrap items-center justify-between w-full px-4 mx-auto">
          {/* Brand
          <a
            className="hidden text-sm font-semibold text-white uppercase lg:inline-block"

            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a>
            */}
          <Link
            href="/admin/dashboard"
            as="/admin/dashboard"
            className={
              "text-md py-3 font-bold block " +
              (router.pathname.indexOf("/admin/dashboard") !== -1
                ? "text-lightBlue-600 hover:text-lightBlue-700 opacity-75"
                : "text-blueGray-300 hover:text-blueGray-600")
            }>

            <i
              className={"fas fa-tachometer-alt mr-6 text-xl-edit"}
              onMouseEnter={() => openTooltip(dashboardRef, dashboardPopoverRef, setDahsboardPopoverShow)}
              onMouseLeave={() => closeTooltip(setDahsboardPopoverShow)}
              ref={dashboardRef}
            ></i>

          </Link>

          <Link
            href="/admin/financial-records"
            as="/admin/financial-records"
            className={
              "text-md py-3 font-bold block " +
              (router.pathname.indexOf("/admin/financial-records") !== -1
                ? "text-lightBlue-600 hover:text-lightBlue-700 opacity-75"
                : "text-blueGray-300 hover:text-blueGray-600")
            }>

            <i
              className={"fas fa-money-bill-alt mr-5 text-xl-edit"}
              onMouseEnter={() => openTooltip(financialRecordsRef, financialRecordsPopoverRef, setFinancialRecordsPopoverShow)}
              onMouseLeave={() => closeTooltip(setFinancialRecordsPopoverShow)}
              ref={financialRecordsRef}
            ></i>

          </Link>

          <Link
            href="/admin/recurrences"
            as="/admin/recurrences"
            className={
              "text-md py-3 font-bold block " +
              (router.pathname.indexOf("/admin/recurrences") !== -1
                ? "text-lightBlue-600 hover:text-lightBlue-700 opacity-75"
                : "text-blueGray-300 hover:text-blueGray-600")
            }>

            <i
              className={"fas fa-retweet mr-5 text-xl-edit"}
              onMouseEnter={() => openTooltip(financialRecordRecurrencesRef, financialRecordRecurrencesPopoverRef, setFinancialRecordRecurrencesPopoverShow)}
              onMouseLeave={() => closeTooltip(setFinancialRecordRecurrencesPopoverShow)}
              ref={financialRecordRecurrencesRef}
            ></i>

          </Link>

          <Link
            href="/admin/assets"
            className={
              "text-md py-3 font-bold block " +
              (router.pathname.indexOf("/admin/assets") !== -1
                ? "text-lightBlue-600 hover:text-lightBlue-700 opacity-75"
                : "text-blueGray-300 hover:text-blueGray-600")
            }>

            <i
              className={"fas fa-funnel-dollar mr-6 text-xl-edit"}
              onMouseEnter={() => openTooltip(assetsRef, assetsPopoverRef, setAssetsPopoverShow)}
              onMouseLeave={() => closeTooltip(setAssetsPopoverShow)}
              ref={assetsRef}
            ></i>

          </Link>
{/*}
          <Link href="/admin/debts">
            <a

              className={
                "text-md py-3 font-bold block " +
                (router.pathname.indexOf("/admin/debts") !== -1
                  ? "text-lightBlue-600 hover:text-lightBlue-700 opacity-75"
                  : "text-blueGray-300 hover:text-blueGray-600")
              }
            >
              <i
                className={"fas fa-money-check-alt mr-6 text-xl-edit"}
                onMouseEnter={() => openTooltip(debtsRef, debtsPopoverRef, setDebtsPopoverShow)}
                onMouseLeave={() => closeTooltip(setDebtsPopoverShow)}
                ref={debtsRef}
              ></i>
            </a>
          </Link>

          <Link href="/admin/products">
            <a

              className={
                "text-md py-3 font-bold block " +
                (router.pathname.indexOf("/admin/products") !== -1
                  ? "text-lightBlue-600 hover:text-lightBlue-700 opacity-75"
                  : "text-blueGray-300 hover:text-blueGray-600")
              }
            >
              <i className={"fas fa-shopping-cart mr-6 text-xl-edit"}
                onMouseEnter={() => openTooltip(productsRef, productsPopoverRef, setProductsPopoverShow)}
                onMouseLeave={() => closeTooltip(setProductsPopoverShow)}
                ref={productsRef}
              ></i>
            </a>
          </Link>
*/}
          {/* Tooltips */}
          <div className={(dashboardPopoverShow ? "" : "hidden ") + "tooltip"} ref={dashboardPopoverRef}>
            <div className="arrow" data-popper-arrow></div>
            <div>
              <div>
                Dashboard
              </div>
            </div>
          </div>
          <div className={(financialRecordsPopoverShow ? "" : "hidden ") + "tooltip"} ref={financialRecordsPopoverRef}>
            <div className="arrow" data-popper-arrow></div>
            <div>
              <div>
                Receitas/Despesas
              </div>
            </div>
          </div>
          <div className={(financialRecordRecurrencesPopoverShow ? "" : "hidden ") + "tooltip"} ref={financialRecordRecurrencesPopoverRef}>
            <div className="arrow" data-popper-arrow></div>
            <div>
              <div>
                Recorrências
              </div>
            </div>
          </div>
          <div className={(assetsPopoverShow ? "" : "hidden ") + "tooltip"} ref={assetsPopoverRef}>
            <div className="arrow" data-popper-arrow></div>
            <div>
              <div>
                Investimentos
              </div>
            </div>
          </div>
          <div className={(debtsPopoverShow ? "" : "hidden ") + "tooltip"} ref={debtsPopoverRef}>
            <div className="arrow" data-popper-arrow></div>
            <div>
              <div>
                Dívidas
              </div>
            </div>
          </div>
          <div className={(productsPopoverShow ? "" : "hidden ") + "tooltip"} ref={productsPopoverRef}>
            <div className="arrow" data-popper-arrow></div>
            <div>
              <div>
                Produtos
              </div>
            </div>
          </div>
          {/* End Tooltips */}

          {/* Form */}
          <form className="flex-row flex-wrap items-center hidden mr-3 md:flex lg:ml-auto">
{/*             <div className="relative flex flex-wrap items-stretch w-full">
              <span className="absolute z-10 items-center justify-center w-8 h-full py-3 pl-3 text-base font-normal leading-snug text-center bg-transparent rounded text-blueGray-300">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search here..."
                className="relative w-full px-3 py-3 pl-10 text-sm bg-white border-0 rounded shadow outline-none placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring"
              />
            </div> */}
          </form>
          {/* User */}
          <ul className="flex-col items-center hidden list-none md:flex-row md:flex">
            <UserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}