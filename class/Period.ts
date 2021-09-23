import { FinancialRecord } from "./FinancialRecord";

export class Period {
    constructor(
        public start: string,
        public end: string,
        public records: Array<FinancialRecord>
    ) {}
}