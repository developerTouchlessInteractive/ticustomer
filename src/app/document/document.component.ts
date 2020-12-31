import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { TouchlessTaskComponent } from '../touchlesstask/touchlesstask.component';
import { Router } from '@angular/router';
import { FlowService } from '../flow/flow.service';
import { TaskOutput, UserProvidedAction } from '../flowdata.interface';
import { InteractionService } from '../flow/interaction.service';
import { style } from '@angular/animations';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent extends TouchlessTaskComponent implements AfterViewInit {
  shouldShowSignPad: boolean = false
  signatureB64data: any;
  signButtonLabel = "Sign Here"

  @Output() sendSignData = new EventEmitter<{ rawData: string }>();

  docViewUrl: string;

  constructor(flowServ: FlowService, interactServ: InteractionService,
    router: Router) {
    super(flowServ, interactServ, router);
  }

  /**
   * gets resource url needed to download document
   */
  async ngAfterViewInit() {
    super.ngAfterViewInit()
    const taskConfig = await this.getTaskConfiguration()
    this.docViewUrl = taskConfig.resource
  }

  /**
   * gets event from signpad and Processes UI Button to indicate a new SIGN or Edit existing SIGN
   * @param event from signpad , conatains signature / hand-drawn data in B64 format
   */
  processSignature(event) {
    this.shouldShowSignPad = false
    if (event) {
      this.signatureB64data = event.rawData
      this.signButtonLabel = "Edit Sign"
    }
  }

  /**
   * updates UI button to show the signature or clears Sign-Pad for new Signature
   */
  processSignButton() {
    this.shouldShowSignPad = true
    this.signatureB64data = null
  }

  /**
   * Prepares output from Document component. TouchlessTaskComponent consumes this output 
   * to perform TASK related Updates
   */
  async complete() {
    var output: TaskOutput = {
      data: { rawData: this.signatureB64data },
      useraction: UserProvidedAction.SUBMIT
    }
    await this.taskSubmitAndFinish(output)
  }

}
