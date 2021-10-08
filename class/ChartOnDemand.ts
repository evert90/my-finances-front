import { ChartOnDemandFilterBy } from "./ChartOnDemandFilterBy";
import { PeriodTagTotal } from "./PeriodTagTotal";
import { PeriodTotal } from "./PeriodTotal";
import { PeriodType } from "./PeriodType";
import { Tag } from "./Tag";

export class ChartOnDemand {
    constructor(
        public id: string,
        public type: "line"
        | "area"
        | "bar"
        | "histogram"
        | "pie"
        | "donut"
        | "radialBar"
        | "scatter"
        | "bubble"
        | "heatmap"
        | "treemap"
        | "boxPlot"
        | "candlestick"
        | "radar"
        | "polarArea"
        | "rangeBar",
        public width: string,
        public height: string,
        public tags: Array<Tag>,
        public periodType: PeriodType,
        public totalPeriods: number,
        public data: Array<PeriodTagTotal> | Array<PeriodTotal>,
        public filterBy: ChartOnDemandFilterBy
    ) { }
}