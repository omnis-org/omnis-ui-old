import { Injectable } from '@angular/core';
import { OmnisNetwork } from './objects/network';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LogService } from './log.service';
@Injectable({
  providedIn: 'root'
})
export class NetworksService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private api_url = 'https://localhost:4321';
  private networks_path = '/api/networks';  // URL to web api
  private network_path = '/api/network';  // URL to web api
  constructor(private http: HttpClient, private logService: LogService) { }

  getNetworks(): Observable<OmnisNetwork[]> {
    return this.http.get<OmnisNetwork[]>(this.api_url + this.networks_path).pipe(
      tap(_ => this.log('fetched networks')),
      catchError(this.handleError<OmnisNetwork[]>('getNetworks', []))
    );
  }

  getNetwork(id: number): Observable<OmnisNetwork> {
    const url = `${this.api_url + this.network_path}/${id}`;
    return this.http.get<OmnisNetwork>(url).pipe(
      tap(_ => this.log(`fetched network id=${id}`)),
      catchError(this.handleError<OmnisNetwork>(`getNetwork id=${id}`))
    );
  }
  updateNetwork(network: OmnisNetwork): Observable<any> {
    return this.http.put(this.api_url + this.network_path + '/' + network.id, network, this.httpOptions).pipe(
      tap(_ => this.log(`updated network id=${network.id}`)),
      catchError(this.handleError<any>('updateNetwork'))
    );
  }
  addNetwork(network: OmnisNetwork): Observable<OmnisNetwork> {
    return this.http.post<OmnisNetwork>(this.api_url + this.networks_path, network, this.httpOptions).pipe(
      tap((newNetwork: OmnisNetwork) => this.log(`added network w/ id=${network.id}`)),
      catchError(this.handleError<OmnisNetwork>('addNetwork'))
    );
  }
  deleteNetwork(network: OmnisNetwork | number): Observable<OmnisNetwork> {
    const id = typeof network === 'number' ? network : network.id;
    const url = `${this.api_url + this.network_path}/${id}`;
    return this.http.delete<OmnisNetwork>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted network id=${id}`)),
      catchError(this.handleError<OmnisNetwork>('deleteNetwork'))
    );
  }
  private log(message: string) {
    this.logService.add(`networksService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
