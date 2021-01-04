import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, RoleService } from '@app/services';

@Component({ templateUrl: 'add-edit-role.component.html' })
export class AddEditRoleComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    external: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private roleService: RoleService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params.id;
        this.isAddMode = !this.id;


        this.form = this.formBuilder.group({
            id: [this.id],
            name: ['', Validators.required],
            omnisPermissions: [0],
            rolesPermissions: [0],
            usersPermissions: [0],
            pendingMachinesPermissions: [0],
        });

        if (!this.isAddMode) {
            this.roleService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createRole();
        } else {
            this.updateRole();
        }
    }

    private createRole() {
        this.roleService.insert(this.form.value)
            .subscribe({
                next: () => {
                    this.alertService.success('Role added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateRole() {
        this.roleService.update(this.form.value)
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
