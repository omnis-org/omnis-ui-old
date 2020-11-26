import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
// import { faLaptop, faServer } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vis-carto',
  templateUrl: './vis-carto.component.html',
  styleUrls: ['./vis-carto.component.css']
})

export class VisCartoComponent implements AfterViewInit {
  @ViewChild('network') nwEl: ElementRef;
  private network: any;

  ngAfterViewInit() {
    this.network = new Network(
      this.nwEl.nativeElement,
      this.initDataset(),
      this.initOptions()
    );

    this.initEvents();
  }

  /**
   * TEMPORARY FUNCTION
   */
  initDataset() {
    const nodes = new DataSet<any>([
      { id: 1, label: 'client', group: 'client', title: 'MAC: aa:aa:aa:aa:aa:aa' },
      { id: 2, label: 'client', group: 'client' },
      { id: 3, label: 'client', group: 'client' },
      { id: 4, label: 'client' },
      { id: 5, label: 'router', group: 'router' },
      { id: 6, label: 'client', group: 'client' },
      { id: 7, label: 'client', group: 'client' },
      { id: 8, label: 'router', group: 'router' },
    ]);

    const edges = new DataSet<any>([
      { from: 1, to: 5 },
      { from: 2, to: 5 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
      { from: 6, to: 8 },
      { from: 7, to: 8 },
    ]);

    return { nodes, edges };
  }
  /*init_dataset() {
    const nodes = new DataSet<any>([
      { id: 1, label: "client", group: "client_linux", title: "MAC: aa:aa:aa:aa:aa:aa" },
      { id: 2, label: "client", group: "client_linux" },
      { id: 3, label: "client", group: "client_linux" },
      { id: 4, label: "client" },
      { id: 5, label: "router", group: "router" },
      { id: 6, label: "client", group: "client_linux" },
      { id: 7, label: "client", group: "client_linux" },
      { id: 8, label: "router", group: "router" },
    ]);

    const edges = new DataSet<any>([
      { from: 1, to: 5 },
      { from: 2, to: 5 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
      { from: 6, to: 8 },
      { from: 7, to: 8 },
    ]);

    return { nodes, edges };
  }*/
  /**
   * Initialize vis-network options
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
      nodes: this.getNodeData(input_data),
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
  getNodeData(data: any) {
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
}
