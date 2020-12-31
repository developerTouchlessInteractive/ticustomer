import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowModule } from 'src/app/flow/flow.module';
import { FlowService } from 'src/app/flow/flow.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlowModule
  ],
  providers: [FlowService]
})
export class StateModule { }
