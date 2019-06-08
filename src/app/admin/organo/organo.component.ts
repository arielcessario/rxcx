import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CoreService } from 'ac-core';
import { RxCxProxy } from 'rxcx-core';

export class Organo {
  organo_id: number;
  nombre: string;
  fracciones: IFraccion[];

  constructor(uid = '', organo = '', fracciones?: IFraccion[]) {
    this.nombre = organo;
    this.fracciones = fracciones;
  }
}

export interface IOrgano {
  organo_id: string;
  nombre: string;
  fracciones: IFraccion[];
}

export interface IFraccion {
  cantidad: number;
  constraints: IConstraint[];
}

export interface IConstraint {
  volumen: number;
  constraint: number;
  unidadConstraint: string;
  unidadVolume: string;
}

export interface IUnit {
  nombre: string;
}

@Component({
  selector: 'rxc-organo',
  templateUrl: './organo.component.html',
  styleUrls: ['./organo.component.scss']
})
export class OrganoComponent implements OnInit, OnDestroy {
  organo: any;
  fracciones: Array<any>;
  unidades: Array<any> = [];
  endpoints: Array<any> = [];
  id = '';

  // Referencias
  unidadesRef: any;
  organoRef: any;
  organoSubs: any;
  endpointSubs: any;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private coreService: CoreService,
    private rxcxProxy: RxCxProxy
  ) { }

  ngOnInit() {
    this.rxcxProxy.getEndpoints().subscribe(data => {
      console.log(data);

      this.endpoints = data;
    });
    // this.afs.firestore.settings({ timestampsInSnapshots: true });
    // this.endpointSubs = this.afs
    //   .collection('endpoints')
    //   .snapshotChanges()
    //   .map(e => {
    //     return e.map(a => {
    //       const data = a.payload.doc.data();
    //       data.uid = a.payload.doc.id;
    //       return data;
    //     });
    //   })
    //   .subscribe(e => {
    //     e.map(ee => {
    //       const nombre = Object.getOwnPropertyNames(ee)[0];
    //       ee.nombre = nombre;
    //       return ee;
    //     });
    //     console.log(e);
    //     this.endpoints = e;
    //   });

    // Primero traigo las unidades
    // Después cargo el resto los datos
    this.route.params.subscribe(params => {
      this.id = params.id;
      if (this.id !== '0') {
        this.id = params.id;
        this.rxcxProxy.getOrgano(this.id).subscribe(data => {
          this.organo = {};
          this.fracciones = [];

          this.organo.nombre = data[0].nombre;
          this.organo.organo_id = this.id;

          let organo_fraccion_id = data[0].organo_fraccion_id;
          let constraints = [];
          for (let i = 0; i < data.length; i++) {
            const organo = data[i];
            // Tocar esta parte para que muestre 3 decimales
            constraints.push({
              volumen: Math.round(organo.volumen * 100) / 100,
              constraint: Math.round(organo.constraint * 100) / 100,
              endpoint_id: organo.endpoint_id
            });

            // Si es el último o es distinto del actual, agrego y limpio
            if (
              !data[i + 1] ||
              data[i + 1].organo_fraccion_id !== organo_fraccion_id
            ) {
              if (!this.organo.fracciones) {
                this.organo.fracciones = [];
              }
              this.organo.fracciones.push({
                fraccion: organo.fraccion,
                constraints: constraints
              });
              constraints = [];
              organo_fraccion_id = (data[i + 1]) ? data[i + 1].organo_fraccion_id : -1;
            }
          }

          console.log(this.organo);
        });
      } else {
        this.organo = {};
        this.organo.organo_id = 0;
        this.organo.nombre = '';
        this.organo.fracciones = [];
      }
    });
  }

  getSelectedUnit(uid) {
    for (let z = 0; z < this.unidades.length; z++) {
      if (uid === this.unidades[z].uid) {
        return this.unidades[z].nombre;
      }
      if (uid === this.unidades[z].uid) {
        return this.unidades[z].nombre;
      }
    }
  }

  getSelectedEndpoint(uid) {
    for (let z = 0; z < this.endpoints.length; z++) {
      if (uid === this.endpoints[z].endpoint_id) {
        return this.endpoints[z].nombre;
      }
      if (uid === this.endpoints[z].endpoint_id) {
        return this.endpoints[z].nombre;
      }
    }
  }
  save() {
    if (this.id === '0') {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    console.log(this.organo);
    this.rxcxProxy.createOrgano(this.organo).subscribe(r => {
      this.coreService.setToast({
        type: 'success',
        title: 'Creación',
        body: 'Órgano creado con éxito'
      });
      this.location.go('/organo/' + r);
      this.id = r;
    });
  }

  update() {
    this.rxcxProxy.updateOrgano(this.organo).subscribe(r => {
      this.coreService.setToast({
        type: 'success',
        title: 'Modificación',
        body: 'Órgano modificado con éxito'
      });
    });
  }

  addFraccion() {
    console.log(this.endpoints[0].endpoint_id);

    const constraints = [
      {
        volumen: 0,
        constraint: 0,
        endpoint_id: this.endpoints[0].endpoint_id
      }
    ];

    const fraccion = {
      cantidad: 0,
      constraints: constraints
    };

    this.organo.fracciones.push(fraccion);
  }

  addConstraint(f) {
    f.constraints.push({
      volumen: 0,
      constraint: 0,
      endpoint_id: this.endpoints[0].endpoint_id
    });
  }

  removeConstraint(l, c) {
    if (l.length === 1) {
      return;
    }

    const i = l.indexOf(c);
    if (i > -1) {
      l.splice(i, 1);
    }
  }

  removeFraccion(f) {
    if (this.organo.fracciones.length === 1) {
      return;
    }
    const i = this.organo.fracciones.indexOf(f);
    if (i > -1) {
      this.organo.fracciones.splice(i, 1);
    }
  }

  ngOnDestroy() { }

  volver() {
    this.router.navigate(['/organos']);
  }
}
