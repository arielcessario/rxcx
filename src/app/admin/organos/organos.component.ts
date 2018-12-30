import { RxCxProxy } from 'rxcx-core';
import { LocalDataSource } from 'ng2-smart-table';
import { Logger } from './../../core/logger/logger.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'rxc-organos',
  templateUrl: './organos.component.html',
  styleUrls: ['./organos.component.scss']
})
export class OrganosComponent implements OnInit {
  settings = {
    mode: 'external',
    actions: {
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
      confirmEdit: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      nombre: {
        title: 'Órgano',
        type: 'string'
      }
    }
  };

  allPatients: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router, private rxcxProxy: RxCxProxy) {
    // const data = this.service.getData();
    // this.source.load(data);
  }

  ngOnInit() {
    this.rxcxProxy.getOrganos().subscribe(data => {
      this.source.load(data);
    });
    // this.afs.firestore.settings({ timestampsInSnapshots: true });
    // const collection: AngularFirestoreCollection<any> = this.afs.collection(
    //   'organos'
    // );
    // const collection$: Observable<any[]> = collection.snapshotChanges();
    // collection$
    // .map(a =>{
    //   return actions.map(a => {
    //     const data = a.payload.doc.data() as Shirt;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   });
    // })
    // ;
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
    //       console.log(data);
    //       this.source.load(data);
    //       // const res = data.map(d => {
    //       //   let diags = '';
    //       //   for (let i = 0; i < d['diagnosticos'].length; i++) {
    //       //     diags = diags + d['diagnosticos'][i] + ', ';
    //       //   }
    //       //   diags = diags.substr(0, diags.length - 2);
    //       //   return { diags, ...d };
    //       // });
    //       // this.source.load(res);
    //       // console.log(res);
    //       // this.allPatients = res;
    //     },
    //     err => {
    //       this.logger.log('Error al obtener usuarios', err);
    //     }
    //   );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      // event.confirm.resolve();
      // console.log(event.data.uid);
      // this.afs
      //   .collection('organos')
      //   .doc(event.data.uid)
      //   .delete()
      //   .then(s => {
      //     console.log(s);
      //   })
      //   .catch(e => {
      //     console.log(e);
      //   });
      // db.collection("cities").doc("DC").delete().then(function () {
      //   console.log("Document successfully deleted!");
      // }).catch(function (error) {
      //   console.error("Error removing document: ", error);
      // });
    } else {
      event.confirm.reject();
    }
  }

  update(event): void {
    console.log(event);
    this.router.navigate(['/organo', event.data.organo_id]);

    // this.firebaseAuth.auth.u

    // this.afs()
    console.log(event);
  }

  create() {
    this.router.navigate(['/organo', 0]);
    // console.log('hola');
  }
}
