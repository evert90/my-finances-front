import React from "react";

import { CardBarChart } from "../../components/Cards/CardBarChart";
import { CardLineChart } from "../../components/Cards/CardLineChart";
import { CardPageVisits } from "../../components/Cards/CardPageVisits";
import { CardSocialTraffic } from "../../components/Cards/CardSocialTraffic";

import { LayoutComponent } from "../../classes/layout-component";
import { Admin } from "../../layouts/Admin";
import { CardStats } from "../../components/Cards/CardStats";

export const Dashboard: LayoutComponent = () => {
  return (
    <>
        <div className="relative pt-12 pb-9 md:pt-32">
            {/* Card stats */}
            <div className="flex flex-wrap">
                <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
                <CardStats
                    statSubtitle="TRAFFIC"
                    statTitle="350,897"
                    statArrow="up"
                    statPercent="3.48"
                    statPercentColor="text-emerald-500"
                    statDescripiron="Since last month"
                    statIconName="far fa-chart-bar"
                    statIconColor="bg-red-500"
                />
                </div>
                <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
                <CardStats
                    statSubtitle="NEW USERS"
                    statTitle="2,356"
                    statArrow="down"
                    statPercent="3.48"
                    statPercentColor="text-red-500"
                    statDescripiron="Since last week"
                    statIconName="fas fa-chart-pie"
                    statIconColor="bg-orange-500"
                />
                </div>
                <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
                <CardStats
                    statSubtitle="SALES"
                    statTitle="924"
                    statArrow="down"
                    statPercent="1.10"
                    statPercentColor="text-orange-500"
                    statDescripiron="Since yesterday"
                    statIconName="fas fa-users"
                    statIconColor="bg-pink-500"
                />
                </div>
                <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
                <CardStats
                    statSubtitle="PERFORMANCE"
                    statTitle="49,65%"
                    statArrow="up"
                    statPercent="12"
                    statPercentColor="text-emerald-500"
                    statDescripiron="Since last month"
                    statIconName="fas fa-percent"
                    statIconColor="bg-lightBlue-500"
                />
                </div>
            </div>
        </div>

        <div className="flex flex-wrap">
            <div className="w-full px-4 mb-12 xl:w-8/12 xl:mb-0">
                <CardLineChart />
            </div>
            <div className="w-full px-4 xl:w-4/12">
                <CardBarChart />
            </div>
        </div>
        <div className="flex flex-wrap mt-4">
            <div className="w-full px-4 mb-12 xl:w-8/12 xl:mb-0">
                <CardPageVisits />
            </div>
            <div className="w-full px-4 xl:w-4/12">
                <CardSocialTraffic />
            </div>
        </div>
    </>
  );
}

Dashboard.layout = Admin;

export default Dashboard;