import { RxCxProxy } from 'rxcx-core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { OarService } from './../../core/oar.service';
import { Logger } from './../../core/logger/logger.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CoreService } from 'ac-core';
import { VolumenService } from '../../core/volumen.service';

@Component({
  selector: 'rxc-oar',
  templateUrl: './oar.component.html',
  styleUrls: ['./oar.component.scss']
})
export class OarComponent implements OnInit, OnChanges {
  @Input()
  paciente: any = {};
  @Input()
  oar: any = {};
  @Input()
  seguimiento: any = {};

  open = true;
  openSeguimiento = true;

  formOAR: FormGroup;
  formSeguimiento: FormGroup;

  private fb: FormBuilder;
  partes: Array<any> = [];
  partes_seleccionadas: Array<any> = [];
  filterPartes = '';
  filterDiags = '';
  endpoints: Array<any> = [];

  volSubs: any;
  volFracciones: { uid: string; cantidad: number }[] = [];
  // volFracciones: number[] = [];

  images = [];
  reglasOrganos = [];

  imagenes: any = {};

  // Paciente
  public oar_name: string;
  public toxicidadAguda = 1;
  public toxicidadAgudaDescr: string;
  public toxicidadCronica = 1;
  public toxicidadCronicaDescr: string;
  public seguimientoImagenologico3M = 0;
  public seguimientoImagenologico3MDescr: string;
  public seguimientoImagenologico6M = 0;
  public seguimientoImagenologico6MDescr: string;
  public seguimientoImagenologico12M = 0;
  public seguimientoImagenologico12MDescr: string;

  _pacienteGroup: any = {
    oar_name: [this.oar_name],
    toxicidadAguda: [this.toxicidadAguda],
    toxicidadAgudaDescr: [this.toxicidadAgudaDescr],
    toxicidadCronica: [this.toxicidadCronica],
    toxicidadCronicaDescr: [this.toxicidadCronicaDescr]
  };
  _pacienteSeguimientoGroup: any = {
    seguimientoImagenologico3M: [this.seguimientoImagenologico3M],
    seguimientoImagenologico3MDescr: [this.seguimientoImagenologico3MDescr],
    seguimientoImagenologico6M: [this.seguimientoImagenologico6M],
    seguimientoImagenologico6MDescr: [this.seguimientoImagenologico6MDescr],
    seguimientoImagenologico12M: [this.seguimientoImagenologico12M],
    seguimientoImagenologico12MDescr: [this.seguimientoImagenologico12MDescr]
  };

  formErrors = {
    nombre: '',
    apellido: '',
    hc: '',
    edad: '',
    fechaaplicacion: ''
  };
  validationMessages = {
    nombre: {
      required: 'Requerido',
      minlength: 'Mínimo 3 letras',
      maxlength: 'El nombre no puede tener mas de 24 letras'
    },
    apellido: {
      required: 'Power is required.',
      maxlength: 'Sismbolo tiene que tener un máximo de 3 letras'
    },
    hc: {
      required: 'Debe ingresar un password',
      minlength: 'El password debe tener al menos seis (6) letras y/o números'
    },
    edad: {
      required: 'Debe ingresar un password',
      minlength: 'El password debe tener al menos seis (6) letras y/o números'
    },
    fechaaplicacion: {
      required: 'Debe ingresar un password',
      minlength: 'El password debe tener al menos seis (6) letras y/o números'
    }
  };
  constructor(
    private coreService: CoreService,
    private oarService: OarService,
    private logger: Logger,
    private volumenService: VolumenService,
    private rxcxProxy: RxCxProxy
  ) {}

