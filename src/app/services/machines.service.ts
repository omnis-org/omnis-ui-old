import { Injectable } from '@angular/core';
import { OmnisMachine } from '../models/machine';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class MachinesService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private api_url = 'https://localhost:4321';
  private machines_path = '/api/machines';  // URL to web api
  private machine_path = '/api/machine';  // URL to web api
  constructor(private http: HttpClient, private logService: LogService) { }

  getMachines(): Observable<OmnisMachine[]> {
    return this.http.get<OmnisMachine[]>(this.api_url + this.machines_path).pipe(
      tap(_ => this.log('fetched machines')),
      catchError(this.handleError<OmnisMachine[]>('getMachines', []))
    );
  }

  getMachine(id: number): Observable<OmnisMachine> {
    const url = `${this.api_url + this.machine_path}/${id}`;
    return this.http.get<OmnisMachine>(url).pipe(
      tap(_ => this.log(`fetched machine id=${id}`)),
      catchError(this.handleError<OmnisMachine>(`getMachine id=${id}`))
    );
  }
  updateMachine(machine: OmnisMachine): Observable<any> {
    return this.http.put(this.api_url + this.machine_path + '/' + machine.id, machine, this.httpOptions).pipe(
      tap(_ => this.log(`updated machine id=${machine.id}`)),
      catchError(this.handleError<any>('updateMachine'))
    );
  }
  addMachine(machine: OmnisMachine): Observable<OmnisMachine> {
    return this.http.post<OmnisMachine>(this.api_url + this.machines_path, machine, this.httpOptions).pipe(
      tap((newMachine: OmnisMachine) => this.log(`added machine w/ id=${newMachine.id}`)),
      catchError(this.handleError<OmnisMachine>('addMachine'))
    );
  }
  deleteMachine(machine: OmnisMachine | number): Observable<OmnisMachine> {
    const id = typeof machine === 'number' ? machine : machine.id;
    const url = `${this.api_url + this.machine_path}/${id}`;
    return this.http.delete<OmnisMachine>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted machine id=${id}`)),
      catchError(this.handleError<OmnisMachine>('deletedMachine'))
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