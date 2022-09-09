export class User {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public id?: number,
        public roles?: Array<string>) {}
}