  ngOnInit() {
    // this.rxcxProxy.getOrganos().subscribe(organos => {
    //   this.partes = organos;
    //   if (this.oar) {
    //     this.refreshPartes();
    //   }
    // });

    // this.rxcxProxy.getReglasOrganos().subscribe(reglas => {
    //   this.reglasOrganos = reglas;
    // });

    if (!this.seguimiento) {
      this.seguimiento = {};
    }

    this.volSubs = this.volumenService.calcFracciones.subscribe(p => {
      // console.log(p);
      let encontrado = -1;
      let numero = -1;
      let cantNum = 0;
      for (let i = 0; i < this.volFracciones.length; i++) {
        if (p.uid === this.volFracciones[i].uid) {
          encontrado = i;
        }
      }

      for (let i = 0; i < this.volFracciones.length; i++) {
        if (this.volFracciones[i].cantidad === p.cantidad) {
          numero = i;
          cantNum = cantNum + 1;
        }
      }

      if (encontrado === -1 && numero === -1) {
        // reviso si existe el número
        this.volFracciones.push(p);
      } else if (encontrado !== -1 && numero === -1) {
        this.volFracciones[encontrado].cantidad = p.cantidad;
      } else if (encontrado !== -1 && numero !== -1) {
        if (cantNum > 1) {
          this.volFracciones.splice(encontrado, 1);
        }
      } else if (encontrado === -1 && numero !== -1) {
        if (cantNum > 1) {
          this.volFracciones.splice(numero, 1);
        }
      }
      // console.log(this.volFracciones);
    });

    // Obtengo las partes para armar la lista
    // const docRef = this.afs.collection('organos');
    // docRef
    //   .snapshotChanges()
    //   .map(d => {
    //     return d.map(a => {
    //       const data = a.payload.doc.data();
    //       data.uid = a.payload.doc.id;
    //       return data;
    //     });
    //   })
    //   .subscribe(d => {
    //     // const final: Array<any> = [];
    //     // final.push(
    //     //   d.map(data => {
    //     //     const _array = data;
    //     //     _array.name = Object.getOwnPropertyNames(data)[0];
    //     //     return _array;
    //     //   })
    //     // );
    //     // this.partes = final[0];

    //     this.partes = d;
    //     this.refreshPartes();
    //   });

    // if (this.paciente.nombre !== '') {
    this.formOAR = this.buildForm(this.formOAR, this._pacienteGroup);
    this.formSeguimiento = this.buildFormSeguimiento(
      this.formSeguimiento,
      this._pacienteSeguimientoGroup
    );
    // }

    const subs = this.oarService.updateOAR.subscribe(paciente => {
      // console.log('paciente', paciente);
      const pac = this.updatePaciente(paciente);

      setTimeout(() => {
        this.oarService.onUpdatedOAR(pac);
      }, 0);

      // subs.unsubscribe();
      // this.update();
    });
  }

  ngOnChanges(e) {
    if (!e.seguimiento.currentValue) {
      this.seguimiento = {};
    }
    if (this.paciente.nombre !== '') {
      this.formOAR = this.buildForm(this.formOAR, this._pacienteGroup);
      this.formSeguimiento = this.buildFormSeguimiento(
        this.formSeguimiento,
        this._pacienteSeguimientoGroup
      );
    }
  }

  addParte(d, i) {
    console.log(d);

    if (this.volumenService.getCantVolumenes() === 0) {
      this.coreService.setToast({
        type: 'error',
        title: 'Agregar Partes',
        body: 'Debe agregar al menos un volumen'
      });
      return;
    }

    let index = -1;
    for (let x = 0; x < this.partes.length; x++) {
      if (this.partes[x].organo_id === d.organo_id) {
        index = +x;
      }
    }

    // // console.log(d);
    const temp = this.partes;
    this.partes = [];
    this.filterPartes = '';

    const limitesVolumenes = [];

    for (let z = 0; z < this.reglasOrganos.length; z++) {
      for (let x = 0; x < this.volFracciones.length; x++) {
        if (
          d.organo_id === this.reglasOrganos[z].organo_id &&
          this.volFracciones[x].cantidad === this.reglasOrganos[z].fraccion
        ) {
          limitesVolumenes.push(this.reglasOrganos[z].volumen);
        }
      }
    }

    // for (let x = 0; x < d.fracciones.length; x++) {
    //   for (let l = 0; l < d.fracciones[x].limites.length; l++) {
    //     if (
    //       limitesVolumenes.indexOf(d.fracciones[x].limites[l].volumen) === -1
    //     ) {
    //       limitesVolumenes.push(d.fracciones[x].limites[l].volumen);
    //     }
    //   }
    // }
    temp.splice(index, 1);

    setTimeout(() => {
      this.partes = temp;
      const t = {
        cantidad: this.volFracciones[0] ? this.volFracciones[0].cantidad : 0,
        constraint: 0,
        organo_id: d.organo_id,
        nombre: d.nombre,
        volumenes: limitesVolumenes
      };
      this.partes_seleccionadas.push(t);
    }, 0);
  }

