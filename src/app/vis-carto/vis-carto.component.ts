import { Component, ElementRef, AfterViewInit, ViewChild, Type } from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { OmnisInterface, OmnisMachine, OmnisNetwork } from '@app/models';
import { MachineService, NetworkService, InterfaceService } from '@app/services';
// import { faLaptop, faServer } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vis-carto',
  templateUrl: './vis-carto.component.html',
  styleUrls: ['./vis-carto.component.css']
})

export class VisCartoComponent implements AfterViewInit {
  @ViewChild('network') nwEl: ElementRef;
  //the detailed object
  object: OmnisMachine|OmnisNetwork;
  //a local instance of machines
  machines: OmnisMachine[];
  networks: OmnisNetwork[];
  typeOfSelectedObject: any;
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
    /**
     * When click
     */
    this.network.on('click', (params) => {
      if (typeof params.nodes != undefined && params.nodes.length === 1){
        const objectRawID = params.nodes[0];
        const objectType = this.visidToType(objectRawID);
        const objectID = this.visidToId(objectRawID);
        //define selected type to show proper edit/detail menu
        this.typeOfSelectedObject = objectType;
        if(objectType === 'client'){
          this.object = this.machines.find(m => m.id === objectID);
        }else if(objectType === 'network'){
          this.object = this.networks.find(n => n.id === objectID);
        }
      }
      /**
       * If double click on blank -> create a node
       */
    });
    this.network.on('doubleClick', (params) => {
      const nodesLen = params.nodes.length;
      const edgesLen = params.edges.length;

      /**
       * If double click on blank -> create a node
       */
      if (nodesLen === 0 && edgesLen === 0) {
        const coord = params.pointer.canvas;
        const node = { label: prompt('Label ?'), x: coord.x, y: coord.y };
        this.getNetworkNodes().add(node);
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

    this.machineService.machines.subscribe(machines => {this.updateNodes(machines, 'client'); this.machines = machines;});
    this.networkService.networks.subscribe(networks => {this.updateNodes(networks, 'network'); this.networks = networks;});
    this.interfaceService.interfaces.subscribe(interfaces => this.updateEdges(interfaces));
  }

  updateNodes(data: any[], type: string): void {
    if (data == null) { return; };

    const nodesCurr = this.getNetworkNodes();
    const nodesCurrIds = nodesCurr.getIds();
    const nodesCurrIdsFiltered = nodesCurrIds.filter((id: string) => this.visidToType(id) === type);

    // compute new nodes ids
    const nodesNewIds = [];
    data.forEach((item: any) => {
      nodesNewIds.push(
        this.idToVisid(item.id, type)
      );
    });

    // remove nodes that no longer exist
    const nodesToDel = nodesCurrIdsFiltered.filter(item => nodesNewIds.indexOf(item) < 0);
    nodesCurr.remove(nodesToDel);

    // add/modify new/existants nodes from current type
    const nodesNew = [];
    data.forEach((item: any) => {
      // compute label
      let label: string;
      if (item.label) {
        label = item.label;
      } else if (item.name) {
        label = item.name;
      }

      nodesNew.push({
        group: type,
        id: this.idToVisid(item.id, type),
        label,
      });
    });

    nodesCurr.update(nodesNew);
    this.network.setData({ nodes: nodesCurr, edges: this.getNetworkEdges() });
  }

  updateEdges(interfaces: OmnisInterface[]): void {
    if (interfaces == null) { return; };
    const networkEdges = [];

    interfaces.forEach((interf: OmnisInterface) => {
      networkEdges.push({
        from: this.idToVisid(interf.machineId, 'client'),
        to: this.idToVisid(interf.networkId, 'network')
      });
    });

    const dataset = new DataSet<any>(networkEdges);;
    this.network.setData({ nodes: this.getNetworkNodes(), edges: dataset });
  }

  /**
   * Export data as JSON
   *
   * @returns For each node : ID + label + connections to
   */
  export() {
    const nodes = this.getNetworkNodes();
    const nodesNew = {};

    nodes.getIds().forEach((id: string) => {
      const node = nodes.get(id);
      nodesNew[id] = {};
      nodesNew[id].label = node.label;
      nodesNew[id].to = this.network.getConnectedNodes(id, 'to');
    });

    return JSON.stringify(nodesNew, undefined, 2);
  }

  /**
   * Import data from JSON
   *
   * @param rawJson Exported JSON network data
   */
  import(rawJson: string) {
    const inputData = JSON.parse(rawJson);

    const data = {
      nodes: this.getNodeDataObs(inputData),
      edges: this.getEdgeData(inputData),
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
    const networkNodes = [];

    for (const id in data) {
      if (Object.prototype.hasOwnProperty.call(data, id)) {
        networkNodes.push({
          id,
          label: data[id].label
        });
      }
    }

    return new DataSet<any>(networkNodes);
  }

  /**
   * Retrieve edges information from imported data
   *
   * @param data Imported data
   * @returns Edges dataset
   */
  getEdgeData(data: any) {
    const networkEdges = [];

    for (const id in data) {
      if (Object.prototype.hasOwnProperty.call(data, id)) {
        data[id].to.forEach((connId: string) => networkEdges.push({ from: id, to: connId }));
      }
    }

    return new DataSet<any>(networkEdges);
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

  private idToVisid(id: number, type: string): string {
    return type.concat('_' + id.toString());
  }

  private visidToId(visid: string): number {
    return +visid.split('_')[1];
  }

  private visidToType(visid: string): string {
    return visid.split('_')[0];
  }

  private getNetworkNodes(): DataSet<any> {
    return this.network.body.data.nodes;
  }

  private getNetworkEdges(): DataSet<any> {
    return this.network.body.data.edges;
  }
}
