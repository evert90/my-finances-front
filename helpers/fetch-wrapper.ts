import axios, { AxiosRequestConfig, AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import getConfig from 'next/config';
import { userService } from '../services/user.service';

const { publicRuntimeConfig } = getConfig();

export interface ErrorMessage {
    message: string
}

const getApiUrl = (): string => {
    return getBaseUrl() + "/api"
}

const getBaseUrl = (): string => {
    return process.browser && localStorage.getItem("baseUrl") || ""
}

const apiClient: AxiosInstance = axios.create({
    baseURL: getApiUrl()
})

apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
    return config
}, (error) => {
    return Promise.reject(error)
})

const get = (url: string): Promise<any> => {
    return apiClient
        .get(url)
        .then(handleSuccess)
        .catch(handleError);
}

const post = (url: string, params: any): Promise<any> => {
    const options: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    return apiClient
        .post(url, params, options)
        .then(handleSuccess)
        .catch(handleError);
}

const _delete = (url: string): Promise<any> => {
    return apiClient
        .delete(url)
        .then(handleSuccess)
        .catch(handleError);
}

const handleSuccess = (response: AxiosResponse): Promise<any> => {
    return Promise.resolve(response.data)
}

const handleError = (error: AxiosError<ErrorMessage>): Promise<any> => {
    if ([401, 403].includes(error?.response?.status) && userService.getUserValue()) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        userService.logout();
    }

    const errorMsg = error?.response?.data?.message || error?.message;
    return Promise.reject(errorMsg);
}

export const fetchWrapper = {
    get: get,
    post: post,
    delete: _delete,
    getApiUrl: getApiUrl,
    getBaseUrl: getBaseUrl
};