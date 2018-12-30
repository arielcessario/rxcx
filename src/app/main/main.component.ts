import { Router } from '@angular/router';
import { CoreService } from './../core/core.service';
import { Component, OnInit } from '@angular/core';
import { Logger } from '../core/logger/logger.service';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  pacientes: Array<any> = [];
  _3M: Array<any> = [];
  _6M: Array<any> = [];
  _9M: Array<any> = [];

  constructor(
    private logger: Logger,
    private router: Router,
    private coreService: CoreService
  ) {}

  ngOnInit() {
    // this.afs.firestore.settings({ timestampsInSnapshots: true });
    // let docRef = this.afs.collection('pacientes');
    // docRef.snapshotChanges().map(d => {
    //   return d.map(a => {
    //     const data = a.payload.doc.data();
    //     data.uid = a.payload.doc.id;
    //     return data;
    //   })
    // }).subscribe((d) => {
    //   let final: Array<any> = [];
    //   final.push(d.map((data) => {
    //     let _array = data;
    //     _array.name = Object.getOwnPropertyNames(data)[0];
    //     return _array;
    //   }));
    //   this.pacientes = final[0];
    //   this.checkFechas();
    // })
  }

  checkFechas() {
    for (var i in this.pacientes) {
      let fecha: Date = new Date(
        this.pacientes[i].fechaaplicacion.year,
        this.pacientes[i].fechaaplicacion.month,
        this.pacientes[i].fechaaplicacion.day
      );

      var diff = Math.abs(new Date().getTime() - fecha.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

      if (diffDays >= 30 && diffDays < 60) {
        this._3M.push(this.pacientes[i]);
      } else if (diffDays >= 60 && diffDays < 270) {
        this._6M.push(this.pacientes[i]);
      } else if (diffDays >= 270) {
        this._9M.push(this.pacientes[i]);
      }
    }
  }

  goToPaciente(uid) {
    this.router.navigate(['/paciente', uid]);
  }
}
