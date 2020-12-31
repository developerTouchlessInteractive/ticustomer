import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchlesstaskComponent } from './touchlesstask.component';

describe('TouchlesstaskComponent', () => {
  let component: TouchlesstaskComponent;
  let fixture: ComponentFixture<TouchlesstaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TouchlesstaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TouchlesstaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
