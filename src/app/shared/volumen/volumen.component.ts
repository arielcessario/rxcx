import { VolumenService } from './../../core/volumen.service';
import { Logger } from './../../core/logger/logger.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { CoreService } from 'ac-core';
import { RxCxProxy } from 'rxcx-core';

@Component({
  selector: 'rxc-volumen',
  templateUrl: './volumen.component.html',
  styleUrls: ['./volumen.component.scss']
})
export class VolumenComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  volumen: any = {};

  @Output()
  eliminarVolumen = new EventEmitter<string>();
  @Output()
  updateCITV = new EventEmitter<any>();

  paciente = '';
  open = true;
  images = [];

  formVolumen: FormGroup;
  sub: any;
  saveSubs: any;
  _volumen: any = {};
  _dosisMargenGy = 0;
  _dosisMaximaGy = 0;
  _indiceHomogeneidad = 0;
  _indiceGradiente = 0;
  _indicePadick = 0;
  partes = [];
  partes_seleccionadas: Array<any> = [];
  filterPartes = '';
  filterDiags = '';
  reglasOrganos = [];

  private fb: FormBuilder;

  // volumen
  public nombre: string;
  public tps: number;
  public colimador = 1;
  public volumenPTV: number;
  public dosisTotalGy: number;
  public dosisFraccionGy: number;
  public cantidadFracciones: number;
  public v100: number;
  public volumenIsodosisPrescripcion: number;
  public volumenIsodosisPrescripcionPorc: number;
  public volumenIsodosis50: number;
  public dosisMargenGy: number;
  public dosisMaximaGy: number;
  public indiceHomogeneidad: number;
  public indiceConformidad: number;
  public indiceGradiente: number;
  public indicePaddick: number;
  public cantidadCampos: number;
  public um = 0;
  public tecnica: number;
  public margenCTVPTV: number;
  public v12: number;
  public v20: number;
  public gtv: number;
  public comentarios: string;

  // Imagenes
  imagenes: Array<any> = [];

  _volumenGroup: any = {
    nombre: [this.nombre, [Validators.required, Validators.minLength(4)]],
    tps: [this.tps],
    colimador: [this.colimador],
    volumenPTV: [this.volumenPTV],
    dosisTotalGy: [this.dosisTotalGy],
    dosisFraccionGy: [this.dosisFraccionGy],
    cantidadFracciones: [this.cantidadFracciones],
    volumenIsodosisPrescripcion: [this.volumenIsodosisPrescripcion],
    volumenIsodosisPrescripcionPorc: [this.volumenIsodosisPrescripcionPorc],
    volumenIsodosis50: [this.volumenIsodosis50],
    dosisMaximaGy: [this.dosisMaximaGy],
    indiceHomogeneidad: [this.indiceHomogeneidad],
    indiceConformidad: [this.indiceConformidad],
    indiceGradiente: [this.indiceGradiente],
    indicePaddick: [this.indicePaddick],
    cantidadCampos: [this.cantidadCampos],
    um: [this.um],
    tecnica: [this.tecnica],
    margenCTVPTV: [this.margenCTVPTV],
    v12: [this.v12],
    v20: [this.v20],
    gtv: [this.gtv],
    comentarios: [this.comentarios]
  };

  // volumen: any = { nombre: '' };
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
    private volumenService: VolumenService,
    private logger: Logger,
    private rxcxProxy: RxCxProxy
  ) {}

  ngOnInit() {
    // console.log(this.volumen);
    // this.afs.firestore.settings({ timestampsInSnapshots: true });

    this.rxcxProxy.getOrganos().subscribe(organos => {
      this.partes = organos;
    });

    this.rxcxProxy.getReglasOrganos().subscribe(reglas => {
      this.reglasOrganos = reglas;

      if (this.volumen.organos) {
        this.partes_seleccionadas = this.volumen.organos;
        for (let i = 0; i < this.volumen.organos.length; i++) {
          this.checkConstraint(this.volumen.organos[i]);
          this.volumen.organos[i].volumenes = this.addVolumenesPartes(
            this.volumen.organos[i]
          );
        }
      }
    });

    this.saveSubs = this.volumenService.saveVolumen.subscribe(() => {
      const vol = this.getVolumen();
      vol.volumen_id = this.volumen['volumen_id'];
      setTimeout(() => {
        this.volumenService.onSaveConfirmVolumen(vol);
      }, 0);
    });

    if (this.volumen['new']) {
      this.formVolumen = this.buildForm(this.formVolumen, this._volumenGroup);
    } else {
      // console.log(this.volumen);

      this._volumen = this.volumen;
      this.formVolumen = this.buildForm(this.formVolumen, this._volumenGroup);
    }
  }

  ngOnChanges(e) {}

  ngOnDestroy() {
    this.saveSubs.unsubscribe();
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  loadedImage(e, i, obj) {
    const key = obj + (i + 1);
    this.imagenes[key] = e.originalName;
  }

  eleminarVolumen() {
    this.eliminarVolumen.emit(this.volumen['volumen_id']);
  }

  getVolumen(): any {
    // this.volumen['paciente'] = this.paciente;

    const volumen = {
      nombre: this.formVolumen.get('nombre').value,
      tps: this.formVolumen.get('tps').value,
      colimador: this.formVolumen.get('colimador').value,
      volumenPTV: this.formVolumen.get('volumenPTV').value,
      dosisTotalGy: this.formVolumen.get('dosisTotalGy').value,
      dosisFraccionGy: this.formVolumen.get('dosisFraccionGy').value,
      cantidadFracciones: this.formVolumen.get('cantidadFracciones').value,
      margenCTVPTV: this.formVolumen.get('margenCTVPTV').value,
      volumenIsodosisPrescripcion: this.formVolumen.get(
        'volumenIsodosisPrescripcion'
      ).value,
      volumenIsodosisPrescripcionPorc: this.formVolumen.get(
        'volumenIsodosisPrescripcionPorc'
      ).value,
      volumenIsodosis50: this.formVolumen.get('volumenIsodosis50').value,
      dosisMaximaGy: this.formVolumen.get('dosisMaximaGy').value,
      indiceHomogeneidad: this.formVolumen.get('indiceHomogeneidad').value,
      indiceConformidad: this.formVolumen.get('indiceConformidad').value,
      indiceGradiente: this.formVolumen.get('indiceGradiente').value,
      indicePaddick: this.formVolumen.get('indicePaddick').value,
      cantidadCampos: this.formVolumen.get('cantidadCampos').value,
      um: this.formVolumen.get('um').value,
      tecnica: this.formVolumen.get('tecnica').value,
      v12: this.formVolumen.get('v12').value,
      v20: this.formVolumen.get('v20').value,
      gtv: this.formVolumen.get('gtv').value,
      paciente: this.paciente,
      img02: this.imagenes['img02'] ? this.imagenes['img02'] : '',
      img03: this.imagenes['img03'] ? this.imagenes['img03'] : '',
      img01: this.imagenes['img01'] ? this.imagenes['img01'] : '',
      comentarios: this.formVolumen.get('comentarios').value,
      organos: this.volumen.organos
    };

    return volumen;
  }

  addParte(d, i) {
    const limitesVolumenes = this.addVolumenesPartes(d);

    setTimeout(() => {
      const t = {
        cantidad: this.formVolumen.get('cantidadFracciones').value,
        constraint: 0,
        organo_id: d.organo_id,
        nombre: d.nombre,
        volumenes: limitesVolumenes
      };
      if (!this.volumen.organos) {
        this.volumen.organos = [];
      }
      this.volumen.organos.push(t);
    }, 0);
  }

  addVolumenesPartes(d) {
    // console.log(d);
    // console.log(this.reglasOrganos);

    const limitesVolumenes = [];
    const fr = this.formVolumen.get('cantidadFracciones').value;

    for (let z = 0; z < this.reglasOrganos.length; z++) {
      if (
        d.organo_id === this.reglasOrganos[z].organo_id &&
        parseInt(fr) === parseInt(this.reglasOrganos[z].fraccion)
      ) {
        limitesVolumenes.push(this.reglasOrganos[z].volumen);
      }
    }

    return limitesVolumenes;
  }

  checkConstraint(p) {
    const limitesVolumenes = [];
    console.log(this.reglasOrganos);

    const cantFracciones = this.formVolumen.get('cantidadFracciones').value;
    for (let i = 0; i < this.reglasOrganos.length; i++) {
      if (
        p.organo_id === this.reglasOrganos[i].organo_id &&
        parseFloat(cantFracciones) ===
          parseFloat(this.reglasOrganos[i].fraccion)
      ) {
        limitesVolumenes.push(this.reglasOrganos[i].constraint);
      }
    }

    // console.log(limitesVolumenes);

    // setTimeout(() => {
    //   p.volumenes = limitesVolumenes;
    // }, 0);

    p.endpoint = '';
    for (let i = 0; i < this.reglasOrganos.length; i++) {
      if (
        this.reglasOrganos[i].organo_id === p.organo_id &&
        parseFloat(cantFracciones) ===
          parseFloat(this.reglasOrganos[i].fraccion) &&
        this.reglasOrganos[i].constraint < p.constraint
      ) {
        p.endpoint = this.reglasOrganos[i].endpoint;
      }
    }
  }

  removeParte(d, i) {
    this.partes_seleccionadas.splice(i, 1);
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

    if (this.volumen['new']) {
      form.setValue({
        nombre: '',
        tps: '0',
        colimador: '0',
        volumenPTV: 0,
        dosisTotalGy: 0,
        dosisFraccionGy: 0,
        cantidadFracciones: 0,
        margenCTVPTV: 0,
        volumenIsodosisPrescripcion: 0,
        volumenIsodosisPrescripcionPorc: 0,
        volumenIsodosis50: 0,
        dosisMaximaGy: 0,
        indiceHomogeneidad: 0,
        indiceConformidad: 0,
        indiceGradiente: 0,
        indicePaddick: 0,
        cantidadCampos: 0,
        um: 0,
        v12: 0,
        v20: 0,
        gtv: 0,
        tecnica: '0',
        comentarios: ''
      });
    } else {
      form.setValue({
        nombre: this._volumen['nombre'] || '',
        tps: '' + this._volumen['tps'] || '0',
        colimador: '' + this._volumen['colimador'] || '0',
        volumenPTV:
          this._volumen['volumenPTV'] || this._volumen['volumenTPV'] || 0,
        dosisTotalGy: this._volumen['dosisTotalGy'] || 0,
        dosisFraccionGy: this._volumen['dosisFraccionGy'] || 0,
        cantidadFracciones: this._volumen['cantidadFracciones'] || 0,
        margenCTVPTV: this._volumen['margenCTVPTV'] || 0,
        volumenIsodosisPrescripcion:
          this._volumen['volumenIsodosisPrescripcion'] || 0,
        volumenIsodosisPrescripcionPorc:
          this._volumen['volumenIsodosisPrescripcionPorc'] || 0,
        volumenIsodosis50: this._volumen['volumenIsodosis50'] || 0,
        dosisMaximaGy: this._volumen['dosisMaximaGy'] || 0,
        indiceHomogeneidad:
          Math.round(this._volumen['indiceHomogeneidad'] * 1000) / 1000 || 0,
        indiceConformidad:
          Math.round(this._volumen['indiceConformidad'] * 1000) / 1000 || 0,
        indiceGradiente:
          Math.round(this._volumen['indiceGradiente'] * 1000) / 1000 || 0,
        indicePaddick:
          Math.round(this._volumen['indicePaddick'] * 1000) / 1000 || 0,
        cantidadCampos: this._volumen['cantidadCampos'] || 0,
        um: this._volumen['um'] || 0,
        v12: this._volumen['v12'] || 0,
        v20: this._volumen['v20'] || 0,
        gtv: this._volumen['gtv'] || 0,
        tecnica: '' + this._volumen['tecnica'] || '0',
        comentarios: '' + this._volumen['comentarios'] || ''
      });
      this.volumen['new'] = false;
    }

    // if (this._volumen['cantidadFracciones'] && this.volumen['volumen_id']) {
    //   this.volumenService.onCalcFracciones({
    //     volumen_id: this.volumen['volumen_id'],
    //     cantidad: this._volumen['cantidadFracciones']
    //   });
    // }

    setTimeout(() => {
      if (this.volumen['new']) {
        this.open = true;
      } else {
        this.open = false;
      }

      if (this.volumen.organos) {
        for (let i = 0; i < this.volumen.organos.length; i++) {
          this.checkConstraint(this.volumen.organos[i]);

          this.volumen.organos[i].volumenes = this.addVolumenesPartes(
            this.volumen.organos[i]
          );
        }
      }
    }, 100);

    this.imagenes['img01'] = this._volumen.img01;
    this.imagenes['img02'] = this._volumen.img02;
    this.imagenes['img03'] = this._volumen.img03;

    // Cálculo indice hetero

    form.get('dosisMaximaGy').valueChanges.subscribe(val => {
      this.calcIndHetero();
    });

    // Cálculo indice conformidad
    form.get('volumenIsodosisPrescripcion').valueChanges.subscribe(val => {
      this.calcIndConformidad();
    });

    form.get('volumenPTV').valueChanges.subscribe(val => {
      this.calcIndConformidad();
      this.calcIndGradiente();
    });

    form.get('volumenIsodosisPrescripcionPorc').valueChanges.subscribe(val => {
      this.calcIndConformidad();
      this.calcIndGradiente();
    });

    form.get('volumenIsodosis50').valueChanges.subscribe(val => {
      this.calcIndGradiente();
    });

    form.get('dosisTotalGy').valueChanges.subscribe(val => {
      this.calcCantidadFracciones();
      this.calcIndHetero();
    });

    form.get('dosisFraccionGy').valueChanges.subscribe(val => {
      this.calcCantidadFracciones();
    });

    form.get('gtv').valueChanges.subscribe(val => {
      this.updateCITV.emit({ uid: this.volumen['uid'], val: val });
    });

    return form;
  }

  updateVolumenImages(e) {
    this.imagenes[Object.getOwnPropertyNames(e)[0]] =
      e[Object.getOwnPropertyNames(e)[0]];
  }

  updateDefinicionImages(e, id) {
    const _id = 'img' + id;
    this.volumen[_id] = e[_id];
    console.log(this.volumen);
  }

  calcCantidadFracciones() {
    const resp =
      this.formVolumen.get('dosisTotalGy').value /
        this.formVolumen.get('dosisFraccionGy').value || 0;
    this.formVolumen
      .get('cantidadFracciones')
      .setValue(Math.round(resp * 1000) / 1000);

    if (this.volumen['volumen_id']) {
      console.log('volumen_id');

      this.volumenService.onCalcFracciones({
        volumen_id: this.volumen['volumen_id'],
        cantidad: Math.round(resp * 1000) / 1000
      });
    }
  }

  calcIndHetero() {
    // solo 3 decimales a todos
    const resp =
      this.formVolumen.get('dosisMaximaGy').value /
        this.formVolumen.get('dosisTotalGy').value || 0;
    this.formVolumen
      .get('indiceHomogeneidad')
      .setValue(Math.round(resp * 1000) / 1000);
  }

  calcIndConformidad() {
    const resp =
      this.formVolumen.get('volumenIsodosisPrescripcion').value /
        this.formVolumen.get('volumenPTV').value || 0;
    this.formVolumen
      .get('indiceConformidad')
      .setValue(Math.round(resp * 1000) / 1000);
  }

  calcIndGradiente() {
    const resp =
      (this.formVolumen.get('volumenIsodosisPrescripcionPorc').value *
        this.formVolumen.get('volumenPTV').value) /
        100 /
        this.formVolumen.get('volumenIsodosis50').value || 0;
    this.formVolumen
      .get('indiceGradiente')
      .setValue(Math.round(resp * 1000) / 1000);
  }
}
