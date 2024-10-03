import { pushSubscriptionService } from "./push-subscribe.service";

export const utilsService = {
    getNullable,
    redirect
}

function getNullable(value: any) {
    return value ? value : null
}

function redirect(url: string) {
    window.location.assign(url)
}