import { Router } from '@angular/router';
import { Logger } from './../../core/logger/logger.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit } from '@angular/core';
import { RxCxProxy } from 'rxcx-core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'rxc-definiciones',
  templateUrl: './definiciones.component.html',
  styleUrls: ['./definiciones.component.scss']
})
export class DefinicionesComponent implements OnInit {
  settings = {
    mode: 'external',
    actions: {
      delete: true
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
      confirmEdit: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      titulo: {
        title: 'Título',
        type: 'string'
      },
      imagenes: {
        title: 'Con Imágenes',
        type: 'html',
        valuePrepareFunction: (imagenes: number) => {
          let resp = '<i class="fa fa-times"></i>';
          if (imagenes > 0) {
            resp = '<i class="fa fa-image"></i>';
          }
          return resp;
        }
      }
    }
  };

  allPatients: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private router: Router,
    private rxcxProxy: RxCxProxy
  ) {}

  ngOnInit() {
    this.rxcxProxy.getDefiniciones().subscribe(definiciones => {
      this.source.load(definiciones);
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.rxcxProxy.deleteDefinicion(event.data.definicion_id).subscribe(
        () => {
          // event.confirm.resolve();
        },
        err => {
          // event.confirm.reject();
        }
      );
    } else {
      // event.confirm.reject();
    }
  }

  update(event): void {
    this.router.navigate(['/definicion', event.data.definicion_id]);
  }

  create() {
    this.router.navigate(['/definicion', 0]);
  }
}
