import { FinancialRecordTotal } from "./FinancialRecordTotal";

export class PeriodTotal {
    constructor(
        public start: string,
        public end: string,
        public totals: Array<FinancialRecordTotal>
    ) {}
}