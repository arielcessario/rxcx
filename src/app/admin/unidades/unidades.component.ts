import { LocalDataSource } from 'ng2-smart-table';
import { Logger } from './../../core/logger/logger.service';
import { CoreService } from './../../core/core.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.scss']
})
export class UnidadesComponent implements OnInit {
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
  constructor(
    private coreService: CoreService,
    private logger: Logger
  ) {}

  ngOnInit() {
    // this.afs.firestore.settings({ timestampsInSnapshots: true });
    // const collection: AngularFirestoreCollection<any> = this.afs.collection(
    //   'unidades'
    // );

    // const collection$ = collection
    //   .snapshotChanges()
    //   .map(actions => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data();
    //       const uid = a.payload.doc.id;
    //       return { uid, ...data };
    //     });
    //   })
    //   .subscribe(
    //     data => {
    //       data.map(a => {
    //         // a['nombre'] = Object.getOwnPropertyNames(a)[1];
    //         return a;
    //       });
    //       this.source.load(data);
    //     },
    //     err => {
    //       this.logger.log('Error al obtener unidades', err);
    //     }
    //   );
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
    obj['nombre'] = _key;

    // this.afs
    //   .collection('unidades')
    //   .add(obj)
    //   .then(data => {
    //     this.coreService.setToast(
    //       'success',
    //       'Nueva Unidad',
    //       'Los datos han sido guardados'
    //     );
    //   })
    //   .catch(err => {
    //     this.logger.log('Error al crear unidad', err);
    //   });
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
    obj['nombre'] = _key;

    // this.afs
    //   .collection('unidades')
    //   .doc(e.newData.uid)
    //   .set(obj)
    //   .then(data => {
    //     this.coreService.setToast(
    //       'success',
    //       'Modificar Unidad',
    //       'Los datos han sido guardados'
    //     );
    //   })
    //   .catch(err => {
    //     this.logger.log('Error al modificar unidad', err);
    //   });
  }
}
