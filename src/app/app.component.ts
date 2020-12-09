import { Component } from '@angular/core';

import { AccountService } from '@app/services';
import { User } from '@app/models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  title = 'omnis-ui';
  user: User;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  logout() {
    this.accountService.logout();
  }
}