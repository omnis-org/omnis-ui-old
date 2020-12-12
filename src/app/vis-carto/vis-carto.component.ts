import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { OmnisInterface } from '@app/models';
import { MachineService, NetworkService, InterfaceService } from '@app/services';
// import { faLaptop, faServer } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vis-carto',
  templateUrl: './vis-carto.component.html',
  styleUrls: ['./vis-carto.component.css']
})

export class VisCartoComponent implements AfterViewInit {
  @ViewChild('network') nwEl: ElementRef;
  private network: any;

  constructor(
    private machineService: MachineService,
    private networkService: NetworkService,
    private interfaceService: InterfaceService,
  ) { }

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
    this.updateNodes(this.machineService.machinesValue, 'client');
    this.updateEdges(this.interfaceService.interfacesValue);
    this.updateNodes(this.networkService.networksValue, 'network');

    this.machineService.machines.subscribe(machines => this.updateNodes(machines, 'client'));
    this.networkService.networks.subscribe(networks => this.updateNodes(networks, 'network'));
    this.interfaceService.interfaces.subscribe(interfaces => this.updateEdges(interfaces));
  }

  updateNodes(data: any[], type: string): void {
    if (data == null) { return; };

    const nodes_curr = this.network.body.data.nodes;
    const nodes_curr_ids = nodes_curr.getIds();
    const nodes_curr_ids_filtered = nodes_curr_ids.filter(id => this.visid_to_type(id) === type);

    // compute new nodes ids
    const nodes_new_ids = [];
    data.forEach((item: any) => {
      nodes_new_ids.push(
        this.id_to_visid(item.id, type)
      );
    });

    // remove nodes that no longer exist
    const nodes_to_del = nodes_curr_ids_filtered.filter(item => nodes_new_ids.indexOf(item) < 0);
    nodes_curr.remove(nodes_to_del);

    // add/modify new/existants nodes from current type
    const nodes_new = [];
    data.forEach((item: any) => {
      // compute label
      let label: string;
      if (item.label) {
        label = item.label;
      } else if (item.name) {
        label = item.name;
      }

      nodes_new.push({
        group: type,
        id: this.id_to_visid(item.id, type),
        label,
      });
    });

    nodes_curr.update(nodes_new);
    this.network.setData({ nodes: nodes_curr, edges: this.network.body.data.edges });
  }

  updateEdges(interfaces: OmnisInterface[]): void {
    if (interfaces == null) { return; };
    const network_edges = [];

    interfaces.forEach((interf: OmnisInterface) => {
      network_edges.push({
        from: this.id_to_visid(interf.machine_id, 'client'),
        to: this.id_to_visid(interf.network_id, 'network')
      });
    });

    const dataset = new DataSet<any>(network_edges);;
    this.network.setData({ nodes: this.network.body.data.nodes, edges: dataset });
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
        network: {
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

  private id_to_visid(id: number, type: string): string {
    return type.concat('_' + id.toString());
  }

  private visid_to_id(visid: string): number {
    return +visid.split('_')[1];
  }

  private visid_to_type(visid: string): string {
    return visid.split('_')[0];
  }
}
