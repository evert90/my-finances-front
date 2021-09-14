import { Tag } from "./tag";

export class FinancialRecord {
    constructor(
        public id: number,
        public name: string,
        public details: string,
        public value: number,
        public date: Date,
        public type: string,
        public tags: Array<Tag>
    ) {}
}