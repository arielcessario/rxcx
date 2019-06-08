import { Router } from '@angular/router';
import { Logger } from './../core/logger/logger.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { RxCxProxy } from 'rxcx-core';

@Component({
  selector: 'rxc-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
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
      apellido: {
        title: 'Apellido',
        type: 'string'
      },
      nombre: {
        title: 'Nombre',
        type: 'string'
      },
      hc: {
        title: 'HC',
        type: 'string'
      },
      diagnosticos: {
        title: 'Diagnosticos',
        type: 'string'
      }
    }
  };

  allPatients: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private router: Router,
    private logger: Logger,
    private rxcxProxy: RxCxProxy
  ) {
    // const data = this.service.getData();
    // this.source.load(data);
  }

  ngOnInit() {
    this.rxcxProxy.getPacientes().subscribe(data => {
      // console.log(data);
      this.source.load(data);
      // this.source.setPaging(1, 10, true);
    });
    // this.afs.firestore.settings({ timestampsInSnapshots: true });
    // const collection: AngularFirestoreCollection<any> = this.afs.collection(
    //   'pacientes'
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
    //       const res = data.map(d => {
    //         let diags = '';

    //         const diagsIndex = Object.getOwnPropertyNames(d['diagnosticos']);
    //         for (let i = 0; i < diagsIndex.length; i++) {
    //           diags = diags + d['diagnosticos'][diagsIndex[i]] + ', ';
    //         }
    //         diags = diags.substr(0, diags.length - 2);

    //         return { diags, ...d };
    //       });

    //       this.source.load(res);
    //       // console.log(res);
    //       this.allPatients = res;
    //     },
    //     err => {
    //       this.logger.log('Error al obtener usuarios', err);
    //     }
    //   );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {

      console.log(event);

      this.rxcxProxy.deletePaciente(event.data.paciente_id).subscribe((r) => {
        console.log(r);
        this.rxcxProxy.getPacientes().subscribe(data => {
          this.source.load(data);
        });
      }, (e) => {
        console.log(e);

      })
      // event.confirm.resolve();
      // console.log(event.data.uid);
      // this.afs
      //   .collection('pacientes')
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
    this.router.navigate(['/paciente', event.data.paciente_id]);

    // this.firebaseAuth.auth.u

    // this.afs()
    // console.log(event);
  }

  create() {
    this.router.navigate(['/paciente', 0]);
    // console.log('hola');
  }

  getDiagnosticos() { }

  export(): void {
    /* generate worksheet */
    const list = [];
    list.push([
      'HC',
      'Nombre',
      'Apellido',
      'Cirugia Previa',
      'citv',
      'Diagnosticos',
      'Edad',
      'Fecha Aplicación',
      'oar',
      'radioterapiaprevia',
      'radioterapiapreviadescr',
      'rpa',
      'seguimientoImagenologico3M',
      'seguimientoImagenologico3MDescr',
      'seguimientoImagenologico6M',
      'seguimientoImagenologico6MDescr',
      'seguimientoImagenologico12M',
      'seguimientoImagenologico12MDescr',
      'sexo',
      'sistemainmobilizacion',
      'toxicidadAguda',
      'toxicidadAgudaDescr',
      'toxicidadCronica',
      'toxicidadCronicaDescr'
    ]);
    for (let i = 0; i < this.allPatients.length; i++) {
      list.push([
        this.allPatients[i].hc,
        this.allPatients[i].nombre,
        this.allPatients[i].apellido,
        this.allPatients[i].cirugiaprevia,
        this.allPatients[i].citv,
        this.allPatients[i].diags,
        this.allPatients[i].edad,
        this.allPatients[i].fechaaplicacion.day +
        '-' +
        this.allPatients[i].fechaaplicacion.month +
        '-' +
        this.allPatients[i].fechaaplicacion.year,
        this.allPatients[i].oar,
        this.allPatients[i].radioterapiaprevia,
        this.allPatients[i].radioterapiapreviadescr,
        this.allPatients[i].rpa,
        this.allPatients[i].seguimientoImagenologico3M,
        this.allPatients[i].seguimientoImagenologico3MDescr,
        this.allPatients[i].seguimientoImagenologico6M,
        this.allPatients[i].seguimientoImagenologico6MDescr,
        this.allPatients[i].seguimientoImagenologico12M,
        this.allPatients[i].seguimientoImagenologico12MDescr,
        this.allPatients[i].sexo,
        this.allPatients[i].sistemainmobilizacion,
        this.allPatients[i].toxicidadAguda,
        this.allPatients[i].toxicidadAgudaDescr,
        this.allPatients[i].toxicidadCronica,
        this.allPatients[i].toxicidadCronicaDescr
      ]);
    }

    console.log(list);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(list);

    console.log(ws);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    console.log(wb);
    /* save to file */
    XLSX.writeFile(wb, 'test.xlsx');
  }
}
