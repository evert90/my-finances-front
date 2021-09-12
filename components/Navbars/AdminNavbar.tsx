import React, { RefObject } from "react";
import UserDropdown from "../Dropdowns/UserDropdown";
import Link from "next/link";
import { useRouter } from "next/router";
import { createPopper } from "@popperjs/core";

export const AdminNavbar = () => {
  const router = useRouter();

  const [dashboardPopoverShow, setDahsboardPopoverShow] = React.useState(false);
  const [incomesPopoverShow, setIncomesPopoverShow] = React.useState(false);
  const [expensesPopoverShow, setExpensesPopoverShow] = React.useState(false);
  const [assetsPopoverShow, setAssetsPopoverShow] = React.useState(false);
  const [debtsPopoverShow, setDebtsPopoverShow] = React.useState(false);
  const [productsPopoverShow, setProductsPopoverShow] = React.useState(false);

  const dashboardRef: RefObject<HTMLInputElement> = React.createRef();
  const dashboardPopoverRef: RefObject<HTMLInputElement> = React.createRef();
  const incomesRef: RefObject<HTMLInputElement> = React.createRef();
  const incomesPopoverRef: RefObject<HTMLInputElement> = React.createRef();
  const expensesRef: RefObject<HTMLInputElement> = React.createRef();
  const expensesPopoverRef: RefObject<HTMLInputElement> = React.createRef();
  const assetsRef: RefObject<HTMLInputElement> = React.createRef();
  const assetsPopoverRef: RefObject<HTMLInputElement> = React.createRef();
  const debtsRef: RefObject<HTMLInputElement> = React.createRef();
  const debtsPopoverRef: RefObject<HTMLInputElement> = React.createRef();
  const productsRef: RefObject<HTMLInputElement> = React.createRef();
  const productsPopoverRef: RefObject<HTMLInputElement> = React.createRef();

  const openTooltip = (iconRef: RefObject<HTMLInputElement>, popoverRef: RefObject<HTMLInputElement>, setPopover: any) => {
    createPopper(iconRef.current, popoverRef.current, {
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
    setPopover(true);
  };
  const closeTooltip = (setPopover: any) => {
    setPopover(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="hidden md:flex top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-2 navbar-expand-lg bg-white shadow-md background-navbar">
        <div className="w-full px-4 mx-auto flex flex-wrap items-center justify-between">
          {/* Brand
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a>
            */}
          <Link href="/admin/dashboard">
            <a
              href="#pablo"
              className={
                "text-md py-3 font-bold block " +
                (router.pathname.indexOf("/admin/dashboard") !== -1
                  ? "text-lightBlue-600 hover:text-lightBlue-700 opacity-75"
                  : "text-blueGray-300 hover:text-blueGray-600")
              }
            >
              <i
                className={"fas fa-tachometer-alt mr-6 text-xl-edit"}
                onMouseEnter={() => openTooltip(dashboardRef, dashboardPopoverRef, setDahsboardPopoverShow)}
                onMouseLeave={() => closeTooltip(setDahsboardPopoverShow)}
                ref={dashboardRef}
              ></i>
            </a>
          </Link>

          <Link href="/admin/incomes">
            <a
              href="#pablo"
              className={
                "text-md py-3 font-bold block " +
                (router.pathname.indexOf("/admin/incomes") !== -1
                  ? "text-lightBlue-600 hover:text-lightBlue-700 opacity-75"
                  : "text-blueGray-300 hover:text-blueGray-600")
              }
            >
              <i
                className={"fas fa-money-bill-alt mr-6 text-xl-edit"}
                onMouseEnter={() => openTooltip(incomesRef, incomesPopoverRef, setIncomesPopoverShow)}
                onMouseLeave={() => closeTooltip(setIncomesPopoverShow)}
                ref={incomesRef}
              ></i>
            </a>
          </Link>

          <Link href="/admin/expenses">
            <a
              href="#pablo"
              className={
                "text-md py-3 font-bold block " +
                (router.pathname.indexOf("/admin/expenses") !== -1
                  ? "text-lightBlue-600 hover:text-lightBlue-700 opacity-75"
                  : "text-blueGray-300 hover:text-blueGray-600")
              }
            >
              <i
                className={"fas fa-credit-card mr-6 text-xl-edit"}
                onMouseEnter={() => openTooltip(expensesRef, expensesPopoverRef, setExpensesPopoverShow)}
                onMouseLeave={() => closeTooltip(setExpensesPopoverShow)}
                ref={expensesRef}
              ></i>
            </a>
          </Link>

          <Link href="/admin/assets">
            <a
              href="#pablo"
              className={
                "text-md py-3 font-bold block " +
                (router.pathname.indexOf("/admin/assets") !== -1
                  ? "text-lightBlue-600 hover:text-lightBlue-700 opacity-75"
                  : "text-blueGray-300 hover:text-blueGray-600")
              }
            >
              <i
                className={"fas fa-building mr-6 text-xl-edit"}
                onMouseEnter={() => openTooltip(assetsRef, assetsPopoverRef, setAssetsPopoverShow)}
                onMouseLeave={() => closeTooltip(setAssetsPopoverShow)}
                ref={assetsRef}
              ></i>
            </a>
          </Link>

          <Link href="/admin/debts">
            <a
              href="#pablo"
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
              href="#pablo"
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

          {/* Tooltips */}
          <div className={(dashboardPopoverShow ? "" : "hidden ") + "tooltip"} ref={dashboardPopoverRef}>
            <div className="arrow" data-popper-arrow></div>
            <div>
              <div>
                Dashboard
              </div>
            </div>
          </div>
          <div className={(incomesPopoverShow ? "" : "hidden ") + "tooltip"} ref={incomesPopoverRef}>
            <div className="arrow" data-popper-arrow></div>
            <div>
              <div>
                Receitas
              </div>
            </div>
          </div>
          <div className={(expensesPopoverShow ? "" : "hidden ") + "tooltip"} ref={expensesPopoverRef}>
            <div className="arrow" data-popper-arrow></div>
            <div>
              <div>
                Despesas
              </div>
            </div>
          </div>
          <div className={(assetsPopoverShow ? "" : "hidden ") + "tooltip"} ref={assetsPopoverRef}>
            <div className="arrow" data-popper-arrow></div>
            <div>
              <div>
                Bens
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
          <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">
              <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search here..."
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
              />
            </div>
          </form>
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <UserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}

    </>
  );
}