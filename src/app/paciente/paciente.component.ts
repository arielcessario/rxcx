import { OarService } from './../core/oar.service';
import { VolumenService } from './../core/volumen.service';
import { Validators } from '@angular/forms';
import { Logger } from './../core/logger/logger.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { CoreService } from 'ac-core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import {
  NgbDatepickerConfig,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from '../core/ngb-date-fr-parser-formatter';
import { RxCxProxy } from 'rxcx-core';

@Component({
  selector: 'rxc-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
  ]
})
export class PacienteComponent implements OnInit, OnDestroy {
  isNew = false;
  volumesToRemove = [];
  gtvs = {};
  public oar_name = '';

  formPaciente: FormGroup;

  private fb: FormBuilder;

  // Paciente
  public nombre: string;
  public apellido: string;
  public hc: string;
  public edad: string;
  public sexo = 0;
  public rpa = 1;
  public citv = 0;
  public diagnostico: number[];
  public radioterapia: string;
  public radioterapia_descr: string;
  public cirugia_previa: string;
  public fecha_aplicacion: string;
  public sistema_inmobilizacion: string;

  _pacienteGroup: any = {
    nombre: [this.nombre, [Validators.required, Validators.minLength(4)]],
    apellido: [this.apellido, [Validators.required, Validators.minLength(4)]],
    hc: [this.hc, [Validators.required, Validators.minLength(4)]],
    edad: [this.edad],
    sexo: [this.sexo],
    rpa: [this.rpa],
    citv: [this.citv],
    diagnostico: [this.diagnostico],
    radioterapia: [this.radioterapia],
    radioterapia_descr: [this.radioterapia_descr],
    cirugia_previa: [this.cirugia_previa],
    fecha_aplicacion: [
      this.fecha_aplicacion,
      [Validators.required, Validators.minLength(4)]
    ],
    sistema_inmobilizacion: [this.sistema_inmobilizacion]
  };

