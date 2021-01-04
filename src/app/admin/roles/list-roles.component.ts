import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { RoleService, AlertService, AccountService } from '@app/services';

@Component({
    templateUrl: 'list-roles.component.html',
    styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {
    roles = null;

    constructor(public accountService: AccountService,
        private roleService: RoleService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.roleService.getAll().subscribe(roles => this.roles = roles);
    }

    deleteRole(id: string) {
        const user = this.roles.find(x => x.id === id);
        user.isDeleting = true;
        this.roleService.delete(id)
            .subscribe({
                next: () => {
                    this.roles = this.roles.filter(x => x.id !== id);
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
