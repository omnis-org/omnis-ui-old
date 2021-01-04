import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/services';

@Component({ templateUrl: 'list-users.component.html' })
export class ListUsersComponent implements OnInit {
    users = null;

    constructor(public accountService: AccountService, private alertService: AlertService) { }

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .subscribe({
                next: () => {
                    this.users = this.users.filter(x => x.id !== id);
                    this.alertService.success('Delete successful');
                    user.isDeleting = false;
                },
                error: error => {
                    this.alertService.error(error);
                    user.isDeleting = false;
                }
            });
    }
}
