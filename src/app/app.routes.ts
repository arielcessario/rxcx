import { DiagnosticoComponent } from './reportes/diagnostico/diagnostico.component';
import { EndpointsComponent } from './admin/endpoints/endpoints.component';
import { OrganoComponent } from './admin/organo/organo.component';
import { OrganosComponent } from './admin/organos/organos.component';
import { DiagnosticosComponent } from './admin/diagnosticos/diagnosticos.component';
import { DefinicionComponent } from './admin/definicion/definicion.component';
import { DefinicionesComponent } from './admin/definiciones/definiciones.component';
import { PacienteComponent } from './paciente/paciente.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacientesComponent } from './pacientes/pacientes.component';
import { UnidadesComponent } from './admin/unidades/unidades.component';
import { AuthGuard } from 'ac-core';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  {
    path: 'diagnosticos',
    component: DiagnosticosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes',
    component: PacientesComponent,
    canActivate: [AuthGuard]
  },
  { path: 'paciente', component: PacienteComponent, canActivate: [AuthGuard] },
  {
    path: 'paciente/:id',
    component: PacienteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'definiciones',
    component: DefinicionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'definicion/:id',
    component: DefinicionComponent,
    canActivate: [AuthGuard]
  },
  { path: 'organos', component: OrganosComponent, canActivate: [AuthGuard] },
  { path: 'organo', component: OrganoComponent, canActivate: [AuthGuard] },
  { path: 'organo/:id', component: OrganoComponent, canActivate: [AuthGuard] },
  { path: 'unidades', component: UnidadesComponent, canActivate: [AuthGuard] },
  {
    path: 'endpoints',
    component: EndpointsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'diagnostico',
    component: DiagnosticoComponent,
    canActivate: [AuthGuard]
  },

  { path: 'login', component: LoginComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
