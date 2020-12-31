import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowService } from './flow.service';
import { AppRoutingModule } from '../app-routing.module';
import { AlertComponent } from '../alert/alert.component';
import { DocumentComponent } from '../document/document.component';
import { PrivacypolicyComponent } from '../privacypolicy/privacypolicy.component';
import { RegisterComponent } from '../register/register.component';
import { SignpadComponent } from '../sign-page/signpad/signpad.component';
import { TermsComponent } from '../terms/terms.component';
import { TouchlessTaskComponent } from '../touchlesstask/touchlesstask.component';
import { StateComponent } from '../test/state/state.component';
import { MatCardModule, MatButtonModule, MatToolbarModule } from '@angular/material';
import { SignaturePadModule } from '@ng-plus/signature-pad';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseTIService } from './baseTI.service';
import { InteractionService } from './interaction.service';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FlowprogressComponent } from './flowprogress/flowprogress.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FlowcompleteComponent } from '../modals/flowcomplete/flowcomplete.component';
import { ModalsModule } from '../modals/modals.module';
import { NavbarComponent } from '../navbar/navbar.component';

@NgModule({
  declarations: [
    PrivacypolicyComponent,
    SignpadComponent,
    DocumentComponent,
    TermsComponent,
    StateComponent,
    AlertComponent,
    RegisterComponent,
    TouchlessTaskComponent,
    FlowprogressComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    SignaturePadModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    ModalsModule
  ],
  providers: [FlowService, BaseTIService, InteractionService, NgbModal, NgbModalConfig],
  entryComponents: [FlowcompleteComponent]
})
export class FlowModule { }