  loadedImage(e, i, obj) {
    const key = obj + 'Img' + (i + 1);
    this.imagenes[key] = e.originalName;
  }

  checkConstraint(p) {
    const limitesVolumenes = [];
    for (let i = 0; i < this.reglasOrganos.length; i++) {
      for (let x = 0; x < this.volFracciones.length; x++) {
        if (
          p.organo_id === this.reglasOrganos[i].organo_id &&
          this.volFracciones[x].cantidad === this.reglasOrganos[i].fraccion
        ) {
          limitesVolumenes.push(this.reglasOrganos[i].constraint);
        }
      }
    }

    setTimeout(() => {
      p.volumenes = limitesVolumenes;
    }, 0);

    p.endpoint = '';
    for (let i = 0; i < this.reglasOrganos.length; i++) {
      if (
        this.reglasOrganos[i].organo_id === p.organo_id &&
        this.reglasOrganos[i].fraccion === p.cantidad &&
        this.reglasOrganos[i].constraint < p.constraint
      ) {
        p.endpoint = this.reglasOrganos[i].endpoint;
      }
    }
  }

  removeParte(d, i) {
    this.partes_seleccionadas.splice(i, 1);
    this.partes.push(d);
    const temp = this.partes;
    this.partes = [];
    setTimeout(() => {
      this.partes = temp;
    }, 0);
  }

  db() {
    // console.log(this.partes_seleccionadas);
  }
  updatePaciente(paciente) {
    paciente.oar = this.formOAR ? this.formOAR.get('oar_name').value || '' : '';
    paciente.toxicidadAguda = this.toxicidadAguda;
    paciente.toxicidadAgudaDescr = this.formOAR
      ? this.formOAR.get('toxicidadAgudaDescr').value || ''
      : '';
    paciente.toxicidadCronica = this.toxicidadCronica;
    paciente.toxicidadCronicaDescr = this.formOAR
      ? this.formOAR.get('toxicidadCronicaDescr').value || ''
      : '';
    paciente.seguimientoImagenologico3M = this.formSeguimiento
      ? this.formSeguimiento.get('seguimientoImagenologico3M').value || ''
      : '';
    paciente.seguimientoImagenologico3MDescr = this.formSeguimiento
      ? this.formSeguimiento.get('seguimientoImagenologico3MDescr').value || ''
      : '';
    paciente.seguimientoImagenologico3MImg1 = this.imagenes[
      'seguimientoImagenologico3MImg1'
    ]
      ? this.imagenes['seguimientoImagenologico3MImg1']
      : '';
    paciente.seguimientoImagenologico3MImg2 = this.imagenes[
      'seguimientoImagenologico3MImg2'
    ]
      ? this.imagenes['seguimientoImagenologico3MImg2']
      : '';
    paciente.seguimientoImagenologico3MImg3 = this.imagenes[
      'seguimientoImagenologico3MImg3'
    ]
      ? this.imagenes['seguimientoImagenologico3MImg3']
      : '';
    paciente.seguimientoImagenologico3MImg4 = this.imagenes[
      'seguimientoImagenologico3MImg4'
    ]
      ? this.imagenes['seguimientoImagenologico3MImg4']
      : '';
    paciente.seguimientoImagenologico3MImg5 = this.imagenes[
      'seguimientoImagenologico3MImg5'
    ]
      ? this.imagenes['seguimientoImagenologico3MImg5']
      : '';
    paciente.seguimientoImagenologico6M = this.formSeguimiento
      ? this.formSeguimiento.get('seguimientoImagenologico6M').value || ''
      : '';
    paciente.seguimientoImagenologico6MDescr = this.formSeguimiento
      ? this.formSeguimiento.get('seguimientoImagenologico6MDescr').value || ''
      : '';
    paciente.seguimientoImagenologico6MImg1 = this.imagenes[
      'seguimientoImagenologico6MImg1'
    ]
      ? this.imagenes['seguimientoImagenologico6MImg1']
      : '';
    paciente.seguimientoImagenologico6MImg2 = this.imagenes[
      'seguimientoImagenologico6MImg2'
    ]
      ? this.imagenes['seguimientoImagenologico6MImg2']
      : '';
    paciente.seguimientoImagenologico6MImg3 = this.imagenes[
      'seguimientoImagenologico6MImg3'
    ]
      ? this.imagenes['seguimientoImagenologico6MImg3']
      : '';
    paciente.seguimientoImagenologico6MImg4 = this.imagenes[
      'seguimientoImagenologico6MImg4'
    ]
      ? this.imagenes['seguimientoImagenologico6MImg4']
      : '';
    paciente.seguimientoImagenologico6MImg5 = this.imagenes[
      'seguimientoImagenologico6MImg5'
    ]
      ? this.imagenes['seguimientoImagenologico6MImg5']
      : '';
    paciente.seguimientoImagenologico12M = this.formSeguimiento
      ? this.formSeguimiento.get('seguimientoImagenologico12M').value || ''
      : '';
    paciente.seguimientoImagenologico12MDescr = this.formSeguimiento
      ? this.formSeguimiento.get('seguimientoImagenologico12MDescr').value || ''
      : '';
    paciente.seguimientoImagenologico12MImg1 = this.imagenes[
      'seguimientoImagenologico12MImg1'
    ]
      ? this.imagenes['seguimientoImagenologico12MImg1']
      : '';
    paciente.seguimientoImagenologico12MImg2 = this.imagenes[
      'seguimientoImagenologico12MImg2'
    ]
      ? this.imagenes['seguimientoImagenologico12MImg2']
      : '';
    paciente.seguimientoImagenologico12MImg3 = this.imagenes[
      'seguimientoImagenologico12MImg3'
    ]
      ? this.imagenes['seguimientoImagenologico12MImg3']
      : '';
    paciente.seguimientoImagenologico12MImg4 = this.imagenes[
      'seguimientoImagenologico12MImg4'
    ]
      ? this.imagenes['seguimientoImagenologico12MImg4']
      : '';
    paciente.seguimientoImagenologico12MImg5 = this.imagenes[
      'seguimientoImagenologico12MImg5'
    ]
      ? this.imagenes['seguimientoImagenologico12MImg5']
      : '';

    // const partes: any = {};
    // paciente.organos = this.partes_seleccionadas;

    // setTimeout(() => {
    //   this.oarService.onUpdatedOAR(this.paciente);
    // }, 0);
    return paciente;
  }

