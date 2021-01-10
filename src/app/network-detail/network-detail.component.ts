import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OmnisNetwork } from '@app/models';
import { AlertService, NetworkService } from '@app/services';

@Component({
  selector: 'app-network-detail',
  templateUrl: './network-detail.component.html',
  styleUrls: ['./network-detail.component.scss']
})
export class NetworkDetailComponent implements OnInit {
  @Input() network: OmnisNetwork;
  form: FormGroup;

  loading = false;
  loading2 = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private networkService: NetworkService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.network !== undefined){
      this.form = this.formBuilder.group({
        id: ['', Validators.nullValidator],
        name: ['', Validators.nullValidator],
        ipv4: ['', Validators.required],
        ipv4Mask: ['', Validators.nullValidator],
        isDmz: ['', Validators.nullValidator],
        hasWifi: ['', Validators.nullValidator],
        perimeterId: ['', Validators.nullValidator]
      });

      this.form.patchValue(this.network);
    }
  }

  get f() { return this.form.controls; }

  onSave() {
    if (this.network !== undefined){
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
        return;
      }

      this.loading = true;
      //Subscription to the machine update function observable
      this.networkService.update(this.form.value)
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
    if (this.network !== undefined){
      // reset alerts on submit
      this.alertService.clear();

      this.loading2 = true;
      //Subscription to the machine delete function observable
      this.networkService.delete(this.network.id)
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
