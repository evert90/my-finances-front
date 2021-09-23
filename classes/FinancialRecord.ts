import { Moment } from "moment";
import { Tag } from "../classes/Tag";

export class FinancialRecord {
    constructor(
        public id: number,
        public name: string,
        public details: string,
        public value: number,
        public date: Moment,
        public type: string,
        public tags: Array<Tag>
    ) {}
}