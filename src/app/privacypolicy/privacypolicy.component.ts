import { AfterViewInit } from '@angular/core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FlowService } from '../flow/flow.service';
import { InteractionService } from '../flow/interaction.service';
import { TaskOutput, UserProvidedAction } from '../flowdata.interface';
import { TouchlessTaskComponent } from '../touchlesstask/touchlesstask.component';

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
  url = "https://www.sofi.com/login/policy/esign"
  docViewUrl: string;
  url2

  constructor(flowServ: FlowService, interactServ: InteractionService, public http: Http, router: Router) {
    super(flowServ, interactServ, router);
  }

  // TODO change URL when pointing to our privacy website
  async ngAfterViewInit() {
    super.ngAfterViewInit()
    const taskConfig = await this.getTaskConfiguration()
    this.docViewUrl = taskConfig.resource
    this.url2 = "https://cors-anywhere.herokuapp.com/".concat(taskConfig.resource)
    this.http.get(this.url2).pipe(
      map((response: Response) => {
        this.fetchedHtml = response;
      })
    ).subscribe()
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
