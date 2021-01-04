import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { MachineService, AlertService, AccountService } from '@app/services';

@Component({ templateUrl: 'list-pending-machines.component.html' })
export class ListPendingMachinesComponent implements OnInit {
    pendingMachines = null;

    constructor(public accountService: AccountService, private machineService: MachineService, private alertService: AlertService) { }

    ngOnInit() {
        // only with activated when implemented
        this.machineService.getPendingMachines()
            .pipe(first())
            .subscribe(pendingMachines => this.pendingMachines = pendingMachines);
    }

    authorizeMachine(id: string) {
        const machine = this.pendingMachines.find(x => x.id === id);
        machine.isAuthorize = true;
        this.machineService.authorize(id)
            .subscribe({
                next: () => {
                    this.pendingMachines = this.pendingMachines.filter(x => x.id !== id);
                    this.alertService.success('Authorized successful');
                    machine.isAuthorize = false;
                },
                error: error => {
                    this.alertService.error(error);
                    machine.isAuthorize = false;
                }
            });
    }

    unauthorizeMachine(id: string) {
        const machine = this.pendingMachines.find(x => x.id === id);
        machine.isUnauthorize = true;
        this.machineService.unauthorize(id)
            .subscribe({
                next: () => {
                    this.pendingMachines = this.pendingMachines.filter(x => x.id !== id);
                    this.alertService.success('Unauthorized successful');
                    machine.isUnauthorize = false;
                },
                error: error => {
                    this.alertService.error(error);
                    machine.isUnauthorize = false;
                }
            });
    }
}