  buildFormSeguimiento(form: FormGroup, group: any): FormGroup {
    this.fb = new FormBuilder();
    form = this.fb.group(group);

    form.valueChanges.subscribe(data =>
      this.coreService.onValueChanged(
        data,
        form,
        this.formErrors,
        this.validationMessages
      )
    );

    this.coreService.onValueChanged(); // (re)set validation messages now);

    form.setValue({
      seguimientoImagenologico3M:
      this.seguimiento.seguimientoImagenologico3M ? '' + this.seguimiento.seguimientoImagenologico3M : '1',
      seguimientoImagenologico3MDescr:
        this.seguimiento.seguimientoImagenologico3MDescr || '',
      seguimientoImagenologico6M:
      this.seguimiento.seguimientoImagenologico6M ? '' + this.seguimiento.seguimientoImagenologico6M : '1',
      seguimientoImagenologico6MDescr:
        this.seguimiento.seguimientoImagenologico6MDescr || '',
      seguimientoImagenologico12M:
      this.seguimiento.seguimientoImagenologico12M ? '' + this.seguimiento.seguimientoImagenologico12M : '1',
      seguimientoImagenologico12MDescr:
        this.seguimiento.seguimientoImagenologico12MDescr || ''
    });

    this.imagenes[
      'seguimientoImagenologico3MImg1'
    ] = this.seguimiento.seguimientoImagenologico3MImg1;
    this.imagenes[
      'seguimientoImagenologico3MImg2'
    ] = this.seguimiento.seguimientoImagenologico3MImg2;
    this.imagenes[
      'seguimientoImagenologico3MImg3'
    ] = this.seguimiento.seguimientoImagenologico3MImg3;
    this.imagenes[
      'seguimientoImagenologico3MImg4'
    ] = this.seguimiento.seguimientoImagenologico3MImg4;
    this.imagenes[
      'seguimientoImagenologico3MImg5'
    ] = this.seguimiento.seguimientoImagenologico3MImg5;

    this.imagenes[
      'seguimientoImagenologico6MImg1'
    ] = this.seguimiento.seguimientoImagenologico6MImg1;
    this.imagenes[
      'seguimientoImagenologico6MImg2'
    ] = this.seguimiento.seguimientoImagenologico6MImg2;
    this.imagenes[
      'seguimientoImagenologico6MImg3'
    ] = this.seguimiento.seguimientoImagenologico6MImg3;
    this.imagenes[
      'seguimientoImagenologico6MImg4'
    ] = this.seguimiento.seguimientoImagenologico6MImg4;
    this.imagenes[
      'seguimientoImagenologico6MImg5'
    ] = this.seguimiento.seguimientoImagenologico6MImg5;

    this.imagenes[
      'seguimientoImagenologico12MImg1'
    ] = this.seguimiento.seguimientoImagenologico12MImg1;
    this.imagenes[
      'seguimientoImagenologico12MImg2'
    ] = this.seguimiento.seguimientoImagenologico12MImg2;
    this.imagenes[
      'seguimientoImagenologico12MImg3'
    ] = this.seguimiento.seguimientoImagenologico12MImg3;
    this.imagenes[
      'seguimientoImagenologico12MImg4'
    ] = this.seguimiento.seguimientoImagenologico12MImg4;
    this.imagenes[
      'seguimientoImagenologico12MImg5'
    ] = this.seguimiento.seguimientoImagenologico12MImg5;

    const temp = this.imagenes;
    this.imagenes = [];

    // this.refreshPartes();
    // console.log(form);


    setTimeout(() => {
      this.openSeguimiento = false;
      this.imagenes = temp;
    }, 0);

    return form;
  }

