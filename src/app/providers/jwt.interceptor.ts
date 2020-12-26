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
        const user_token = this.accountService.userTokenValue;
        const is_logged_in = user_token && user_token.token;
        const is_server_url = request.url.startsWith(environment.omnisApiUrl) ||
            request.url.startsWith(environment.adminApiUrl) ||
            request.url.startsWith(environment.adminUrl);
        if (is_logged_in && is_server_url) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user_token.token}`
                }
            });
        }

        return next.handle(request);
    }
}
