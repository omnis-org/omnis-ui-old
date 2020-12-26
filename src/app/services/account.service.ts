import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { sha256 } from 'js-sha256';
import { environment } from '@environments/environment';
import { User, UserToken } from '@app/models';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwt_helper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class AccountService {
    public user: Observable<User>;
    private userSubject: BehaviorSubject<User>;
    private userToken: UserToken;
    private refresh_token_timeout;

    constructor(
        private router: Router,
        private http: HttpClient,
    ) {
        this.userToken = JSON.parse(localStorage.getItem('userToken'));
        this.userSubject = new BehaviorSubject<User>(jwt_helper.decodeToken<User>(this.userToken?.token));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get userTokenValue(): UserToken {
        return this.userToken;
    }

    login(username, password) {
        password = sha256(password);
        return this.http.post<UserToken>(`${environment.adminUrl}/login`, { username, password })
            .pipe(map(userToken => { this.processUserToken(userToken); }));
    }

    refreshToken() {
        return this.http.get<UserToken>(`${environment.adminUrl}/refresh`, { withCredentials: true })
            .pipe(map(userToken => { this.processUserToken(userToken); }));
    }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('userToken');
        this.userSubject.next(null);
        this.stopRefreshTokenTimer();
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        user.password = sha256(user.password);
        return this.http.post(`${environment.adminUrl}/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.adminApiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.adminApiUrl}/user/${id}`);
    }

    update(id, user: User) {
        if (user.password !== '') {
            user.password = sha256(user.password);
        } else {
            user.password = null;
        }

        return this.http.put(`${environment.adminUrl}/update/${id}`, user)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id === this.userValue.id) {
                    // update local storage
                    const u = { ...this.userValue, ...user };
                    localStorage.setItem('user', JSON.stringify(u));

                    // publish updated user to subscribers
                    this.userSubject.next(u);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete<any>(`${environment.adminApiUrl}/user/${id}`, { responseType: 'text/plain' as 'json' })
            .pipe(tap(_ => {
                // auto logout if the logged in user deleted their own record
                if (id === this.userValue.id) {
                    this.logout();
                }
            }));
    }

    private startRefreshTokenTimer() {
        const timeout = (this.userToken.expireAt - (Date.now() / 1000)) * 1000 - (60 * 1000);
        this.refresh_token_timeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refresh_token_timeout);
    }

    private processUserToken(userToken: UserToken): User {
        this.userToken = userToken;
        localStorage.setItem('userToken', JSON.stringify(this.userToken));
        const user: User = jwt_helper.decodeToken<User>(this.userToken.token);
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
    }

}
