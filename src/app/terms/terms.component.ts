import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlowService } from '../flow/flow.service';
import { InteractionService } from '../flow/interaction.service';
import { TaskOutput, UserProvidedAction } from '../flowdata.interface';
import { TouchlessTaskComponent } from '../touchlesstask/touchlesstask.component';
import { termshtml, termshtml_2 } from './terms.constant';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent extends TouchlessTaskComponent implements AfterViewInit {
  hasAccepted: boolean = false
  pageData
  fetchedHtml = undefined
  consentResult
  docViewUrl
  url2

  constructor(flowServ: FlowService, interactServ: InteractionService, public http: HttpClient, router: Router) {
    super(flowServ, interactServ, router);
  }

  // TODO change URL when pointing to our privacy website
  async ngAfterViewInit() {
    super.ngAfterViewInit()
    const taskConfig = await this.getTaskConfiguration()
    this.url2 = "http://localhost:3000/tmsprivacy/terms" //this endpoint is of touchless Server
    this.docViewUrl = 'src/assets/termsandconditions.pdf'

    this.http
      .get(this.url2, { responseType: 'text' })
      .subscribe(
        data => console.log('success', this.fetchedHtml = data),
        error => console.log('oops', this.handleTermsFetchError())
      );
  }

  handleTermsFetchError() {
    this.fetchedHtml = termshtml + termshtml_2
  }

  async updateConsent(bool) {
    this.hasAccepted = bool
    // 

    if (bool) {
      this.consentResult = UserProvidedAction.ACCEPT
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
