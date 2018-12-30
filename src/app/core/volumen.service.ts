import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class VolumenService {
  public saveVolumen: Subject<any> = new Subject<any>();
  public saveConfirmVolumen: Subject<any> = new Subject<any>();
  public calcFracciones: Subject<any> = new Subject<any>();
  public returnCantVolumenes: Subject<any> = new Subject<any>();
  public cantVolumenes: Subject<any> = new Subject<any>();
  private _cantVolumenes = 0;
  constructor() {}

  public onSaveVolumen() {
    this.saveVolumen.next();
  }

  public onSaveConfirmVolumen(v) {
    this.saveConfirmVolumen.next(v);
  }

  public onCalcFracciones(v) {
    this.calcFracciones.next(v);
  }

  public getCantVolumenes(): number {
    return this._cantVolumenes;
  }

  public setCantVolumenes(c) {
    this._cantVolumenes = this._cantVolumenes + c;
  }
}
