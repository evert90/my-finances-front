import React from "react";

// components

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../classes/layout-component";
import { CardTable } from "../../components/Cards/CardTable";

// layout for page


const Tables: LayoutComponent = () => {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable />
        </div>
        <div className="w-full mb-12 px-4">
          <CardTable color="dark" />
        </div>
      </div>
    </>
  );
}

Tables.layout = Admin;

export default Tables;
