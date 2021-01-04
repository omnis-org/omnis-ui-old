import { Component } from '@angular/core';

import { AccountService } from '@app/services';
import { User } from '@app/models';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'omnis-ui';
  user: User;

  constructor(public accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  logout() {
    this.accountService.logout();
  }
}
