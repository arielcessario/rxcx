import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Logger } from '../../core/logger/logger.service';
import { TableDropdownComponent } from '../../shared/table-dropdown/table-dropdown.component';
import { CoreProxies } from 'ac-core';

@Component({
  selector: 'rxc-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  private _this: any;

  settings = {
    actions: {
      add: false,
      edit: false,
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
      cancelButtonContent: '<i class="nb-close"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      // uid: {
      //   title: 'Id',
      //   type: 'string',
      // },
      nombre: {
        title: 'Nombre',
        type: 'string'
      },
      apellido: {
        title: 'Apellido',
        type: 'string'
      },
      mail: {
        title: 'E-mail',
        type: 'string'
      },
      rol_id: {
        title: 'Rol',
        type: 'custom',
        renderComponent: TableDropdownComponent,
        onComponentInitFunction(instance) {
          console.log(instance);

          instance.save.subscribe(row => {
            console.log(instance);
            console.log(row);
          });
        }
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  collection$: any;

  constructor(private logger: Logger, private coreService: CoreProxies) {
    // const data = this.service.getData();
    // this.source.load(data);
  }

  ngOnInit() {
    this.coreService.getAllUsers().subscribe(usuarios => {
      this.source.load(usuarios);
    });
  }

  ngOnDestroy() {
    // this.collection$.unsubscribe();
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event): void {
    // console.log(event);
  }

  updateProfile(r) {
    console.log(r);
  }
}
