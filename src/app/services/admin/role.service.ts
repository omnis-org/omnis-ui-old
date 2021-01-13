import { Injectable } from '@angular/core';
import { Role } from '@app/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public roles: Observable<Role[]>;
  private rolesSubject: BehaviorSubject<Role[]>;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  public get rolesValue(): Role[] {
    return this.rolesSubject.value;
  }

  getAll() {
    return this.http.get<Role[]>(`${environment.adminApiUrl}/roles`);
  }

  getById(id: number | string) {
    return this.http.get<Role>(`${environment.adminApiUrl}/role/${id}`);
  }

  update(role: Role) {
    return this.http.patch(`${environment.adminApiUrl}/role/${role.id}`, role, this.httpOptions);
  }

  insert(role: Role) {
    return this.http.post(`${environment.adminApiUrl}/role`, role, this.httpOptions);
  }

  delete(id: string | number) {
    return this.http.delete(`${environment.adminApiUrl}/role/${id}`);
  }
}
