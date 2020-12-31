import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowprogressComponent } from './flowprogress.component';

describe('FlowprogressComponent', () => {
  let component: FlowprogressComponent;
  let fixture: ComponentFixture<FlowprogressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowprogressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
