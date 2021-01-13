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
  private refreshTimeout;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.networksSubject = new BehaviorSubject<OmnisNetwork[]>(null);
    this.networks = this.networksSubject.asObservable();
    // when the class is first called, fetch all data from api
    this.getAll().subscribe();
  }

  public get networksValue(): OmnisNetwork[] {
    return this.networksSubject.value;
  }

  getAll() {
    // get all obects from api
    return this.http.get<OmnisNetwork[]>(`${environment.omnisApiUrl}/networks`)
      .pipe(tap((networks) => {
        // update behaviorSubject object everytime the getAll function is called,
        // this is what makes the real time update work
        this.refreshTimeout();
        this.networksSubject.next(networks);
        return networks;
      })
      );
  }

  getById(id: number) {
    return this.http.get<OmnisNetwork>(`${environment.omnisApiUrl}/network/${id}`);
  }

  update(network: OmnisNetwork) {
    // update database entries using rest api
    return this.http.patch(`${environment.omnisApiUrl}/network/${network.id}`, network, this.httpOptions)
      .pipe(tap(_ => {
        const networks = this.networksValue; // get current local array state
        const networkToUpdate = networks.find(m => m.id === network.id); // find object to update
        const i = networks.indexOf(networkToUpdate);
        networks.splice(networks.indexOf(networkToUpdate), 1, network); // update the local array
        this.networksSubject.next(networks); // update behaviorSubject object
      }));
  }

  insert(network: OmnisNetwork) {
    //insert new entry in database using rest api
    return this.http.post<OmnisNetwork>(`${environment.omnisApiUrl}/network`, network, this.httpOptions)
      .pipe(tap(network => {
        const networks = this.networksValue; // get current local array state
        networks.push(network); // update the local array
        this.networksSubject.next(networks); // update behaviorSubject object
      }));
  }

  delete(id: string | number) {
    //delete entry in database using rest api
    return this.http.delete(`${environment.omnisApiUrl}/network/${id}`)
      .pipe(tap(_ => {
        const networks = this.networksValue; // get current local array state
        const networkToDelete = networks.find(m => m.id === id); // find object to delete
        networks.splice(networks.indexOf(networkToDelete), 1); // delete object
        this.networksSubject.next(networks); // update behaviorSubject object
      }));
  }

  private refreshTimer() {
    this.refreshTimeout = setTimeout(() => this.getAll().subscribe(), environment.refreshDataTimeout);
  }
}
