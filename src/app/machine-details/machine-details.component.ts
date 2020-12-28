import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { MachineService, AlertService } from '@app/services';
import { OmnisMachine } from '@app/models';

@Component({
  selector: 'app-machine-details',
  templateUrl: 'machine-details.component.html',
  styleUrls: ['./machine-details.component.scss']
})
export class MachineDetailsComponent implements OnInit {
  @Input() machine: OmnisMachine;
  form: FormGroup;
  loading = false;
  loading2 = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private machineService: MachineService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: ['', Validators.nullValidator],
      hostname: ['', Validators.nullValidator],
      label: ['', Validators.required],
      description: ['', Validators.nullValidator],
      virtualizationSystem: ['', Validators.nullValidator],
      serialNumber: ['', Validators.nullValidator],
      perimeterId: ['', Validators.nullValidator],
      locationId: ['', Validators.nullValidator],
      operatingSystemId: ['', Validators.nullValidator],
      machineType: ['', Validators.nullValidator],
      omnisVersion: ['', Validators.nullValidator]
    });

    this.form.patchValue(this.machine);
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSave() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.machineService.update(this.form.value)
      .subscribe({
        next: () => {
          this.alertService.success('Modification successful');
          this.loading = false;
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }


  onDelete() {
    // reset alerts on submit
    this.alertService.clear();

    this.loading2 = true;
    this.machineService.delete(this.machine.id)
      .subscribe({
        next: () => {
          this.alertService.success('Delete successful');
          this.loading2 = false;
        },
        error: error => {
          this.alertService.error(error);
          this.loading2 = false;
        }
      });
  }
}
