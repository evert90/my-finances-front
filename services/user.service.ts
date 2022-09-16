import { BehaviorSubject } from 'rxjs';
import Router from 'next/router'
import { fetchWrapper } from '../helpers/fetch-wrapper';
import { AuthenticatedUser } from '../class/AuthenticatedUser';
import { User } from '../class/User';
import { utilsService } from './utils.service';

const baseUrl = `${fetchWrapper.getApiUrl()}/users`;
const userSubject = new BehaviorSubject<AuthenticatedUser>(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    userSubject,
    user: userSubject.asObservable(),
    getUserValue: (): AuthenticatedUser => { return userSubject.value },
    login,
    logout,
    getAll,
    save
};

function save(user: User): Promise<AuthenticatedUser> {
    return fetchWrapper.post(`${baseUrl}/`, user)
        .then((user: AuthenticatedUser) => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function login(user: User): Promise<AuthenticatedUser> {
    return fetchWrapper.post(`${baseUrl}/auth`, user)
        .then((user) => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    utilsService.redirect(`${baseUrl}/auth/logout`);
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}