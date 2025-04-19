import { User } from "../class/User";
import { userService } from "./user.service";

const check = (setAuthorized, toast) => {
    userService.getUser().then((user: User) => {
        userService.userSubject.next(user);
        setAuthorized(true);
    })
    .catch(error => {
        setAuthorized(false);
        toast?.pushError("Erro ao buscar usuário. " + error, 7000, "truncate-2-lines");
    });
}

export const authService = {
    check: check,
}