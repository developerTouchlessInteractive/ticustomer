import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowcompleteComponent } from './flowcomplete.component';

describe('FlowcompleteComponent', () => {
  let component: FlowcompleteComponent;
  let fixture: ComponentFixture<FlowcompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowcompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowcompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
