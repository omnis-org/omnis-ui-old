import { Injectable } from '@angular/core';
import { OmnisMachine } from '../models/machine';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LogService } from './log.service';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MachinesService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private logService: LogService) { }

  getMachines(): Observable<OmnisMachine[]> {
    return this.http.get<OmnisMachine[]>(`${environment.omnisApi}/api/machines`).pipe(
      tap(_ => this.log('fetched machines')),
      catchError(this.handleError<OmnisMachine[]>('getMachines', []))
    );
  }

  getMachine(id: number): Observable<OmnisMachine> {
    const url = `${environment.omnisApi}/api/machine/${id}`;
    return this.http.get<OmnisMachine>(url).pipe(
      tap(_ => this.log(`fetched machine id=${id}`)),
      catchError(this.handleError<OmnisMachine>(`getMachine id=${id}`))
    );
  }
  updateMachine(machine: OmnisMachine): Observable<any> {
    return this.http.put(`${environment.omnisApi}/api/machine/${machine.id}`, machine, this.httpOptions).pipe(
      tap(_ => this.log(`updated machine id=${machine.id}`)),
      catchError(this.handleError<any>('updateMachine'))
    );
  }
  addMachine(machine: OmnisMachine): Observable<OmnisMachine> {
    return this.http.post<OmnisMachine>(`${environment.omnisApi}/api/machine`, machine, this.httpOptions).pipe(
      tap((newMachine: OmnisMachine) => this.log(`added machine w/ id=${newMachine.id}`)),
      catchError(this.handleError<OmnisMachine>('addMachine'))
    );
  }
  deleteMachine(machine: OmnisMachine | number): Observable<OmnisMachine> {
    const id = typeof machine === 'number' ? machine : machine.id;
    return this.http.delete<OmnisMachine>(`${environment.omnisApi}/api/machine/${id}`, this.httpOptions).pipe(
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
