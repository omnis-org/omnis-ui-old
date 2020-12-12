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
      id: [this.machine.id, Validators.nullValidator],
      hostname: [this.machine.hostname, Validators.nullValidator],
      label: [this.machine.label, Validators.required],
      description: [this.machine.description, Validators.nullValidator],
      is_virtualized: [this.machine.is_virtualized, Validators.nullValidator],
      serial_number: [this.machine.serial_number, Validators.nullValidator],
      perimeter_id: [this.machine.perimeter_id, Validators.nullValidator],
      location_id: [this.machine.location_id, Validators.nullValidator],
      operating_system_id: [this.machine.operating_system_id, Validators.nullValidator],
      machine_type_id: [this.machine.machine_type_id, Validators.nullValidator],
      omnis_version: [this.machine.omnis_version, Validators.nullValidator]
    });
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
