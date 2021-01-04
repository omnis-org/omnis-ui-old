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
    return this.http.get<OmnisInterface[]>(`${environment.omnisApiUrl}/interfaces`)
      .pipe(tap((interfaces) => {
        this.interfacesSubject.next(interfaces);
        return interfaces;
      })
      );
  }

  getById(id: number) {
    return this.http.get<OmnisInterface>(`${environment.omnisApiUrl}/interface/${id}`);
  }

  update(itf: OmnisInterface) {
    return this.http.put<any>(`${environment.omnisApiUrl}/interface/${itf.id}`, itf, this.httpOptions)
      .pipe(tap(_ => {
        const interfaces = this.interfacesValue;
        const interfaceToUpdate = interfaces.find(m => m.id === itf.id);
        const i = interfaces.indexOf(interfaceToUpdate);
        interfaces.splice(interfaces.indexOf(interfaceToUpdate), 1, itf);
        this.interfacesSubject.next(interfaces);
      }));
  }

  insert(itf: OmnisInterface) {
    return this.http.post<any>(`${environment.omnisApiUrl}/interface`, itf, this.httpOptions)
      .pipe(tap(itf => {
        const interfaces = this.interfacesValue;
        interfaces.push(itf);
        this.interfacesSubject.next(interfaces);
      }));
  }

  delete(id: string | number) {
    return this.http.delete<any>(`${environment.omnisApiUrl}/interface/${id}`, this.httpOptions)
      .pipe(tap(_ => {
        const interfaces = this.interfacesValue;
        const interfaceToDelete = interfaces.find(m => m.id === id);
        interfaces.splice(interfaces.indexOf(interfaceToDelete), 1);
        this.interfacesSubject.next(interfaces);
      }));
  }
}
