import React from "react";

// components

import Sidebar from "../components/Sidebar/Sidebar";
import { FooterAdmin } from "../components/Footers/FooterAdmin";
import { AdminNavbar } from "../components/Navbars/AdminNavbar";

export const Admin = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className="relative bg-blueGray-100">
        <AdminNavbar />
        <div className="w-full px-4 mx-auto -mt-6 sm:mt-[-2.35rem] md:px-10">
          {children}
          {/* <FooterAdmin/> */}
        </div>
      </div>
    </>
  );
}
