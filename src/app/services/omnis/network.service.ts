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
    this.getAll().subscribe();
  }

  public get networksValue(): OmnisNetwork[] {
    return this.networksSubject.value;
  }

  getAll() {
    return this.http.get<OmnisNetwork[]>(`${environment.omnisApiUrl}/networks`)
      .pipe(tap((networks) => {
        this.networksSubject.next(networks);
        return networks;
      })
      );
  }

  getById(id: number) {
    return this.http.get<OmnisNetwork>(`${environment.omnisApiUrl}/network/${id}`);
  }

  update(network: OmnisNetwork) {
    return this.http.put<any>(`${environment.omnisApiUrl}/network/${network.id}`, network, this.httpOptions)
      .pipe(tap(_ => {
        const networks = this.networksValue;
        const networkToUpdate = networks.find(m => m.id === network.id);
        const i = networks.indexOf(networkToUpdate);
        networks.splice(networks.indexOf(networkToUpdate), 1, network);
        this.networksSubject.next(networks);
      }));
  }

  insert(network: OmnisNetwork) {
    return this.http.post<any>(`${environment.omnisApiUrl}/network`, network, this.httpOptions)
      .pipe(tap(network => {
        const networks = this.networksValue;
        networks.push(network);
        this.networksSubject.next(networks);
      }));
  }

  delete(id: string | number) {
    return this.http.delete<any>(`${environment.omnisApiUrl}/network/${id}`, this.httpOptions)
      .pipe(tap(_ => {
        const networks = this.networksValue;
        const networkToDelete = networks.find(m => m.id === id);
        networks.splice(networks.indexOf(networkToDelete), 1);
        this.networksSubject.next(networks);
      }));
  }
}
