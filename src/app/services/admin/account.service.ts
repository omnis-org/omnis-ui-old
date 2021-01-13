/* eslint-disable no-bitwise */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { sha256 } from 'js-sha256';
import { environment } from '@environments/environment';
import { Role, User, UserToken } from '@app/models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RoleService } from './role.service';

const jwtHelper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class AccountService {
    // current user
    public user: Observable<User>; // subscribe to get current user
    private userSubject: BehaviorSubject<User>;
    // current token
    private userToken: UserToken;
    // current role
    private userRole: Role;
    private refreshTokenTimeout;

    constructor(
        private router: Router,
        private http: HttpClient,
        private roleService: RoleService
    ) {
        this.userToken = JSON.parse(localStorage.getItem('userToken'));
        this.userSubject = new BehaviorSubject<User>(jwtHelper.decodeToken<User>(this.userToken?.token));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get roleValue(): Role {
        return this.userRole;
    }

    public get userTokenValue(): UserToken {
        return this.userToken;
    }

    /// PERMISSIONS GETTER ///
    get oneAdminReadPermision() {
        return (this.userRole && (this.userRole.omnisPermissions !== 0 || this.userRole.usersPermissions !== 0 ||
            this.userRole.rolesPermissions !== 0 || this.userRole.pendingMachinesPermissions !== 0));
    }

    get omnisReadPermission() {
        return this.userRole && (this.userRole.omnisPermissions & 1) === 1;
    }

    get omnisInsertPermission() {
        return this.userRole && (this.userRole.omnisPermissions >> 1 & 1) === 1;
    }

    get omnisUpdatePermission() {
        return this.userRole && (this.userRole.omnisPermissions >> 2 & 1) === 1;
    }

    get omnisDeletePermission() {
        return this.userRole && (this.userRole.omnisPermissions >> 3 & 1) === 1;
    }

    get pendingMachinesReadPermission() {
        return this.userRole && (this.userRole.pendingMachinesPermissions & 1) === 1;
    }

    get pendingMachinesInsertPermission() {
        return this.userRole && (this.userRole.pendingMachinesPermissions >> 1 & 1) === 1;
    }

    get pendingMachinesUpdatePermission() {
        return this.userRole && (this.userRole.pendingMachinesPermissions >> 2 & 1) === 1;
    }

    get pendingMachinesDeletePermission() {
        return this.userRole && (this.userRole.pendingMachinesPermissions >> 3 & 1) === 1;
    }

    get usersReadPermission() {
        return this.userRole && (this.userRole.usersPermissions & 1) === 1;
    }

    get usersInsertPermission() {
        return this.userRole && (this.userRole.usersPermissions >> 1 & 1) === 1;
    }

    get usersUpdatePermission() {
        return this.userRole && (this.userRole.usersPermissions >> 2 & 1) === 1;
    }

    get usersDeletePermission() {
        return this.userRole && (this.userRole.usersPermissions >> 3 & 1) === 1;
    }


    get rolesReadPermission() {
        return this.userRole && (this.userRole.rolesPermissions & 1) === 1;
    }

    get rolesInsertPermission() {
        return this.userRole && (this.userRole.rolesPermissions >> 1 & 1) === 1;
    }

    get rolesUpdatePermission() {
        return this.userRole && (this.userRole.rolesPermissions >> 2 & 1) === 1;
    }

    get rolesDeletePermission() {
        return this.userRole && (this.userRole.rolesPermissions >> 3 & 1) === 1;
    }


    /// User functions ///

    // check if first connection
    firstConnection() {
        return this.http.get<any>(`${environment.adminUrl}/first`)
            .pipe(map(res => res.result ? true : false));
    }

    login(username, password) {
        password = sha256(password);
        return this.http.post<UserToken>(`${environment.adminUrl}/login`, { username, password })
            .pipe(map(userToken => { this.processUserToken(userToken); }));
    }

    // refresh token and launch timer
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
        if (typeof (user.roleId) === 'string') {
            user.roleId = parseInt(user.roleId, 10);
        }
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

        if (typeof (user.roleId) === 'string') {
            user.roleId = parseInt(user.roleId, 10);
        }

        return this.http.patch(`${environment.adminUrl}/update/${id}`, user)
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
        return this.http.delete(`${environment.adminApiUrl}/user/${id}`)
            .pipe(tap(_ => {
                // auto logout if the logged in user deleted their own record
                if (id === this.userValue.id) {
                    this.logout();
                }
            }));
    }

    private startRefreshTokenTimer() {
        const timeout = (this.userToken.expireAt - (Date.now() / 1000)) * 1000 - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

    private processUserToken(userToken: UserToken): User {
        this.userToken = userToken;
        localStorage.setItem('userToken', JSON.stringify(this.userToken));
        const user: User = jwtHelper.decodeToken<User>(this.userToken.token);
        this.userSubject.next(user);
        this.processRole();
        this.startRefreshTokenTimer();
        return user;
    }

    private processRole() {
        if (this.userValue != null) {
            this.roleService.getById(this.userValue.roleId)
                .subscribe({
                    next: role => {
                        this.userRole = role;
                    },
                    error: error => {
                        this.userRole = null;
                    }
                });
        }
    }

}
