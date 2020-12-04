import { Injectable } from '@angular/core';
import { OmnisInterface } from './objects/interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private api_url = 'https://localhost:4321';
  private interfaces_path = '/api/interfaces';  // URL to web api
  private interface_path = '/api/interface';  // URL to web api
  constructor(private http: HttpClient, private logService: LogService) { }

  getInterfaces(): Observable<OmnisInterface[]> {
    return this.http.get<OmnisInterface[]>(this.api_url + this.interfaces_path).pipe(
      tap(_ => this.log('fetched Interfaces')),
      catchError(this.handleError<OmnisInterface[]>('getInterfaces', []))
    );
  }

  getInterface(id: number): Observable<OmnisInterface> {
    const url = `${this.api_url + this.interface_path}/${id}`;
    return this.http.get<OmnisInterface>(url).pipe(
      tap(_ => this.log(`fetched Interface id=${id}`)),
      catchError(this.handleError<OmnisInterface>(`getInterface id=${id}`))
    );
  }
  updateInterface(interf: OmnisInterface): Observable<any> {
    return this.http.put(this.api_url + this.interface_path + '/' + interf.id, interf, this.httpOptions).pipe(
      tap(_ => this.log(`updated interface id=${interf.id}`)),
      catchError(this.handleError<any>('updateInterface'))
    );
  }
  addInterface(interf: OmnisInterface): Observable<OmnisInterface> {
    return this.http.post<OmnisInterface>(this.api_url + this.interfaces_path, interf, this.httpOptions).pipe(
      tap((newInterface: OmnisInterface) => this.log(`added interface w/ id=${interf.id}`)),
      catchError(this.handleError<OmnisInterface>('addInterface'))
    );
  }
  deleteInterface(interf: OmnisInterface | number): Observable<OmnisInterface> {
    const id = typeof interf === 'number' ? interf : interf.id;
    const url = `${this.api_url + this.interface_path}/${id}`;
    return this.http.delete<OmnisInterface>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted interface id=${id}`)),
      catchError(this.handleError<OmnisInterface>('deleteInterface'))
    );
  }
  private log(message: string) {
    this.logService.add(`InterfacesService: ${message}`);
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
