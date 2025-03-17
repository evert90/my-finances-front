import { Moment } from "moment";
import { AssetRendaFixaRateType } from "./AssetRendaFixaRateType";
import { AssetRendaFixaType } from "./AssetRendaFixaType";
import { AssetType } from "./AssetType";
import { Tag } from "./Tag";

export class Asset {
    constructor(
        public id: number,
        public name: string,
        public details: string,
        public initialValue: number,
        public endValue: number,
        public initialDate: Moment,
        public endDate: Moment,
        public type: AssetType,
        public tags: Array<Tag>,
        public rendaFixaType?: AssetRendaFixaType,
        public rendaFixaRateType?: AssetRendaFixaRateType,
        public bank?: string,
        public rate?: number,
        public liquidez?: boolean,
        public createdAt?: Moment,
        public updatedAt?: Moment,
        public redemptionDate?: Moment,
    ) {}
}