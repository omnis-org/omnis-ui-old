import { Injectable } from '@angular/core';
import { OmnisMachine } from '@app/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MachineService {
  public machines: Observable<OmnisMachine[]>;
  private machinesSubject: BehaviorSubject<OmnisMachine[]>;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    responseType: 'text/plain' as 'json'
  };

  constructor(private http: HttpClient) {
    this.machinesSubject = new BehaviorSubject<OmnisMachine[]>(null);
    this.machines = this.machinesSubject.asObservable();
    this.getAll().subscribe();
  }

  public get machinesValue(): OmnisMachine[] {
    return this.machinesSubject.value;
  }

  getAll() {
    return this.http.get<OmnisMachine[]>(`${environment.omnisApiUrl}/machines`)
      .pipe(tap((machines) => {
        this.machinesSubject.next(machines);
        return machines;
      })
      );
  }

  getById(id: number) {
    return this.http.get<OmnisMachine>(`${environment.omnisApiUrl}/machine/${id}`);
  }

  update(machine: OmnisMachine) {
    return this.http.put<any>(`${environment.omnisApiUrl}/machine/${machine.id}`, machine, this.httpOptions)
      .pipe(tap(_ => {
        const machines = this.machinesValue;
        const machineToUpdate = machines.find(m => m.id === machine.id);
        const i = machines.indexOf(machineToUpdate);
        machines.splice(machines.indexOf(machineToUpdate), 1, machine);
        this.machinesSubject.next(machines);
      }));
  }

  add(machine: OmnisMachine) {
    return this.http.post<any>(`${environment.omnisApiUrl}/machine`, machine, this.httpOptions)
      .pipe(tap(machine => {
        const machines = this.machinesValue;
        machines.push(machine);
        this.machinesSubject.next(machines);
      }));
  }

  delete(machine: OmnisMachine | number) {
    const id = typeof machine === 'number' ? machine : machine.id;
    return this.http.delete<any>(`${environment.omnisApiUrl}/machine/${id}`, this.httpOptions)
      .pipe(tap(_ => {
        const machines = this.machinesValue;
        const machineToDelete = machines.find(m => m.id === id);
        machines.splice(machines.indexOf(machineToDelete), 1);
        this.machinesSubject.next(machines);
      }));
  }
}
