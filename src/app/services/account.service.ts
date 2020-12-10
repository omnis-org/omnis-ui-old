import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    public user: Observable<User>;
    private userSubject: BehaviorSubject<User>;
    private refresh_token_timeout;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {
        return this.http.post<User>(`${environment.omnisApi}/admin/login`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    refreshToken() {
        return this.http.get<User>(`${environment.omnisApi}/admin/refresh`, { withCredentials: true })
            .pipe(map((user) => {
                this.userSubject.next(user);
                this.startRefreshTokenTimer();
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.stopRefreshTokenTimer();
        this.router.navigate(['/admin/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.omnisApi}/admin/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.omnisApi}/api/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.omnisApi}/api/user/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.omnisApi}/user/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id === this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.omnisApi}/user/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id === this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }

    private startRefreshTokenTimer() {
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(this.userValue.expireAt);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refresh_token_timeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refresh_token_timeout);
    }
}
