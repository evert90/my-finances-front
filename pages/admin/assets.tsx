import React from "react";

// components

import { Admin } from "../../layouts/Admin";
import { LayoutComponent } from "../../class/LayoutComponent";
import { AssetForm } from "../../components/Assets/AssetForm";
import { AssetTable } from "../../components/Assets/AssetTable";

const AssetsLayout: LayoutComponent = () => {
    return (
        <>
            <div className="relative pt-12 pb-9 md:pt-32">
                <div className="flex flex-wrap">
                    <div className="w-full px-4">
                        <AssetForm />
                    </div>
                    <div className="w-full px-4">
                        <AssetTable color="light" />
                    </div>
                </div>
            </div>
        </>
    );
}

AssetsLayout.layout = Admin;

export default AssetsLayout;