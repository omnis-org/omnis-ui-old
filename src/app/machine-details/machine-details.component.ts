import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { MachineService, AlertService, AccountService } from '@app/services';
import { OmnisMachine } from '@app/models';

@Component({
  selector: 'app-machine-details',
  templateUrl: 'machine-details.component.html',
  styleUrls: ['./machine-details.component.scss']
})
export class MachineDetailsComponent implements OnInit {
  //A OmnisMachine object must be given to the class
  @Input() machine: OmnisMachine;
  form: FormGroup;

  loading = false;
  loading2 = false;
  submitted = false;

  constructor(
    public accountService: AccountService,
    private formBuilder: FormBuilder,
    private machineService: MachineService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.machine !== undefined){
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
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSave() {
    if (this.machine !== undefined){
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
        return;
      }

      this.loading = true;
      //Subscription to the machine update function observable
      this.machineService.update(this.form.value)
      .subscribe({
        //when a new value is updated in the observable object, the alertService displays an alert
        next: () => {
          this.alertService.success('Modification successful');
          this.loading = false;
        },
        //if anithing goes wrong, an error alert is displayed
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
    }
  }


  onDelete() {
    if (this.machine !== undefined){
      // reset alerts on submit
      this.alertService.clear();

      this.loading2 = true;
      //Subscription to the machine delete function observable
      this.machineService.delete(this.machine.id)
      .subscribe({
        //when a new value is deleted in the observable object, the alertService displays an alert
        next: () => {
          this.alertService.success('Delete successful');
          this.loading2 = false;
        },
        //if anithing goes wrong, an error alert is displayed
        error: error => {
          this.alertService.error(error);
          this.loading2 = false;
        }
      });
    }
  }
}
