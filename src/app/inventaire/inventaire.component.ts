import { Component, OnInit } from '@angular/core';
import { OmnisMachine } from '../objects/machine';
import { MachinesService } from '../services/machines.service';
import { LogService} from '../services/log.service';

@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.css']
})

export class InventaireComponent implements OnInit {
  machines: OmnisMachine[];
  private selectedMachine;
  constructor(private machinesService: MachinesService, private logService: LogService) { }

  ngOnInit(): void {
    this.getMachines();
  }
  getMachines(): void {
    this.machinesService.getMachines()
    .subscribe(machines => this.machines = machines);
  }
  onSelect(machine: OmnisMachine): void {
      this.selectedMachine = machine;
  }
  onDelete(){
    if(this.selectedMachine !== undefined){
      this.machinesService.deleteMachine(this.selectedMachine.id).subscribe();
      this.getMachines();
    }else{
      this.logService.add(`machine-details: Error while loading machines`);
    }
  }
}
