import { RxCxProxy } from 'rxcx-core';
import { CoreService } from 'ac-core';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rxc-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss']
})
export class EndpointsComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  settings = {
    pager: {display: true},
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

  patientsTotal = 0;
  patientsPerPage = [];
  upToPatients = 0;
  upToPatientsBegining = 0;

  constructor(private coreService: CoreService, private rxcxProxy: RxCxProxy) {}

  ngOnInit() {
    this.rxcxProxy.getEndpoints().subscribe(data => {
      this.patientsTotal = data.length;
      this.source.load(data);
      const patientsArray = [];
      let patientsAccessory = 0;

      this.source.getElements().then(function(value) {
        patientsAccessory = value.length;
        patientsArray.push(patientsAccessory);
      });

      this.patientsPerPage = patientsArray;
      this.settings.pager.display = true;

      this.source.onChanged().subscribe(e => {
        setTimeout(() => {
          const upToPatientsAccesory = (this.source.getPaging().page) * (this.source.getPaging().perPage);

          if (upToPatientsAccesory > this.patientsTotal) {
            this.upToPatients = this.patientsTotal;
            this.upToPatientsBegining = upToPatientsAccesory - this.source.getPaging().perPage + 1;
          } else {
            this.upToPatients = upToPatientsAccesory;
            this.upToPatientsBegining = this.upToPatients - this.source.getPaging().perPage + 1;
          }
        });
      });

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

    this.rxcxProxy.createEndpoint({ nombre: e.newData.nombre }).subscribe(r => {
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
      .updateEndpoint({
        endpoint_id: e.newData.endpoint_id,
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
