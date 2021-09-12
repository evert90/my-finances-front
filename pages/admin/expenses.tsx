import React from "react";

// components

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../classes/layout-component";
import { CardSettings } from "../../components/Cards/CardSettings";
import { CardProfile } from "../../components/Cards/CardProfile";

const ExpensesLayout: LayoutComponent = () => {
    return (
        <>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-8/12 px-4">
              <CardSettings />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <CardProfile />
            </div>
          </div>
        </>
      );
}

ExpensesLayout.layout = Admin;

export default ExpensesLayout;