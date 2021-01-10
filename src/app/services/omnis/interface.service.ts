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
    //when the class is first called, fetch all data from api
    this.getAll().subscribe();
  }

  public get interfacesValue(): OmnisInterface[] {
    return this.interfacesSubject.value;
  }

  getAll() {
    //get all obects from api
    return this.http.get<OmnisInterface[]>(`${environment.omnisApiUrl}/interfaces`)
      .pipe(tap((interfaces) => {
        /*update behaviorSubject object everytime the getAll function is called,
         this is what makes the real time update work*/
        this.interfacesSubject.next(interfaces);
        return interfaces;
      })
      );
  }

  getById(id: number) {
    return this.http.get<OmnisInterface>(`${environment.omnisApiUrl}/interface/${id}`);
  }

  update(itf: OmnisInterface) {
    //update database entries using rest api
    return this.http.put<any>(`${environment.omnisApiUrl}/interface/${itf.id}`, itf, this.httpOptions)
      .pipe(tap(_ => {
        //get current local array state
        const interfaces = this.interfacesValue;
        //find object to update
        const interfaceToUpdate = interfaces.find(m => m.id === itf.id);
        const i = interfaces.indexOf(interfaceToUpdate);
        //update the local array
        interfaces.splice(interfaces.indexOf(interfaceToUpdate), 1, itf);
        //update behaviorSubject object
        this.interfacesSubject.next(interfaces);
      }));
  }

  insert(itf: OmnisInterface) {
    //insert new entry in database using rest api
    return this.http.post<any>(`${environment.omnisApiUrl}/interface`, itf, this.httpOptions)
      .pipe(tap(itf => {
        //get current local array state
        const interfaces = this.interfacesValue;
        //update the local array
        interfaces.push(itf);
        //update behaviorSubject object
        this.interfacesSubject.next(interfaces);
      }));
  }

  delete(id: string | number) {
    //delete entry in database using rest api
    return this.http.delete<any>(`${environment.omnisApiUrl}/interface/${id}`, this.httpOptions)
      .pipe(tap(_ => {
        //get current local array state
        const interfaces = this.interfacesValue;
        //find object to delete
        const interfaceToDelete = interfaces.find(m => m.id === id);
        //delete object
        interfaces.splice(interfaces.indexOf(interfaceToDelete), 1);
        //update behaviorSubject object
        this.interfacesSubject.next(interfaces);
      }));
  }
}
