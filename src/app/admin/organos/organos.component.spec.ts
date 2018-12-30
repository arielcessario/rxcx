import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganosComponent } from './organos.component';

describe('OrganosComponent', () => {
  let component: OrganosComponent;
  let fixture: ComponentFixture<OrganosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
