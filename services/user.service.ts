import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '../helpers/fetch-wrapper';
import { User } from '../class/User';
import { utilsService } from './utils.service';

const baseUrl = '/users';
const userSubject = new BehaviorSubject<User>(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    userSubject,
    user: userSubject.asObservable(),
    getUserValue: (): User => { return userSubject.value },
    logout: logout,
    getUser: getUser,
    getFirstName: getFirstName
};

function logout() {
    userSubject.next(null);
    utilsService.redirect(`/gateway/logout`);
}

function getUser(): Promise<User> {
    return fetchWrapper.post(baseUrl, {});
}

function getFirstName(): string {
    const username = userService.getUserValue()?.name;
    return username?.includes(" ") ? username.split(" ")[0] : username
}