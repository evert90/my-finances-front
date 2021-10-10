import { CardOnDemandFilterBy } from "./CardOnDemandFilterBy";
import { PeriodTagTotal } from "./PeriodTagTotal";
import { PeriodTotal } from "./PeriodTotal";
import { PeriodType } from "./PeriodType";
import { Tag } from "./Tag";

export class CardOnDemand {
    constructor(
        public id: string,
        public type: any,
        public width: string,
        public height: string,
        public tags: Array<Tag>,
        public periodType: PeriodType,
        public totalPeriods: number,
        public data: Array<PeriodTagTotal> | Array<PeriodTotal>,
        public filterBy: CardOnDemandFilterBy
    ) { }
}