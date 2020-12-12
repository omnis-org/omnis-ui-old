import { Injectable } from '@angular/core';
import { OmnisInterface } from '@app/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InterfaceService {
  public interfaces: Observable<OmnisInterface[]>;
  private interfacesSubject: BehaviorSubject<OmnisInterface[]>;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    responseType: 'text/plain' as 'json'
  };

  constructor(private http: HttpClient) {
    this.interfacesSubject = new BehaviorSubject<OmnisInterface[]>(null);
    this.interfaces = this.interfacesSubject.asObservable();
    this.getAll().subscribe();
  }

  public get interfacesValue(): OmnisInterface[] {
    return this.interfacesSubject.value;
  }

  getAll() {
    return this.http.get<OmnisInterface[]>(`${environment.omnisApi}/api/interfaces`)
      .pipe(tap((interfaces) => {
        this.interfacesSubject.next(interfaces);
        return interfaces;
      })
      );
  }

  getById(id: number) {
    return this.http.get<OmnisInterface>(`${environment.omnisApi}/api/interface/${id}`);
  }

  update(itf: OmnisInterface) {
    return this.http.put<any>(`${environment.omnisApi}/api/interface/${itf.id}`, itf, this.httpOptions)
      .pipe(tap(_ => {
        const interfaces = this.interfacesValue;
        const interface_to_update = interfaces.find(m => m.id === itf.id);
        const i = interfaces.indexOf(interface_to_update);
        interfaces.splice(interfaces.indexOf(interface_to_update), 1, itf);
        this.interfacesSubject.next(interfaces);
      }));
  }

  add(itf: OmnisInterface) {
    return this.http.post<any>(`${environment.omnisApi}/api/interface`, itf, this.httpOptions)
      .pipe(tap(itf => {
        const interfaces = this.interfacesValue;
        interfaces.push(itf);
        this.interfacesSubject.next(interfaces);
      }));
  }

  delete(itf: OmnisInterface | number) {
    const id = typeof itf === 'number' ? itf : itf.id;
    return this.http.delete<any>(`${environment.omnisApi}/api/interface/${id}`, this.httpOptions)
      .pipe(tap(_ => {
        const interfaces = this.interfacesValue;
        const interface_to_delete = interfaces.find(m => m.id === id);
        interfaces.splice(interfaces.indexOf(interface_to_delete), 1);
        this.interfacesSubject.next(interfaces);
      }));
  }
}
