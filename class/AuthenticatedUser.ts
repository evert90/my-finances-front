import { User } from "./User";

export interface AuthenticatedUser {
    user: User,
    token: string
}