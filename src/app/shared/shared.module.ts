import { AcCoreModule } from 'ac-core';
import { FusejsPipe } from './fusejs/fusejs.pipe';
import { NavComponent } from './nav/nav.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbLayoutModule,
  NbActionsModule,
  NbUserModule,
  NbSearchModule
} from '@nebular/theme';
import { LogoutComponent } from './logout/logout.component';
import { CollapseDirective } from './collapse/collapse.directive';
import { OarComponent } from './oar/oar.component';
import { VolumenComponent } from './volumen/volumen.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableDropdownComponent } from './table-dropdown/table-dropdown.component';
import { SwitcherComponent } from './switcher/switcher.component';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    NavComponent,
    CollapseDirective,
    OarComponent,
    VolumenComponent,
    FusejsPipe,
    TableDropdownComponent,
    SwitcherComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbLayoutModule,
    NbActionsModule,
    NbUserModule,
    NbSearchModule,
    NgbModule.forRoot(),
    AcCoreModule
  ],
  exports: [
    LoginComponent,
    LogoutComponent,
    NavComponent,
    CollapseDirective,
    OarComponent,
    VolumenComponent,
    SwitcherComponent,
    FusejsPipe
  ],
  entryComponents: [TableDropdownComponent],
  providers: [],
  bootstrap: []
})
export class SharedModule {}
