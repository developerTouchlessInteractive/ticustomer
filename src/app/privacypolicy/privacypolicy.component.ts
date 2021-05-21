import { AfterViewInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FlowService } from '../flow/flow.service';
import { InteractionService } from '../flow/interaction.service';
import { TaskOutput, UserProvidedAction } from '../flowdata.interface';
import { TouchlessTaskComponent } from '../touchlesstask/touchlesstask.component';
import { privacyhtml, privacyhtml_2 } from './privacy.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.css']
})
export class PrivacypolicyComponent extends TouchlessTaskComponent implements AfterViewInit {
  hasAccepted: boolean = false
  pageData
  fetchedHtml: any;
  consentResult
  privacy_url = "http://localhost:3000/tmsprivacy/policy" //this endpoint is of touchless Server
  docViewUrl: string;

  constructor(flowServ: FlowService, interactServ: InteractionService, public http: HttpClient, router: Router) {
    super(flowServ, interactServ, router);
  }

  // TODO change URL when pointing to our privacy website
  async ngAfterViewInit() {
    super.ngAfterViewInit()
    const taskConfig = await this.getTaskConfiguration()
    this.docViewUrl = taskConfig.resource
    this.http
      .get(this.privacy_url, { responseType: 'text' })
      .subscribe(
        data => console.log('success', this.fetchedHtml = data),
        error => console.log('oops', this.handlePrivacyFetchError())
      )
  }

  handlePrivacyFetchError() {
    this.fetchedHtml = privacyhtml + privacyhtml_2
  }

  async updateConsent(bool) {
    this.hasAccepted = bool
    if (bool) {
      this.consentResult = UserProvidedAction.AGREE
    } else {
      this.consentResult = UserProvidedAction.DENY
    }
    await this.sendMessage()
  }

  async sendMessage() {
    var output: TaskOutput = {
      data: "any",
      useraction: this.consentResult
    }

    await this.taskSubmitAndFinish(output)
  }

}
