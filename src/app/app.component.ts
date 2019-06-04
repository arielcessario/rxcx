import { VolumenService } from './core/volumen.service';
import { CoreService } from 'ac-core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NbSidebarService, NbThemeService } from '@nebular/theme';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ToasterService,
  ToasterConfig,
  Toast,
  BodyOutputType
} from 'angular2-toaster';

interface Item {
  name?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentInit {
  // title = 'app';
  state: '';

  position = 'toast-top-center';
  animationType = 'fade';
  title = 'HI there!';
  content = `I'm cool toaster!`;
  timeout = 5000;
  toastsLimit = 5;
  type = 'default';
  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;
  spinner = true;

  config: ToasterConfig = new ToasterConfig({
    positionClass: this.position,
    timeout: this.timeout,
    newestOnTop: this.isNewestOnTop,
    tapToDismiss: this.isHideOnClick,
    preventDuplicates: this.isDuplicatesPrevented,
    animation: this.animationType,
    limit: this.toastsLimit
  });

  types: string[] = ['default', 'info', 'success', 'warning', 'error'];
  animations: string[] = [
    'fade',
    'flyLeft',
    'flyRight',
    'slideDown',
    'slideUp'
  ];
  positions: string[] = [
    'toast-top-full-width',
    'toast-bottom-full-width',
    'toast-top-left',
    'toast-top-center',
    'toast-top-right',
    'toast-bottom-right',
    'toast-bottom-center',
    'toast-bottom-left',
    'toast-center'
  ];

  menu: Array<any> = [
    {
      title: 'Administración',
      icon: 'nb-keypad',
      link: '/main',
      children: [
        {
          title: 'Usuarios',
          link: '/usuarios'
        },
        {
          title: 'Definiciones',
          link: '/definiciones'
        },
        {
          title: 'Diagnósticos',
          link: '/diagnosticos'
        },
        // {
        //   title: 'Unidades',
        //   link: '/unidades'
        // },
        {
          title: 'Organos',
          link: '/organos'
        },
        {
          title: 'Endpoints',
          link: '/endpoints'
        }
      ]
    },
    {
      title: 'Pacientes',
      icon: 'nb-person',
      link: '/pacientes',
      children: [
        {
          title: 'Pacientes',
          link: '/pacientes'
        }
      ]
    },
    {
      title: 'Reportes',
      icon: 'nb-compose',
      link: '/reportes',
      children: [
        {
          title: 'Por Diagnóstico',
          link: '/diagnostico'
        }
      ]
    }
  ];
  theme = 'corporate';

  private toasterService: ToasterService;

  constructor(
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private nbSidebarService: NbSidebarService,
    private themeService: NbThemeService,
    private volumenService: VolumenService,
    toasterService: ToasterService
  ) {
    // const collection: AngularFirestoreCollection<Item> = afs.collection('items');
    // const collection$: Observable<Item[]> = collection.valueChanges()
    // collection$.map(actions => {
    //   return actions.map(a => {
    //     console.log(a)
    //     // const data = a.payload.doc.data() as Race;
    //     // data.id = a.payload.doc.id;
    //     return a;
    //   })
    // }).subscribe(data => console.log(data))
    this.toasterService = toasterService;

    this.coreService.showToast.subscribe(toast => {
      this.makeToast(toast);
    });

    // route.queryParams.subscribe(data=>{
    //   console.log(data);
    // })
    // collection.update(data)
    // collection.delete()
    // Notice how the observable is separated from write options

    // if (!afa.auth.currentUser) {
    //   router.navigate(['/login']);
    // } else {
    //   router.navigate(['/main']);
    // }

    // router.events.subscribe((val) => {
    //   console.log(this.route.snapshot.queryParams['returnUrl']);

    // });

    // router.events
    //   .map(() => activatedRoute)
    //   .map((route) => {
    //     while (route.firstChild) route = route.firstChild;
    //     console.log(route);
    //     return route;
    //   })
    //   .subscribe((val) => {

    //     if (val instanceof NavigationEnd) {
    //       if (!afa.auth.currentUser) {
    //         router.navigate(['/login']);
    //       } else {
    //         router.navigate(['/main']);
    //       }
    //     }
    //   });
  }

  ngOnInit() {
    // this.afs.firestore.settings({ timestampsInSnapshots: true });
    if (localStorage.getItem('THEME')) {
      this.theme = localStorage.getItem('THEME');
    } else {
      localStorage.setItem('THEME', 'corporate');
    }
    this.themeService.changeTheme(this.theme);
    this.coreService.getLoadingStatus.subscribe(v => {
      setTimeout(() => {
        this.spinner = v.show;
      }, 0);
    });
  }

  ngAfterContentInit() {
    // this.spinner = false;
  }
  makeToast(toast) {
    this.showToast(toast.type, toast.title, toast.body);
  }
  toggleSidebar() {
    // this.nbSidebarService.toggle('cosmic');
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      positionClass: this.position,
      timeout: this.timeout,
      newestOnTop: this.isNewestOnTop,
      tapToDismiss: this.isHideOnClick,
      preventDuplicates: this.isDuplicatesPrevented,
      animation: this.animationType,
      limit: this.toastsLimit
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: this.timeout,
      showCloseButton: this.isCloseButton,
      bodyOutputType: BodyOutputType.TrustedHtml
    };
    this.toasterService.popAsync(toast);
  }
}
