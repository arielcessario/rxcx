import { RxCxProxy } from 'rxcx-core';
import { CoreService } from 'ac-core';
import { Logger } from './../../core/logger/logger.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rxc-diagnosticos',
  templateUrl: './diagnosticos.component.html',
  styleUrls: ['./diagnosticos.component.scss']
})
export class DiagnosticosComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  settings = {
    actions: {
      edit: true,
      delete: false
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      nombre: {
        title: 'Nombre',
        type: 'string'
      }
    }
  };
  constructor(private coreService: CoreService, private rxcxProxy: RxCxProxy) {}

  ngOnInit() {
    this.rxcxProxy.getDiagnosticos().subscribe(data => {
      this.source.load(data);
    });
  }

  create(e) {
    if (window.confirm('Desea Guardar los cambios?')) {
      e.confirm.resolve();
    } else {
      e.confirm.reject();
      return;
    }

    const _key = e.newData.nombre;
    const obj = {};
    obj[_key] = true;

    this.rxcxProxy
      .createDiagnostico({ nombre: e.newData.nombre })
      .subscribe(r => {
        this.coreService.setToast({
          type: 'success',
          title: 'Creación',
          body: 'Diagnóstico creado con éxito'
        });
      });
  }

  update(e) {
    if (window.confirm('Desea Guardar los cambios?')) {
      e.confirm.resolve();
    } else {
      e.confirm.reject();
      return;
    }

    const _key = e.newData.nombre;
    const obj = {};
    obj[_key] = true;

    this.rxcxProxy
      .updateDiagnostico({
        diagnostico_id: e.newData.diagnostico_id,
        nombre: e.newData.nombre
      })
      .subscribe(r => {
        this.coreService.setToast({
          type: 'success',
          title: 'Modificación',
          body: 'Diagnóstico modificado con éxito'
        });
      });
  }
}
