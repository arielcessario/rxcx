import { RxCxProxy } from 'rxcx-core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Logger } from './../../core/logger/logger.service';
import { CoreService } from 'ac-core';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'rxc-definicion',
  templateUrl: './definicion.component.html',
  styleUrls: ['./definicion.component.scss']
})
export class DefinicionComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private fb: FormBuilder;

  // Nombres de las Imagenes
  _img01Name = 'no_image.png';
  _img02Name = 'no_image.png';
  _img03Name = 'no_image.png';
  _img04Name = 'no_image.png';
  _img05Name = 'no_image.png';
  _img06Name = 'no_image.png';
  _img07Name = 'no_image.png';
  _img08Name = 'no_image.png';

  images = [];

  imagesPath = environment.imagesPath;

  id = '0';
  _id = '0';

  titulo = '';
  descripcion = '';

  subs: any;

  _definicionGroup: any = {
    titulo: [this.titulo, [Validators.required, Validators.minLength(4)]],
    descripcion: [
      this.descripcion,
      [Validators.required, Validators.minLength(4)]
    ]
  };

  definicion: any = { uid: '0', titulo: '', descripcion: '', imagenes: [] };
  formErrors = {
    titulo: '',
    descripcion: ''
  };
  validationMessages = {
    titulo: {
      required: 'Requerido',
      minlength: 'Mínimo 3 letras',
      maxlength: 'El nombre no puede tener mas de 24 letras'
    },
    descripcion: {
      required: 'Power is required.',
      maxlength: 'Sismbolo tiene que tener un máximo de 3 letras'
    }
  };
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private coreService: CoreService,
    private rxcxProxy: RxCxProxy
  ) {}

  ngOnInit() {
    // Si tengo un id lo uso para buscar, en caso contrario, es un definicion vacío.
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id !== '0') {
        this._id = this.id;
        this.rxcxProxy.getDefinicion(this.id).subscribe(data => {
          this.definicion = data[0];
          this.definicion.titulo = decodeURIComponent(data[0].titulo);
          this.definicion.descripcion = decodeURIComponent(data[0].descripcion);

          this.form = this.buildForm(this.form, this._definicionGroup);
          this.rxcxProxy.getDefinicionImagenes(this.id).subscribe(imagenes => {
            this.images = [];
            for (let i = 0; i < imagenes.length; i++) {
              this.images.push(imagenes[i].path);
            }
          });
        });
      } else {
        this.form = this.buildForm(this.form, this._definicionGroup);
      }
    });
  }

  save() {
    delete this.definicion.uid;

    this.definicion.titulo = encodeURIComponent(this.form.get('titulo').value);
    this.definicion.descripcion = encodeURIComponent(this.form.get('descripcion').value);
    // console.log(this.definicion);
    if (this._id === '0') {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    this.definicion.imagenes = this.images;
    this.rxcxProxy.createDefinicion(this.definicion).subscribe(response => {
      this.coreService.setToast({
        type: 'success',
        title: 'Creación',
        body: 'Definición creada con éxito'
      });
      this.location.go('/definicion/' + response);
    });
  }

  update() {
    this.definicion.imagenes = this.images;

    console.log(this.definicion);

    this.rxcxProxy.updateDefinicion(this.definicion).subscribe(response => {
      this.coreService.setToast({
        type: 'success',
        title: 'Modificación',
        body: 'Definición modificada con éxito'
      });
    });
  }

  updateDefinicionImages(e, id) {
    const _id = 'img' + id;
    this.definicion[_id] = e[_id];
    console.log(this.definicion);
  }

  buildForm(form: FormGroup, group: any): FormGroup {
    this.fb = new FormBuilder();
    form = this.fb.group(group);
    form.valueChanges.subscribe(data =>
      this.coreService.onValueChanged(
        data,
        form,
        this.formErrors,
        this.validationMessages
      )
    );
    this.coreService.onValueChanged();
    console.log(this.definicion);
    form.setValue({
      titulo: this.definicion.titulo || '',
      descripcion: this.definicion.descripcion || ''
    });

    return form;
  }

  volver() {
    this.router.navigate(['/definiciones']);
  }

  ngOnDestroy() {
    this.form = null;
    this._id = '';
    this.id = '';
  }

  loadedImage(e, index) {
    console.log(e);
    this.images[index] = e.originalName;
    console.log(this.images);
  }

  setImageName(_obj, val) {
    setTimeout(() => {
      this[_obj] = val;
    }, 0);
  }
}
