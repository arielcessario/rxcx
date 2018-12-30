import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CoreService } from 'ac-core';
import { Logger } from '../core/logger/logger.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  constructor(
    private router: Router,
    private coreService: CoreService,
    private logger: Logger
  ) {}

  formPerfil: FormGroup;
  private fb: FormBuilder;
  current= 1;

  // Login Form
  public email: string;
  public displayName: string;
  public password: string;

  ngOnInit() {
    // this.afs.firestore.settings({ timestampsInSnapshots: true });

    // console.log(this.firebaseAuth.auth.currentUser);
    this.formPerfil = this.buildForm(this.formPerfil);
  }

  buildForm(form: FormGroup): FormGroup {
    this.fb = new FormBuilder();
    form = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      displayName: [
        this.displayName,
        [Validators.required, Validators.minLength(4)]
      ],
      password: [this.password]
    });

    form.valueChanges.subscribe(data =>
      this.coreService.onValueChanged(
        data,
        form,
        this.formErrors,
        this.validationMessages
      )
    );

    this.coreService.onValueChanged(); // (re)set validation messages now);

    // form.setValue({
    //   email: this.firebaseAuth.auth.currentUser.email,
    //   displayName: this.firebaseAuth.auth.currentUser.displayName,
    //   password: ''
    // });

    return form;
  }

  update() {
    if (this.formPerfil.invalid) {
      // this.coreService.setToast(
      //   'error',
      //   'Datos Requeridos',
      //   'Por favor complete todos los campos requeridos'
      // );
      return;
    }

    // this.firebaseAuth.auth.currentUser
    //   .updateProfile({
    //     displayName: this.formPerfil.get('displayName').value,
    //     photoURL: this.firebaseAuth.auth.currentUser.photoURL
    //   })
    //   .then(data => {
    //     console.log(data);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });

    if (this.formPerfil.get('password').value !== '') {
      // this.firebaseAuth.auth.currentUser.updatePassword(
      //   this.formPerfil.get('password').value
      // );
    }

    // const userRef: AngularFirestoreDocument<any> = this.afs
    //   .collection('users')
    //   .doc(this.firebaseAuth.auth.currentUser.uid);

    // let subs = userRef
    //   .valueChanges()
    //   // .catch((e, c) => {
    //   //   console.log(e);
    //   //   console.log(c);
    //   //   subs.unsubscribe
    //   //   return c;
    //   // })
    //   .subscribe((u: any) => {
    //     // console.log(u);
    //     const data = {
    //       uid: this.firebaseAuth.auth.currentUser.uid,
    //       email: this.formPerfil.get('email').value,
    //       displayName: this.formPerfil.get('displayName').value,
    //       photoURL: this.firebaseAuth.auth.currentUser.photoURL,
    //       rol: u.rol
    //     };
    //     subs.unsubscribe();
    //     userRef
    //       .update(data)
    //       .then(data => {
    //         // console.log(data);
    //         this.coreService.setToast(
    //           'success',
    //           'Datos Guardados',
    //           'Los datos han sido actualizados'
    //         );
    //         this.coreService.refreshLoginStatus();
    //       })
    //       .catch(err => {
    //         // console.log(err);
    //         this.logger.log('Error al Actualizar Perfil', err);
    //       });
    //   });
  }

  formErrors = {
    email: '',
    displayName: '',
    password: ''
  };
  validationMessages = {
    displayName: {
      required: 'Requerido',
      minlength: 'Mínimo 3 letras',
      maxlength: 'El nombre no puede tener mas de 24 letras'
    },
    email: {
      required: 'Power is required.',
      maxlength: 'Sismbolo tiene que tener un máximo de 3 letras'
    },
    password: {
      required: 'Debe ingresar un password',
      minlength: 'El password debe tener al menos seis (6) letras y/o números'
    }
  };
}
