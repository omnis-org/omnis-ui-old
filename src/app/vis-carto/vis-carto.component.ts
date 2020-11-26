import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Machine } from '../objects/machine';
import { MachinesService } from '../machines.service';
// import { faLaptop, faServer } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vis-carto',
  templateUrl: './vis-carto.component.html',
  styleUrls: ['./vis-carto.component.css']
})

export class VisCartoComponent implements AfterViewInit {
  @ViewChild('network') nwEl: ElementRef;
  private network: any;

  constructor(private machinesService: MachinesService) { }

  ngAfterViewInit(): void {
    this.network = new Network(
      this.nwEl.nativeElement,
      null,
      this.initOptions()
    );

    this.initEvents();
    this.subscribe();
  }

  /**
   * Initialize Network events
   */
  initEvents() {
    const data = this.network.body.data;

    /**
     * When double click
     */
    this.network.on('doubleClick', (params) => {
      const nodes_len = params.nodes.length;
      const edges_len = params.edges.length;

      /**
       * If double click on blank -> create a node
       */
      if (nodes_len === 0 && edges_len === 0) {
        const coord = params.pointer.canvas;
        const node = { label: prompt('Label ?'), x: coord.x, y: coord.y };
        data.nodes.add(node);
      }
    });
  }

  /**
   * Subscribe to data services
   */
  subscribe(): void {
    this.machinesService.getMachines().subscribe(machines => this.updateMachines(machines));
  }

  updateMachines(machines: Machine[]): void {
    console.log(machines);
    const data = {
      nodes: this.getNodeData(machines),
      edges: new DataSet<any>([]),
    };

    this.network.setData(data);
  }

  getNodeData(machines: Machine[]) {
    const network_nodes = [];

    machines.forEach((machine: Machine) => {
      network_nodes.push({
        id: machine.id,
        label: machine.label
      });
    });

    return new DataSet<any>(network_nodes);
  }

  /**
   * Export data as JSON
   *
   * @returns For each node : ID + label + connections to
   */
  export() {
    const nodes = this.network.body.data.nodes;
    const nodes_new = {};

    nodes.getIds().forEach((id: string) => {
      const node = nodes.get(id);
      nodes_new[id] = {};
      nodes_new[id].label = node.label;
      nodes_new[id].to = this.network.getConnectedNodes(id, 'to');
    });

    return JSON.stringify(nodes_new, undefined, 2);
  }

  /**
   * Import data from JSON
   *
   * @param rawJson Exported JSON network data
   */
  import(rawJson: string) {
    const input_data = JSON.parse(rawJson);

    const data = {
      nodes: this.getNodeDataObs(input_data),
      edges: this.getEdgeData(input_data),
    };

    this.network.setData(data);
  }

  /**
   * Retrieve nodes information from imported data
   *
   * @param data Imported data
   * @returns Nodes dataset
   */
  getNodeDataObs(data: any) {
    const network_nodes = [];

    for (const id in data) {
      if (Object.prototype.hasOwnProperty.call(data, id)) {
        network_nodes.push({
          id,
          label: data[id].label
        });
      }
    }

    return new DataSet<any>(network_nodes);
  }

  /**
   * Retrieve edges information from imported data
   *
   * @param data Imported data
   * @returns Edges dataset
   */
  getEdgeData(data: any) {
    const network_edges = [];

    for (const id in data) {
      if (Object.prototype.hasOwnProperty.call(data, id)) {
        data[id].to.forEach((connId: string) => network_edges.push({ from: id, to: connId }));
      }
    }

    return new DataSet<any>(network_edges);
  }

  /**
   * Initialize vis-network options
   * TODO: need to be a service with local storage
   */
  initOptions() {
    return {
      physics: false,
      locale: 'fr',
      interaction: { hover: true },
      manipulation: {
        enabled: false,
      },
      nodes: {
        shape: 'dot',
        size: 20,
        color: '#5e5e5e',
      },
      edges: {},
      layout: {
        hierarchical: {
          direction: 'DU',
          sortMethod: 'directed',
        },
      },
      groups: {
        client: {
          shape: 'icon',
          icon: {
            face: '\'Font Awesome 5 Free\'',
            weight: '900',
            code: '\uf109',
            size: 50,
            color: '#5e5e5e',
          }
        },
        router: {
          shape: 'icon',
          icon: {
            face: '\'Font Awesome 5 Free\'',
            weight: '900',
            code: '\uf233',
            size: 50,
            color: '#5e5e5e',
          }
        }
      }
    };
  }
}
