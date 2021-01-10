import { Injectable } from '@angular/core';
import { OmnisNetwork } from '@app/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public networks: Observable<OmnisNetwork[]>;
  private networksSubject: BehaviorSubject<OmnisNetwork[]>;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    responseType: 'text/plain' as 'json'
  };

  constructor(private http: HttpClient) {
    this.networksSubject = new BehaviorSubject<OmnisNetwork[]>(null);
    this.networks = this.networksSubject.asObservable();
    //when the class is first called, fetch all data from api
    this.getAll().subscribe();
  }

  public get networksValue(): OmnisNetwork[] {
    return this.networksSubject.value;
  }

  getAll() {
    //get all obects from api
    return this.http.get<OmnisNetwork[]>(`${environment.omnisApiUrl}/networks`)
      .pipe(tap((networks) => {
        /*update behaviorSubject object everytime the getAll function is called,
         this is what makes the real time update work*/
        this.networksSubject.next(networks);
        return networks;
      })
      );
  }

  getById(id: number) {
    return this.http.get<OmnisNetwork>(`${environment.omnisApiUrl}/network/${id}`);
  }

  update(network: OmnisNetwork) {
    //update database entries using rest api
    return this.http.put<any>(`${environment.omnisApiUrl}/network/${network.id}`, network, this.httpOptions)
      .pipe(tap(_ => {
        //get current local array state
        const networks = this.networksValue;
        //find object to update
        const networkToUpdate = networks.find(m => m.id === network.id);
        const i = networks.indexOf(networkToUpdate);
        //update the local array
        networks.splice(networks.indexOf(networkToUpdate), 1, network);
        //update behaviorSubject object
        this.networksSubject.next(networks);
      }));
  }

  insert(network: OmnisNetwork) {
    //insert new entry in database using rest api
    return this.http.post<any>(`${environment.omnisApiUrl}/network`, network, this.httpOptions)
      .pipe(tap(network => {
        //get current local array state
        const networks = this.networksValue;
        //update the local array
        networks.push(network);
        //update behaviorSubject object
        this.networksSubject.next(networks);
      }));
  }

  delete(id: string | number) {
    //delete entry in database using rest api
    return this.http.delete<any>(`${environment.omnisApiUrl}/network/${id}`, this.httpOptions)
      .pipe(tap(_ => {
        //get current local array state
        const networks = this.networksValue;
        //find object to delete
        const networkToDelete = networks.find(m => m.id === id);
        //delete object
        networks.splice(networks.indexOf(networkToDelete), 1);
        //update behaviorSubject object
        this.networksSubject.next(networks);
      }));
  }
}
