import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class OarService {
  public updateOAR: Subject<any> = new Subject<any>();
  public updatedOAR: Subject<any> = new Subject<any>();
  constructor() {}

  public onUpdateOAR(p) {
    this.updateOAR.next(p);
  }

  public onUpdatedOAR(v) {
    this.updatedOAR.next(v);
  }
}
