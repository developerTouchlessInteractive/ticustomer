import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-flowcomplete',
  templateUrl: './flowcomplete.component.html'
})

/**
 * alert componenet , to be shown when flow is complete 
 */
export class FlowcompleteComponent implements OnInit {
  @Output() complete = new EventEmitter()

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  goHome() {
    this.complete.emit()
  }
}
