import { environment } from './../environments/environment';
import { DefinicionComponent } from './admin/definicion/definicion.component';
import { TableDropdownComponent } from './shared/table-dropdown/table-dropdown.component';
import { OarService } from './core/oar.service';
import { VolumenService } from './core/volumen.service';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { CoreService } from './core/core.service';
import { AuthGuard } from './core/auth/auth-guard.service';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import {
  NbThemeModule,
  NbActionsModule,
  NbCardModule,
  NbMenuModule,
  NbTabsetModule,
  NbUserModule,
  NbSpinnerModule
} from '@nebular/theme';
import {
  NbSidebarModule,
  NbLayoutModule,
  NbSidebarService
} from '@nebular/theme';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { Routing } from './app.routes';
import { Logger } from './core/logger/logger.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import {
  NbMenuService,
  NbMenuInternalService
} from '@nebular/theme/components/menu/menu.service';
import { PerfilComponent } from './perfil/perfil.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PacientesComponent } from './pacientes/pacientes.component';
import { PacienteComponent } from './paciente/paciente.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FusejsService } from './core/fusejs.service';
import { DefinicionesComponent } from './admin/definiciones/definiciones.component';
import { DiagnosticosComponent } from './admin/diagnosticos/diagnosticos.component';
import { UnidadesComponent } from './admin/unidades/unidades.component';
import { OrganosComponent } from './admin/organos/organos.component';
import { OrganoComponent } from './admin/organo/organo.component';
import { EndpointsComponent } from './admin/endpoints/endpoints.component';
import { DiagnosticoComponent } from './reportes/diagnostico/diagnostico.component';
import { AcCoreModule } from 'ac-core';
import { RxcxCoreModule } from 'rxcx-core';

// const environment = {
//   production: false,
//   firebaseConfig: {
//     apiKey: 'AIzaSyDpeSFq1Kwhe_lr1d6De5QY8hyTZBh3s6w',
//     authDomain: 'firestone-5c901.firebaseapp.com',
//     databaseURL: 'https://firestone-5c901.firebaseio.com',
//     projectId: 'firestone-5c901',
//     storageBucket: 'firestone-5c901.appspot.com',
//     messagingSenderId: '478856419717'
//   }
// };
let env = 'dev';
if (environment.production) {
  env = 'prod';
}

const projectConfig = {
  env: env,
  company: 'rxcx',
  providers: [
    {
      provider: 'google',
      key:
        '639646112390-c3jcsiq36j19hp3kbdr13dsmv03jqd7r.apps.googleusercontent.com'
    }
  ],
  imagesPath: environment.imagesPath
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    UsuariosComponent,
    PerfilComponent,
    PacientesComponent,
    PacienteComponent,
    DefinicionComponent,
    DefinicionesComponent,
    DiagnosticosComponent,
    UnidadesComponent,
    OrganosComponent,
    OrganoComponent,
    EndpointsComponent,
    DiagnosticoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbSidebarModule,
    NbActionsModule,
    NbCardModule,
    NbTabsetModule,
    NbMenuModule,
    NbUserModule,
    NbSpinnerModule,
    CoreModule,
    SharedModule,
    Routing,
    Ng2SmartTableModule,
    ToasterModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    AcCoreModule.forRoot(projectConfig),
    RxcxCoreModule
  ],
  providers: [
    NbSidebarService,
    NbMenuService,
    NbMenuInternalService,
    AuthGuard,
    CoreService,
    Logger,
    FusejsService,
    VolumenService,
    OarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
