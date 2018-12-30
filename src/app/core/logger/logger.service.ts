import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { CoreService } from '../core.service';

@Injectable()
export class Logger {
  static to: string = '';

  constructor(private coreService: CoreService) {
    // this.afs.firestore.settings({ timestampsInSnapshots: true });
  }

  log(title, content) {
    // this.coreService.setToast('error', title, content.message);
    console.log(content);

    setTimeout(() => {
    //   this.afs
    //     .collection('logs')
    //     .add({
    //       title: title,
    //       error: content.message,
    //       fecha: firebase.firestore.FieldValue.serverTimestamp()
    //     })
    //     .then(data => {
    //       console.log(data);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    }, 0);
  }
}
