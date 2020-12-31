import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowcompleteComponent } from './flowcomplete/flowcomplete.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InteractionComponent } from './interaction/interaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FlowcompleteComponent, InteractionComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [FlowcompleteComponent,InteractionComponent],
  entryComponents: [FlowcompleteComponent, InteractionComponent]
})
export class ModalsModule { }
