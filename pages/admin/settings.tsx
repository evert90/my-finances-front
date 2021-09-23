import React from "react";

// components

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../class/LayoutComponent";
import { CardSettings } from "../../components/Cards/CardSettings";
import { CardProfile } from "../../components/Cards/CardProfile";

// layout for page

const Settings: LayoutComponent = () => {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4 lg:w-8/12">
          <CardSettings />
        </div>
        <div className="w-full px-4 lg:w-4/12">
          <CardProfile />
        </div>
      </div>
    </>
  );
}

Settings.layout = Admin;

export default Settings;
