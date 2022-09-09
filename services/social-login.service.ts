import { AuthenticatedUser } from "../class/AuthenticatedUser";
import jwt_decode from "jwt-decode";
import { userService } from "./user.service";
import { fetchWrapper } from "../helpers/fetch-wrapper";

export const socialLoginService = {
    getGoogleUrl,
    getGithubUrl,
    hasParams,
    login
}

function getGoogleUrl() {
    return fetchWrapper.getBaseUrl() + "/oauth2/authorization/google"
}

function getGithubUrl() {
    return fetchWrapper.getBaseUrl() + "/oauth2/authorization/github"
}

function hasParams(): boolean {
    const url = new URL(window.location.href);
    if(!!url.searchParams.get("token")) {
        const decodedToken: any = jwt_decode(url.searchParams.get("token"));
        return !!decodedToken?.id && !!decodedToken?.name && !!decodedToken?.email
    }

    return false;
}

function login(): void {
    const url = new URL(window.location.href);
    const decodedToken: any = jwt_decode(url.searchParams.get("token"));
    const user: AuthenticatedUser = {
        user: {
            id: parseInt(decodedToken?.id),
            name: decodedToken?.name,
            email: decodedToken?.email,
            password: null
        },
        token: url.searchParams.get("token")
    }
    userService.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
}


