import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { CoreService } from 'ac-core';
import { Logger } from '../logger/logger.service';

@Injectable()
export class AuthService {
  user: Observable<any>;
  public getLoginStatus: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private coreService: CoreService,
    private logger: Logger
  ) {
    // this.user = firebaseAuth.authState;
  }

  signup(email: string, password: string) {
    console.log(email, password);
    // this.firebaseAuth.auth
    //   .createUserWithEmailAndPassword(email, password)
    //   .then(value => {
    //     console.log('Success!', value);
    //     this.setUserData(value);
    //   })
    //   .catch(err => {
    //     console.log('Something went wrong:', err);
    //     this.logger.log('Error al crear usuario', err);
    //   });
  }

  login(email: string, password: string) {
    // this.firebaseAuth.auth
    //   .signInWithEmailAndPassword(email, password)
    //   .then(value => {
    //     // console.log('Success!', value);
    //     this.router.navigate(['/main']);
    //     this.coreService.refreshLoginStatus();
    //   })
    //   .catch(err => {
    //     console.log('Something went wrong:', err);
    //     this.logger.log('Error al ingresar', err);
    //   });
  }

  loginGoogle() {
    // this.firebaseAuth.auth
    //   .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    //   .then(value => {
    //     // console.log('Success!', value);
    //     if (value.additionalUserInfo.isNewUser) {
    //       this.setUserData(value);
    //     } else {
    //       this.router.navigate(['/main']);
    //       this.coreService.refreshLoginStatus();
    //     }
    //   })
    //   .catch(err => {
    //     console.log('Something went wrong:', err);
    //     this.logger.log('Error al usar login con Google', err);
    //   });
  }

  logout() {
    // this.firebaseAuth.auth.signOut();

    this.router.navigate(['/login']);
    // this.coreService.refreshLoginStatus();
  }

  setUserData(value: any) {
    let uid = '';
    if (value.user === undefined) {
      uid = value.uid;
    } else {
      uid = value.user.uid;
    }

    // this.afs
    //   .collection('users')
    //   .doc(uid)
    //   .set({
    //     email: value.user === undefined ? value.email : value.user.email,
    //     displayName:
    //       value.user === undefined ? value.displayName : value.user.displayName,
    //     photoURL:
    //       value.user === undefined ? value.photoURL : value.user.photoURL,
    //     rol: 0
    //   })
    //   .then(data => {
    //     console.log(data);
    //     setTimeout(() => {
    //       this.coreService.refreshLoginStatus();
    //       this.router.navigate(['/main']);
    //     }, 100);
    //     // subs.unsubscribe();
    //   })
    //   .catch(data => {
    //     console.log(data);
    //     const user = firebase.auth().currentUser;
    //     this.logger.log('Error al crear usuario', data.message);
    //     user
    //       .delete()
    //       .then(function() {
    //         // console.log('chau usuario');
    //       })
    //       .catch(function(err) {
    //         console.log(err);
    //         this.logger.log('Error al eliminar usuario', err);
    //       });
    //     // console.log(data);
    //     // subs.unsubscribe();
    //     this.logout();
    //   });
  }
}
// match /databases/{database}/documents {
//   match /{document=**} {
//     allow read, write;
//   }
// }
// match /users {
// All data is writable; nobody can read it
// allow write: if (request.resource.data.rol >= 1 || get(/documents/users[(request.auth.uid)]).rol == 0) ||
// (request.auth != null && get(/documents/users[(request.auth.uid)]).rol == 0) ||
// (request.auth != null && get(/documents/users[(request.auth.uid)]) == request.auth.uid);
// Technically, this line isn't necessary, but it's a useful way
// of making your intentions known.
// allow read: if false;
// }

// console.log(uid);
// let subs = this.afs.collection('users').doc(uid).ref.get().then((data) => {
//   console.log(data);
//   if (!data.exists) {
//     this.afs.collection('users').doc(uid).set({
//       email: (value.user === undefined) ? value.email : value.user.email,
//       displayName: (value.user === undefined) ? value.displayName : value.user.displayName,
//       photoURL: (value.user === undefined) ? value.photoURL : value.user.photoURL,
//       rol: 1
//     })
//       .then((data) => {
//         setTimeout(() => {
//           this.coreService.refreshLoginStatus();
//           this.router.navigate(['/main']);
//         }, 100);
//         // subs.unsubscribe();
//       })
//       .catch((data) => {
//         var user = firebase.auth().currentUser;
//         this.logger.log('Error al crear usuario', data.message);
//         user.delete().then(function () {
//           // console.log('chau usuario');
//         }).catch(function (err) {
//           console.log(err);
//           this.logger.log('Error al eliminar usuario', err);
//         });
//         // console.log(data);
//         // subs.unsubscribe();
//         this.logout();
//       });
//   } else {
//     setTimeout(() => {
//       this.coreService.refreshLoginStatus();
//       this.router.navigate(['/main']);
//     }, 100);
//     // subs.unsubscribe();
//   }
// })
// .catch((err)=>{
//   console.log(err);
//   this.logger.log('Error al leer usuario', err);
// })
// upsert<T>(ref: DocPredicate<T>, data: any) {
//   const doc = this.doc(ref).snapshotChanges().take(1).toPromise()
//   return doc.then(snap => {
//     return snap.payload.exists ? this.update(ref, data) : this.set(ref, data)
//   })
// }
