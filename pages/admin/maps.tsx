import React from "react";

// components

import MapExample from "../../components/Maps/MapExample";

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../class/LayoutComponent";

const Maps: LayoutComponent = () => {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="relative flex flex-col w-full min-w-0 mb-6 break-words bg-white rounded shadow-lg">
            <MapExample />
          </div>
        </div>
      </div>
    </>
  );
}

Maps.layout = Admin;

export default Maps;


