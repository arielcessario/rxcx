import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CoreService {
  public getVolumen: Subject<any> = new Subject<any>();
  public onReturnVolumen: Subject<any> = new Subject<any>();
  public getOar: Subject<any> = new Subject<any>();
  public onReturnOar: Subject<any> = new Subject<any>();

  constructor() {}

  public setVolumen() {
    this.getVolumen.next();
  }

  public returnVolumen(v) {
    this.onReturnVolumen.next(v);
  }

  public setOar() {
    this.getOar.next();
  }

  public returnOar(o) {
    this.onReturnOar.next(o);
  }
}
