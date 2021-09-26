import { TagTotal } from "./TagTotal";

export class PeriodTagTotal {
    constructor(
        public start: string,
        public end: string,
        public totals: Array<TagTotal>
    ) {}
}