import { Component, OnInit } from '@angular/core';
import { OmnisMachine } from '@app/models';
import { MachineService } from '@app/services';

@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.scss']
})

export class InventaireComponent implements OnInit {
  machines: OmnisMachine[];
  constructor(private machinesService: MachineService) { }

  ngOnInit(): void {
    //Subscription to the machines object observable
    this.machinesService.machines.subscribe(machines => this.machines = machines);
  }
}
