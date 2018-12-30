import { CoreProxies, CoreService } from 'ac-core';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

export enum Roles {
  Bloqueado = 0,
  Recepcion = 1,
  Medico = 4,
  Administrador = 7
}

export enum RolesDescripciones {
  Bloqueado = 'Bloqueado',
  Recepcion = 'Recepción',
  Medico = 'Médico',
  Administrador = 'Administrador'
}

@Component({
  selector: 'table-dropdown',
  templateUrl: './table-dropdown.component.html',
  styleUrls: ['./table-dropdown.component.scss']
})
export class TableDropdownComponent implements ViewCell, OnInit {
  renderValue: string;
  @Input() value: number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  roles = Roles;
  _id: number = Math.round(Math.random() * 1000);
  rol = 1;

  constructor(
    private coreProxy: CoreProxies,
    private coreService: CoreService
  ) {}

  ngOnInit() {
    this.rol = this.value;
  }

  onClick() {}

  updateRol() {
    this.rowData.rol = this.rol;

    this.coreProxy
      .updateRol({
        usuario_id: this.rowData.usuario_id,
        rol_id: this.rol
      })
      .subscribe(r => {
        console.log(r);
        this.coreService.setToast({
          type: 'success',
          title: 'Modificar Usuarios',
          body: 'Los datos han sido guardados'
        });
      });
  }
}
