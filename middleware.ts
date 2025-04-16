import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {

    const xsrf = request.cookies.get('XSRF-TOKEN')?.value;

    if(xsrf) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('X-XSRF-TOKEN', xsrf);

        return NextResponse.rewrite(request.nextUrl, {
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}