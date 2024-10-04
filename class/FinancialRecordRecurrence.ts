import { Moment } from "moment";
import { RecurrencePeriod } from "./RecurrencePeriod";
import { Tag } from "./Tag";

export class FinancialRecordRecurrence {
    constructor(
        public id: number,
        public name: string,
        public details: string,
        public value: number,
        public date: Moment,
        public type: string,
        public tags: Array<Tag>,
        public paid: boolean,
        public notification: boolean,
        public recurrence: boolean,
        public recurrencePeriod: RecurrencePeriod,
        public recurrenceQuantity: number,
        public recurrenceEmptyValue: boolean,
        public createdAt?: Moment,
        public updatedAt?: Moment,
    ) {}
}