  buildForm(form: FormGroup, group: any): FormGroup {
    this.fb = new FormBuilder();
    form = this.fb.group(group);

    form.valueChanges.subscribe(data =>
      this.coreService.onValueChanged(
        data,
        form,
        this.formErrors,
        this.validationMessages
      )
    );

    this.coreService.onValueChanged(); // (re)set validation messages now);

    // form.setValue({
    //   oar_name: this.oar.oar || '',
    //   toxicidadAguda: this.oar.toxicidadAguda || 0,
    //   toxicidadAgudaDescr: this.oar.toxicidadAgudaDescr || '',
    //   toxicidadCronica: this.oar.toxicidadCronica || 0,
    //   toxicidadCronicaDescr: this.oar.toxicidadCronicaDescr || ''
    // });

    // this.toxicidadAguda = this.oar.toxicidadAguda || 0;
    // this.toxicidadCronica = this.oar.toxicidadCronica || 0;

    // this.refreshPartes();

    setTimeout(() => {
      this.open = false;
    }, 0);

    return form;
  }

  refreshPartes() {
    if (!this.oar.organos || !this.oar.organos[0] || this.partes.length === 0) {
      return;
    }

    const part_a_remover = [];

    for (let i = 0; i < this.partes.length; i++) {
      for (let x = 0; x < this.oar.organos.length; x++) {
        if (this.partes[i].organo_id === this.oar.organos[x].organo_id) {
          part_a_remover.push(i);
          setTimeout(() => {
            const t = {
              cantidad: this.oar.organos[x].cantidad,
              constraint: this.oar.organos[x].constraint,
              organo_id: this.oar.organos[x].organo_id,
              nombre: this.oar.organos[x].nombre,
              volumenLimite: this.oar.organos[x].volumenLimite
            };

            this.partes_seleccionadas.push(t);
          }, 0);
        }
      }
    }

    let temp = this.partes;
    for (let i = 0; i < part_a_remover.length; i++) {
      temp.splice(part_a_remover[i], 1);
    }

    setTimeout(() => {
      this.partes = temp;
    }, 0);
  }

  updatePacienteImages(e) {
    this.imagenes[Object.getOwnPropertyNames(e)[0]] =
      e[Object.getOwnPropertyNames(e)[0]];
  }

  updateDefinicionImages(e, id, obj) {
    const _id = obj + 'Img' + (id + 1);
    this.images[_id] = e[_id];
  }
}
