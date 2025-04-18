import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import UserDropdown from "../Dropdowns/UserDropdown";
import NotificationDropdown from "../Dropdowns/NotificationDropdown";

const Sidebar = () => {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const router = useRouter();
  const logoStyle = {
    width: "150px",
  }

  return (
    <>
      <nav className="relative z-10 flex flex-wrap items-center justify-between px-6 py-4 bg-white shadow-xl md:hidden md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden md:w-48 box-shadow-gray">
        <div className="flex flex-wrap items-center justify-between w-full px-0 mx-auto md:flex-col md:items-stretch md:min-h-full md:flex-nowrap">
          {/* Toggler */}
          <button
            className="px-3 py-1 text-xl leading-none text-black bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer md:hidden"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link passHref
            href="/"
            className="inline-block p-4 px-0 mr-0 text-sm font-bold text-left uppercase md:block md:pb-2 text-blueGray-600 whitespace-nowrap">

            <img src="/app/img/logo/horizontal_blue3.png" style={logoStyle} alt="" />

          </Link>
          {/* User */}
          <ul className="flex flex-wrap items-center list-none md:hidden">
{/*             <li className="relative inline-block">
              <NotificationDropdown />
            </li> */}
            <li className="relative inline-block">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="block pb-1 mb-2 border-b border-solid md:min-w-full md:hidden border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link passHref
                    href="/"
                    className="inline-block p-4 px-0 mr-0 text-sm font-bold text-left uppercase md:block md:pb-2 text-blueGray-600 whitespace-nowrap">

                    <img src="/app/img/logo/horizontal_blue3.png" style={logoStyle} alt="" />

                  </Link>
                </div>
                <div className="flex justify-end w-6/12">
                  <button
                    type="button"
                    className="px-2 py-1 mt-[0.6rem] text-xl leading-none text-black bg-transparent border border-transparent border-solid rounded opacity-50 cursor-pointer h-9 md:hidden"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className="hidden mt-6 mb-4 md:hidden">
              <div className="pt-0 mb-3">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-12 px-3 py-2 text-base font-normal leading-snug bg-white border-0 border-solid rounded shadow-none outline-none border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 focus:outline-none"
                />
              </div>
            </form>

            {/* Divider
            <hr className="my-4 md:min-w-full" />
            */}
            {/* Navigation */}
            <ul className="flex flex-col list-none md:flex-col md:min-w-full">
              <li className="items-center">
                <Link passHref
                  href="/admin/dashboard"
                  onClick={() => setCollapseShow("hidden")}
                  className={
                    "text-md py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/dashboard") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }>

                  <i
                    className={
                      "fas fa-tachometer-alt mr-2 text-sm w-4 " +
                      (router.pathname.indexOf("/admin/dashboard") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}Dashboard

                </Link>
              </li>

              <li className="items-center">
                <Link passHref
                  href="/admin/financial-records"
                  onClick={() => setCollapseShow("hidden")}
                  className={
                    "text-md py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/financial-records") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }>

                  <i
                    className={
                      "fas fa-money-bill-alt mr-2 text-sm w-4 " +
                      (router.pathname.indexOf("/admin/financial-records") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}Receitas/Despesas

                </Link>
              </li>

              <li className="items-center">
                <Link passHref
                  href="/admin/recurrences"
                  onClick={() => setCollapseShow("hidden")}
                  className={
                    "text-md py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/recurrences") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }>

                  <i
                    className={
                      "fas fa-retweet mr-2 text-sm w-4 " +
                      (router.pathname.indexOf("/admin/recurrences") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}Recorrências

                </Link>
              </li>

              <li className="items-center">
                <Link passHref
                  href="/admin/assets"
                  onClick={() => setCollapseShow("hidden")}
                  className={
                    "text-md py-3 font-bold block " +
                    (router.pathname.indexOf("/admin/assets") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }>

                  <i
                    className={
                      "fas fa-funnel-dollar mr-2 text-sm w-4 " +
                      (router.pathname.indexOf("/admin/assets") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}Investimentos

                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;