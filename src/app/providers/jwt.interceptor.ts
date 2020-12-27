import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService } from '@app/services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const userToken = this.accountService.userTokenValue;
        const isLoggedIn = userToken && userToken.token;
        const isServerUrl = request.url.startsWith(environment.omnisApiUrl) ||
            request.url.startsWith(environment.adminApiUrl) ||
            request.url.startsWith(environment.adminUrl);
        if (isLoggedIn && isServerUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${userToken.token}`
                }
            });
        }

        return next.handle(request);
    }
}
