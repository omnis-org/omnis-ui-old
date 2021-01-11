import { Injectable } from '@angular/core';
import { OmnisGateway } from '@app/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  public gateways: Observable<OmnisGateway[]>;
  private gatewaysSubject: BehaviorSubject<OmnisGateway[]>;
  private refreshTimeout;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.gatewaysSubject = new BehaviorSubject<OmnisGateway[]>(null);
    this.gateways = this.gatewaysSubject.asObservable();
    // when the class is first called, fetch all data from api
    this.getAll().subscribe();
  }

  public get gatewaysValue(): OmnisGateway[] {
    return this.gatewaysSubject.value;
  }

  getAll() {
    // get all obects from api
    return this.http.get<OmnisGateway[]>(`${environment.omnisApiUrl}/gateways`)
      .pipe(tap((gateways) => {
        // update behaviorSubject object everytime the getAll function is called,
        // this is what makes the real time update work
        this.refreshTimer();
        this.gatewaysSubject.next(gateways);
        return gateways;
      })
      );
  }

  getById(id: number) {
    return this.http.get<OmnisGateway>(`${environment.omnisApiUrl}/gateway/${id}`);
  }

  update(gtw: OmnisGateway) {
    // update database entries using rest api
    return this.http.patch(`${environment.omnisApiUrl}/gateway/${gtw.id}`, gtw)
      .pipe(tap(_ => {
        const gateways = this.gatewaysValue; // get current local array state
        const gatewayToUpdate = gateways.find(m => m.id === gtw.id); // find object to update
        const i = gateways.indexOf(gatewayToUpdate);
        gateways.splice(gateways.indexOf(gatewayToUpdate), 1, gtw); // update the local array
        this.gatewaysSubject.next(gateways); // update behaviorSubject object
      }));
  }

  insert(gtw: OmnisGateway) {
    // insert new entry in database using rest api
    return this.http.post<OmnisGateway>(`${environment.omnisApiUrl}/gateway`, gtw)
      .pipe(tap(gtw => {
        const gateways = this.gatewaysValue; // get current local array state
        gateways.push(gtw); // update the local array
        this.gatewaysSubject.next(gateways); // update behaviorSubject object
      }));
  }

  delete(id: string | number) {
    // delete entry in database using rest api
    return this.http.delete(`${environment.omnisApiUrl}/gateway/${id}`)
      .pipe(tap(_ => {
        const gateways = this.gatewaysValue; // get current local array state
        const gatewayToDelete = gateways.find(m => m.id === id); // find object to delete
        gateways.splice(gateways.indexOf(gatewayToDelete), 1); // delete object
        this.gatewaysSubject.next(gateways); // update behaviorSubject object
      }));
  }

  private refreshTimer() {
    this.refreshTimeout = setTimeout(() => this.getAll().subscribe(), environment.refreshDataTimeout);
  }
}
