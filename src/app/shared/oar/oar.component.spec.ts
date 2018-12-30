import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OarComponent } from './oar.component';

describe('OarComponent', () => {
  let component: OarComponent;
  let fixture: ComponentFixture<OarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
