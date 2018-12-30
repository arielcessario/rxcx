import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Logger } from './../../core/logger/logger.service';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { resolve } from 'dns';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.scss']
})
export class DiagnosticoComponent implements OnInit {
  diagnosticos = [];
  selectedDiagnostico = { nombre: 'Seleccionar un Diagnóstico' };
  constructor(private router: Router, private logger: Logger) {}

  ngOnInit() {
    // this.afs.firestore.settings({ timestampsInSnapshots: true });
    // this.afs
    //   .collection('diagnosticos')
    //   .snapshotChanges()
    //   .map(actions => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data();
    //       const uid = a.payload.doc.id;
    //       const nombre = Object.getOwnPropertyNames(a.payload.doc.data())[0];
    //       return { uid, nombre, ...data };
    //     });
    //   })
    //   .subscribe(data => {
    //     this.diagnosticos = data;
    //     this.selectedDiagnostico = data[0];
    //   });
  }

  export(data): void {
    /* generate worksheet */

    // console.log(data);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    // console.log(ws);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // console.log(wb);
    /* save to file */
    XLSX.writeFile(wb, 'test.xlsx');
  }

  generarReporte() {
    const reportData = [];
    const volumenes = [];

    const key = 'diagnosticos.' + this.selectedDiagnostico['uid'];

    console.log(key);
    // const collection: AngularFirestoreCollection<any> = this.afs.collection(
    //   'pacientes',
    //   ref => {
    //     return ref.where(key, '>', '');
    //   }
    // );

    // collection
    //   .snapshotChanges()
    //   .map(actions => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data();
    //       const uid = a.payload.doc.id;
    //       return { uid, ...data };
    //     });
    //   })
    //   .subscribe(a => {
    //     for (let i = 0; i < a.length; i++) {
    //       reportData.push(['Nombre', a[i]['nombre'] + ' ' + a[i]['apellido']]);
    //       reportData.push(['HC', a[i]['hc']]);
    //       reportData.push([
    //         'Cirugia Previa',
    //         a[i]['cirugiaprevia'] ? 'Si' : 'No'
    //       ]);

    //       if (a[i]['volumenes']) {
    //         const volKeys = Object.getOwnPropertyNames(a[i]['volumenes']);
    //         reportData.push([
    //           'Colimador',
    //           'Volúmen PTV (cc)',
    //           'V100',
    //           'Prescripcion en %',
    //           'V50',
    //           'Dosis Total Gy',
    //           'Dosis Fracción Gy',
    //           'Dosis Máxima Gy',
    //           'V12 Cerebro',
    //           'V20 Cerebro',
    //           'GTV (cc)',
    //           'Cantidad de Fracciones',
    //           'Indice de Homogeneidad',
    //           'Indice de Conformidad',
    //           'Indice de Gradiente',
    //           'Indice de Conformidad Paddick',
    //           'UM',
    //           'Técnica'
    //         ]);
    //         for (const k in volKeys) {
    //           if (volKeys[k]) {
    //             volumenes.push(volKeys[k]);
    //             reportData.push(volKeys[k]);
    //           }
    //         }
    //         reportData.push([]);
    //         reportData.push([]);
    //       }
    //     }

    //     const cantVolumenes = volumenes.length;
    //     let cantVolumenesContados = 0;

    //     for (let kk = 0; kk < volumenes.length; kk++) {
    //       if (volumenes[kk]) {
    //         // this.afs
    //         //   .collection('volumenes')
    //         //   .doc(volumenes[kk])
    //         //   .valueChanges()
    //         //   .subscribe(vol => {
    //         //     cantVolumenesContados = cantVolumenesContados + 1;
    //         //     for (let i = 0; i < reportData.length; i++) {
    //         //       if (volumenes[kk] === reportData[i]) {
    //         //         reportData[i] = [
    //         //           vol['colimador'],
    //         //           vol['volumenPTV'],
    //         //           vol['volumenIsodosisPrescripcion'],
    //         //           vol['volumenIsodosisPrescripcionPorc'],
    //         //           vol['volumenIsodosis50'],
    //         //           vol['dosisTotalGy'],
    //         //           vol['dosisFraccionGy'],
    //         //           vol['dosisMaximaGy'],
    //         //           vol['v12'],
    //         //           vol['v20'],
    //         //           vol['GTV'],
    //         //           vol['cantidadFracciones'],
    //         //           vol['indiceHomogeneidad'],
    //         //           vol['indiceConformidad'],
    //         //           vol['indiceGradiente'],
    //         //           vol['indicePaddick'],
    //         //           vol['um'],
    //         //           vol['tecnica'] === '0' ? '3D' : 'VMAT'
    //         //         ];
    //         //       }
    //         //     }
    //         //     if (cantVolumenes === cantVolumenesContados) {
    //         //       this.export(reportData);
    //         //     }
    //         //   });
    //       }
    //     }
    //     // this.export(reportData);
    //   });
  }
}
