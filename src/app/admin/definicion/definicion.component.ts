import { RxCxProxy } from 'rxcx-core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Logger } from './../../core/logger/logger.service';
import { CoreService } from 'ac-core';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
// import { Definicion } from '../../shared/model/definicion';


@Component({
  selector: 'rxc-definicion',
  templateUrl: './definicion.component.html',
  styleUrls: ['./definicion.component.scss']
})
export class DefinicionComponent implements OnInit, OnDestroy {

  // definicion2: Definicion = new Definicion();
  definicion2: any = {};
  
  imagesPath = environment.imagesPath;

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

  id = '0';
  _id = '0';
  subs: any;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private coreService: CoreService,
    private rxcxProxy: RxCxProxy
  ) { }

  ngOnInit() {
    // Si tengo un id lo uso para buscar, en caso contrario, es un definicion vacío.
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id !== '0') {
        this._id = this.id;
        this.rxcxProxy.getDefinicion(this.id).subscribe(data => {
          this.definicion2.definicion_id = data[0].definicion_id;
          this.definicion2.titulo = data[0].titulo;
          this.definicion2.descripcion = data[0].descripcion;

          // this.form = this.buildForm(this.form, this._definicionGroup);
          this.rxcxProxy.getDefinicionImagenes(this.id).subscribe(imagenes => {
            this.images = [];
            for (let i = 0; i < imagenes.length; i++) {
              this.images.push(imagenes[i].path);
            }
          });
        });
      }
    });
  }

  save() {
    if (this._id === '0') {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    this.definicion2.imagenes = this.images;

    this.rxcxProxy.createDefinicion(this.definicion2).subscribe(response => {
      this.coreService.setToast({
        type: 'success',
        title: 'Creación',
        body: 'Definición creada con éxito'
      });
      this.location.go('/definicion/' + response);
    });
  }

  update() {
    this.definicion2.imagenes = this.images;

    this.rxcxProxy.updateDefinicion(this.definicion2).subscribe(response => {
      this.coreService.setToast({
        type: 'success',
        title: 'Modificación',
        body: 'Definición modificada con éxito'
      });
    });
  }

  updateDefinicionImages(e, id) {
    // const _id = 'img' + id;
    // this.definicion[_id] = e[_id];
    console.log(this.definicion2);
  }

  volver() {
    this.router.navigate(['/definiciones']);
  }

  ngOnDestroy() {
    // this.form = null;
    this._id = '';
    this.id = '';
  }

  loadedImage(e, index) {
    // console.log(e);
    this.images[index] = e.originalName;
    // console.log(this.images);
  }

  setImageName(_obj, val) {
    setTimeout(() => {
      this[_obj] = val;
    }, 0);
  }
}
