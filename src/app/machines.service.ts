import { Injectable } from '@angular/core';
import { Machine } from './objects/machine';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LogService} from './log.service'

@Injectable({
  providedIn: 'root'
})
export class MachinesService {
  private api_url = 'http://localhost:4321'
  private machines_path = '/api/machines';  // URL to web api
  private machine_path = '/api/machine';  // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin' : '*'})
  };
  constructor(private http: HttpClient, private logService: LogService) { }

  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.api_url + this.machines_path).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Machine[]>('getHeroes', []))
    );
  }

  getMachine(id: number): Observable<Machine> {
    const url = `${this.api_url + this.machine_path}/${id}`;
    return this.http.get<Machine>(url).pipe(
      tap(_ => this.log(`fetched machine id=${id}`)),
      catchError(this.handleError<Machine>(`getMachine id=${id}`))
    );
  }
  updateMachine(machine: Machine): Observable<any> {
    return this.http.put(this.api_url + this.machines_path, machine, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${machine.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  addMachine(machine: Machine): Observable<Machine> {
    return this.http.post<Machine>(this.api_url + this.machines_path, machine, this.httpOptions).pipe(
      tap((newHero: Machine) => this.log(`added machine w/ id=${newHero.id}`)),
      catchError(this.handleError<Machine>('addMachine'))
    );
  }
  deleteMachine(hero: Machine | number): Observable<Machine> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.api_url + this.machines_path}/${id}`;
  
    return this.http.delete<Machine>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Machine>('deleteHero'))
    );
  }
  private log(message: string) {
    this.logService.add(`machineService: ${message}`);
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