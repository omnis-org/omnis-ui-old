import { Component } from '@angular/core';

import { AccountService } from '@app/services';
import { User } from '@app/models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
  title = 'omnis-ui';
  user: User;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  get isAdmin() {
    return this.user && this.user.admin;
  }


  logout() {
    this.accountService.logout();
  }
}
