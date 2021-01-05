import { Component, OnInit } from '@angular/core';
import { OmnisNotification } from '@app/models';
import { NotificationService } from '@app/services';

@Component({
  selector: 'app-notifs',
  templateUrl: './notifs.component.html',
  styleUrls: ['./notifs.component.scss']
})

export class NotifsComponent implements OnInit {
  notifications: OmnisNotification[];

  constructor(private notificationsService: NotificationService) { }

  ngOnInit(): void {
    this.notifications = this.notificationsService.notificationsValue;
    this.notificationsService.notifications.subscribe(notifications => this.notifications = notifications);
  }
}
