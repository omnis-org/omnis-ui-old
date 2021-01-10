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
    //when the class is first called, fetch all data from api
    this.getAll().subscribe();
  }

  public get machinesValue(): OmnisMachine[] {
    return this.machinesSubject.value;
  }

  getAll() {
    //get all obects from api
    return this.http.get<OmnisMachine[]>(`${environment.omnisApiUrl}/machines`)
      .pipe(tap((machines) => {
        /*update behaviorSubject object everytime the getAll function is called,
         this is what makes the real time update work*/
        this.machinesSubject.next(machines);
        return machines;
      })
      );
  }

  getById(id: number) {
    return this.http.get<OmnisMachine>(`${environment.omnisApiUrl}/machine/${id}`);
  }

  update(machine: OmnisMachine) {
    //update database entries using rest api
    return this.http.put<any>(`${environment.omnisApiUrl}/machine/${machine.id}`, machine, this.httpOptions)
      .pipe(tap(_ => {
        //get current local array state
        const machines = this.machinesValue;
        //find object to update
        const machineToUpdate = machines.find(m => m.id === machine.id);
        const i = machines.indexOf(machineToUpdate);
        //update the local array
        machines.splice(machines.indexOf(machineToUpdate), 1, machine);
        //update behaviorSubject object
        this.machinesSubject.next(machines);
      }));
  }

  insert(machine: OmnisMachine) {
    //insert new entry in database using rest api
    return this.http.post<any>(`${environment.omnisApiUrl}/machine`, machine, this.httpOptions)
      .pipe(tap(machine => {
        //get current local array state
        const machines = this.machinesValue;
        //update the local array
        machines.push(machine);
        //update behaviorSubject object
        this.machinesSubject.next(machines);
      }));
  }

  delete(id: string | number) {
    //delete entry in database using rest api
    return this.http.delete<any>(`${environment.omnisApiUrl}/machine/${id}`, this.httpOptions)
      .pipe(tap(_ => {
        //get current local array state
        const machines = this.machinesValue;
        //find object to delete
        const machineToDelete = machines.find(m => m.id === id);
        //delete object
        machines.splice(machines.indexOf(machineToDelete), 1);
        //update behaviorSubject object
        this.machinesSubject.next(machines);
      }));
  }


  // ADMIN

  getPendingMachines() {
    return this.http.get<OmnisMachine[]>(`${environment.adminUrl}/pending_machines/`);
  }

  authorize(id: string | number) {
    return this.http.put<any>(`${environment.adminUrl}/pending_machine/${id}/authorize`, null, this.httpOptions);
  }

  unauthorize(id: string | number) {
    return this.http.put<any>(`${environment.adminUrl}/pending_machine/${id}/unauthorize`, null, this.httpOptions);
  }

}
