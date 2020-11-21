import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { PassThrough } from 'stream';

@Component({
  selector: 'app-vis-carto',
  templateUrl: './vis-carto.component.html',
  styleUrls: ['./vis-carto.component.css']
})

export class VisCartoComponent implements AfterViewInit {
  @ViewChild('network') nwEl: ElementRef;
  private network: any;

  constructor() { }

  ngAfterViewInit() {
    const container = this.nwEl.nativeElement;

    const data = this.init_dataset();
    const options = this.init_options();

    this.draw(container, data, options);
  }

  /**
   * TEMPORARY FUNCTION
   */
  init_dataset() {
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
  }

  /**
   * Initialize vis-network options
   */
  init_options() {
    return {
      physics: false,
      locale: 'fr',
      interaction: { hover: true },
      manipulation: {
        enabled: false,
      },
      nodes: {
        shape: "dot",
        size: 20,
        color: "#5e5e5e",
      },
      edges: {},
      layout: {
        hierarchical: {
          direction: "DU",
          sortMethod: "directed",
        },
      },
      groups: {
        client_linux: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            weight: "900",
            code: "\uf109",
            size: 50,
            color: "#5e5e5e",
          }
        },
        router: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            weight: "900",
            code: "\uf233",
            size: 50,
            color: "#5e5e5e",
          }
        }
      }
    };
  }

  /**
   * Initialize Network events
   */
  init_events() {
    var data = this.network.body.data;

    /**
     * When double click
     */
    this.network.on("doubleClick", function (params) {
      var nodes_len = params.nodes.length;
      var edges_len = params.edges.length;

      /**
       * If double click on blank -> create a node
       */
      if (nodes_len == 0 && edges_len == 0) {
        var coord = params.pointer.canvas
        var node = { label: prompt("Label ?"), x: coord.x, y: coord.y };
        data.nodes.add(node);
      }
    });
  }

  /**
   * Draws the cartography.
   * @param container vis-network emplacement
   * @param data vis-network nodes and edges
   * @param options vis-network options
   */
  draw(container: any, data: object, options: object) {
    this.network = new Network(container, data, options);
    this.init_events();
  }
}
