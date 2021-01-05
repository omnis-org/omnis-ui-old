import { Injectable } from '@angular/core';
import { OmnisNotification } from '@app/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notifications: Observable<OmnisNotification[]>;
  private notificationsSubject: BehaviorSubject<OmnisNotification[]>;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    responseType: 'text/plain' as 'json'
  };

  constructor(private http: HttpClient) {
    this.notificationsSubject = new BehaviorSubject<OmnisNotification[]>(null);
    this.notifications = this.notificationsSubject.asObservable();
    this.getAll().subscribe();
  }

  public get notificationsValue(): OmnisNotification[] {
    return this.notificationsSubject.value;
  }

  getAll() {
    return this.http.get<OmnisNotification[]>(`${environment.omnisApiUrl}/notifications`)
      .pipe(tap((notifications) => {
        this.notificationsSubject.next(notifications);
        return notifications;
      })
      );
  }

  getAllByType(type: string) {
    return this.http.get<OmnisNotification[]>(`${environment.omnisApiUrl}/${type}/notifications`)
      .pipe(tap((notifications) => {
        this.notificationsSubject.next(notifications);
        return notifications;
      })
      );
  }

  getById(type: string, id: number) {
    return this.http.get<OmnisNotification>(`${environment.omnisApiUrl}/${type}/notification/${id}`);
  }

  update(notification: OmnisNotification) {
    return this.http.put<any>(
      `${environment.omnisApiUrl}/${notification.type}/notification/${notification.id}`, notification, this.httpOptions
      ).pipe(tap(_ => {
        const notifications = this.notificationsValue;
        const notificationToUpdate = notifications.find(m => m.id === notification.id);
        const i = notifications.indexOf(notificationToUpdate);
        notifications.splice(notifications.indexOf(notificationToUpdate), 1, notification);
        this.notificationsSubject.next(notifications);
      }));
  }

  insert(notification: OmnisNotification) {
    return this.http.post<any>(`${environment.omnisApiUrl}/${notification.type}/notification`, notification, this.httpOptions)
      .pipe(tap(notification => {
        const notifications = this.notificationsValue;
        notifications.push(notification);
        this.notificationsSubject.next(notifications);
      }));
  }

  delete(type: string, id: string | number) {
    return this.http.delete<any>(`${environment.omnisApiUrl}/${type}/notification/${id}`, this.httpOptions)
      .pipe(tap(_ => {
        const notifications = this.notificationsValue;
        const notificationToDelete = notifications.find(m => m.id === id);
        notifications.splice(notifications.indexOf(notificationToDelete), 1);
        this.notificationsSubject.next(notifications);
      }));
  }
}