  current = 1;
  id: string;
  open = true;
  diagnosticos: Array<any> = [];
  diagnosticos_seleccionados: Array<any> = [];
  diagnosticos_titulo = '';
  paciente: any = { nombre: '', apellido: '', hc: '', oar: '' };
  volumenes: Array<any> = [];
  filterDiags = '';
  savedVolumenes: any = {};
  _id = '';
  _paciente: any = {};
  exists = true;
  _saving = false;
  _savingButton = false;
  _keepOpen = false;

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
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private coreService: CoreService,
    private volumenService: VolumenService,
    private oarService: OarService,
    private rxcxProxy: RxCxProxy
  ) { }

  ngOnInit() {
    this.rxcxProxy.getDiagnosticos().subscribe(data => {
      this.diagnosticos = data;
    });

    this.route.params.subscribe(params => {

      this.id = params['id'];

      if (this.id !== '0') {
        this._id = this.id;

        this.getData();
      } else {
        this.formPaciente = this.buildForm(
          this.formPaciente,
          this._pacienteGroup
        );
        this.isNew = true;
      }
    });

    // let oarSubs = this.oarService.updatedOAR.subscribe((data) => {
    //   this._paciente = data;
    //   oarSubs.unsubscribe();
    //   this.saveEnd();
    // })
  }

  getData(id?: number) {
    this.volumenes = [];
    // console.log('id: ', this._id);


    if (!id) {
      id = parseInt(this._id);
    } else {
      this._id = id.toString();
    }
    // this.coreService.setLoadingStatus(true);
    this.rxcxProxy.getPaciente(id).subscribe(data => {
      const tmp = data[0];

      tmp.fecha_aplicacion = {
        day: new Date(tmp.fecha_aplicacion).getDate(),
        month: new Date(tmp.fecha_aplicacion).getMonth() + 1,
        year: new Date(tmp.fecha_aplicacion).getFullYear()
      };

      this.paciente = tmp;
      // console.log(this.paciente);

      setTimeout(() => {
        this.volumenes = this.paciente.volumenes || [];
      }, 0);

      this.formPaciente = this.buildForm(
        this.formPaciente,
        this._pacienteGroup
      );
      this.isNew = false;
    });
  }

  updateCITV(e) {
    this.gtvs[e.uid] = e.val;
    this.citv = 0;

    const keys = Object.getOwnPropertyNames(this.gtvs);
    for (let i = 0; i < keys.length; i++) {
      this.citv = this.citv + this.gtvs[keys[i]];
    }


    setTimeout(() => {
      this.formPaciente.get('citv').setValue(this.citv);
      this.paciente['citv'] = this.citv;
    }, 0);
  }

  addDiagnostico(d, i) {
    let index = -1;
    for (let x = 0; x < this.diagnosticos.length; x++) {
      if (this.diagnosticos[x].diagnostico_id === d.diagnostico_id) {
        index = +x;
      }
    }

    const temp = this.diagnosticos;
    this.diagnosticos = [];
    this.filterDiags = '';
    temp.splice(index, 1);
    setTimeout(() => {
      this.diagnosticos = temp;
      this.diagnosticos_seleccionados.push(d);
    }, 0);
  }

  removeDiagnostico(d, i) {
    this.diagnosticos_seleccionados.splice(i, 1);
    this.diagnosticos.push(d);
    const temp = this.diagnosticos;
    this.diagnosticos = [];
    setTimeout(() => {
      this.diagnosticos = temp;
    }, 0);
  }

  getDiagnosticosTitulo() {
    let _diags = '';
    for (let i = 0; i < this.diagnosticos_seleccionados.length; i++) {
      _diags = _diags + ' - ' + this.diagnosticos_seleccionados[i].nombre;
    }

    return _diags;
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

    if (this.id === '0' || !this.paciente) {
      form.setValue({
        nombre: '',
        apellido: '',
        hc: '',
        edad: 0,
        sexo: '1',
        rpa: '1',
        citv: '0',
        radioterapia: false,
        radioterapia_descr: '',
        cirugia_previa: false,
        fecha_aplicacion: null,
        sistema_inmobilizacion: '0',
        diagnostico: []
      });

      this.paciente.oar = [{}];
      this.paciente.seguimiento = [{}];
    } else {
      form.setValue({
        nombre: this.paciente.nombre || '',
        apellido: this.paciente.apellido || '',
        hc: this.paciente.hc || '',
        edad: this.paciente.edad || 0,
        sexo: '' + this.paciente.sexo || '1',
        rpa: '' + this.paciente.rpa || '1',
        citv: this.paciente.citv || '0',
        radioterapia: this.paciente.radioterapia || false,
        radioterapia_descr: this.paciente.radioterapia_descr || '',
        cirugia_previa: this.paciente.cirugia_previa || false,
        fecha_aplicacion: this.paciente.fecha_aplicacion || '',
        sistema_inmobilizacion: '' + this.paciente.sistema_inmobilizacion || 0,
        diagnostico: []
      });

      // form.get('fecha_aplicacion').setValue('2011-01-01');

      const diags = this.paciente.diagnosticos
        ? this.paciente.diagnosticos.split(',')
        : [];
      const toRemove = {};
      const digas_left = [];

      for (let i = 0; i < diags.length; i++) {
        for (let x = 0; x < this.diagnosticos.length; x++) {
          if (diags[i] === '' + this.diagnosticos[x].diagnostico_id) {
            this.diagnosticos_seleccionados.push(this.diagnosticos[x]);
            toRemove[this.diagnosticos[x].diagnostico_id] = true;
          }
        }
      }

      for (let i = 0; i < this.diagnosticos.length; i++) {
        if (!toRemove[this.diagnosticos[i].diagnostico_id]) {
          digas_left.push(this.diagnosticos[i]);
        }
      }

      this.diagnosticos = digas_left;

      setTimeout(() => {
        if (!this._keepOpen) {
          this.open = false;
        }

        // this.coreService.setLoadingStatus(false);
      }, 0);
    }

    return form;
  }

  nuevoVolumen() {
    const newId = this.generateVolumenId();
    for (let i = 0; i < this.volumenes.length; i++) {
      if (newId === this.volumenes[i].volumen_id) {
        this.nuevoVolumen();
      }
    }

    this.volumenService.setCantVolumenes(1);

    this.volumenes.push({
      new: true,
      volumen_id: newId
    });
  }

  generateVolumenId(): number {
    return Math.floor(Math.random() * Math.floor(1000));
  }

  eliminarVolumen(e) {
    // console.log(e);

    if (this.volumenes.length > 0) {
      this.volumesToRemove.push(e);
      let toRemove = -1;
      for (let i = 0; i < this.volumenes.length; i++) {
        if (this.volumenes[i].volumen_id === e) {
          toRemove = +i;
        }
      }
      this.volumenService.setCantVolumenes(-1);
      // Eliminar volumen, avisar al compoente

      this.volumenes.splice(toRemove, 1);
    }
  }

  switchValue(e, obj) {
    this.paciente[obj] = e;
    // console.log(this.paciente);
  }

  save() {
    this._savingButton = true;

    if (this.formPaciente.invalid) {
      // this.coreService.setToast(
      //   'error',
      //   'Campos obligatorios',
      //   'Por favor complete todos los campos obligatorios'
      // );
      return;
    }

    const paciente = {
      nombre: this.formPaciente.get('nombre').value,
      apellido: this.formPaciente.get('apellido').value,
      edad: this.formPaciente.get('edad').value,
      sexo: this.formPaciente.get('sexo').value,
      rpa: this.formPaciente.get('rpa').value,
      citv: this.formPaciente.get('citv').value,
      hc: this.formPaciente.get('hc').value,
      radioterapia: this.paciente['radioterapia'] || 0,
      radioterapia_descr: this.formPaciente.get('radioterapia_descr').value,
      cirugia_previa: this.paciente['cirugia_previa'] || 0,
      fecha_aplicacion: this.formPaciente.get('fecha_aplicacion').value,
      sistema_inmobilizacion: this.formPaciente.get('sistema_inmobilizacion')
        .value,
      diagnosticos: {}
    };

    // console.log(paciente);
    // return;

    const diagnosticos = [];

    for (let i = 0; i < this.diagnosticos_seleccionados.length; i++) {
      diagnosticos.push(this.diagnosticos_seleccionados[i].diagnostico_id);
    }

    paciente.diagnosticos = diagnosticos;

    this._paciente = paciente;

    // Volúmenes
    if (this.volumenes.length > 0) {
      for (let i = 0; i < this.volumenes.length; i++) {
        this.volumenes[i]['salvado'] = false;
      }
    }

    if (this.volumenes.length > 0) {
      this.volumenService.onSaveVolumen();
    } else {
      this.oarService.onUpdateOAR(this._paciente);
    }

    const sub = this.volumenService.saveConfirmVolumen.subscribe(v => {
      // console.log('volumen', v);

      let volumenesSalvados = true;

      for (let i = 0; i < this.volumenes.length; i++) {
        if (v.volumen_id === this.volumenes[i].volumen_id) {
          this.volumenes[i]['salvado'] = true;
          if (!this._paciente.volumenes) {
            this._paciente.volumenes = [];
            this._paciente.volumenes.push(v);
          } else {
            let encontrado = false;
            for (let x = 0; x < this._paciente.volumenes.length; x++) {
              if (this._paciente.volumenes[x].volumen_id === v.volumen_id) {
                encontrado = true;
              }
            }

            if (!encontrado) {
              this._paciente.volumenes.push(v);
            }
          }

        }
      }

      // console.log('volumenes', this.volumenes);

      for (let i = 0; i < this.volumenes.length; i++) {
        if (!this.volumenes[i]['salvado']) {
          volumenesSalvados = false;
        }
      }

      // console.log('pre OAR', this._paciente);

      // Cuando todos los volúmenes están salvados, hago agrego el OAR al objeto de paciente, y después hago un
      // update con todo, los volúmenes y el oar
      if (volumenesSalvados) {
        // this.saveEnd();

        this.oarService.onUpdateOAR(this._paciente);
        sub.unsubscribe();
      }
    });

    // OAR
    const oarSubs = this.oarService.updatedOAR.subscribe(data => {
      this._paciente = data;
      oarSubs.unsubscribe();
      if (this.id === '0') {
        this.create(paciente);
      } else {
        this.update(paciente);
      }
    });
  }

  create(paciente) {
    //console.log(paciente);
    this.rxcxProxy.createPaciente(paciente).subscribe(r => {
      this.coreService.setToast({
        type: 'success',
        title: 'Creación',
        body: 'Paciente creado con éxito'
      });
      this.location.go('/paciente/' + r);
      this.id = undefined;
      console.log(r);

      setTimeout(() => {
        this.id = r;
        this.getData(r);
      }, 1000);
    });

    // this.afs
    //   .collection('pacientes')
    //   .add(paciente)
    //   .then(data => {
    //     this._paciente = paciente;
    //     this._id = data.id;
    //     if (this.volumenes.length > 0) {
    //       this.saveVolumen(data.id);
    //     } else {
    //       this.oarService.onUpdateOAR(this._paciente);
    //       // this.saveEnd();
    //     }
    //   })
    //   .catch(err => {
    //     this.logger.log('Error al crear paciente', err);
    //   });
  }

  update(paciente) {
    // console.log('update');
    paciente.paciente_id = this.id;

    console.log(paciente);

    this.rxcxProxy.updatePaciente(paciente).subscribe(r => {
      this.coreService.setToast({
        type: 'success',
        title: 'Update',
        body: 'Paciente modificado con éxito'
      });
      this.getData();
    });
  }

  volver() {
    this.exists = false;
    this.router.navigate(['/pacientes']);
  }

  ngOnDestroy() {
    this.formPaciente = null;
    this._id = '';
    this.id = '';
    this.volumenes = [];
  }
}
