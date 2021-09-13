import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import { fetchWrapper } from '../helpers/fetch-wrapper';


const { publicRuntimeConfig } = getConfig();
const baseUrl =  `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    getUserValue: () => { return userSubject.value },
    login,
    logout,
    getAll,
    save
};

function save(user) {
    return fetchWrapper.post(`${baseUrl}/`, user)
        .then((user) => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function login(user) {
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
    Router.push('/login');
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}