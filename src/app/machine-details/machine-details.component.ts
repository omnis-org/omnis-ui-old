import { Component, OnInit, Input } from '@angular/core';
import { OmnisMachine } from '../objects/machine';
import { MachinesService } from '../services/machines.service';
import { FormGroup, FormControl } from '@angular/forms';
import { LogService} from '../services/log.service';

@Component({
  selector: 'app-machine-details',
  templateUrl: './machine-details.component.html',
  styleUrls: ['./machine-details.component.css']
})
export class MachineDetailsComponent implements OnInit {
  @Input()
    machine: OmnisMachine;
  detailsForm = new FormGroup({
    label: new FormControl(''),
    description: new FormControl(''),
    is_virtualized: new FormControl('')
  });
  public virtualization_options = [true, false];
  constructor(private machinesService: MachinesService, private logService: LogService) { }

  ngOnInit(): void {
    if(this.machine !== undefined){
      this.updateFormData();
    }else{
      this.logService.add(`machine-details: Error while loading machines`);
    }
  }

  updateFormData(){
    this.detailsForm.patchValue({
      label: this.machine.label,
      description: this.machine.description,
      is_virtualized : this.machine.is_virtualized
    });
  }
  onRegister(){
    if(this.machine !== undefined){
      this.machine.label = this.detailsForm.get('label').value;
      this.machine.description = this.detailsForm.get('description').value;
      this.machine.is_virtualized = (this.detailsForm.get('is_virtualized').value === true);
      this.machinesService.updateMachine(this.machine).subscribe();
    }else{
      this.logService.add(`machine-details: Error while loading machines`);
    }
  }

}
