import { Component, OnInit } from '@angular/core';
import { Machine } from '../objects/machine';
import { MachinesService } from '../machines.service';
import { LogService} from '../log.service';

@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.css']
})

export class InventaireComponent implements OnInit {
  machines: Machine[];
  private selectedMachine;
  constructor(private machinesService: MachinesService, private logService: LogService) { }

  ngOnInit(): void {
    this.getMachines();
  }
  getMachines(): void {
    this.machinesService.getMachines()
    .subscribe(machines => this.machines = machines);
  }
  onSelect(machine: Machine): void {
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
