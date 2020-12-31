import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FlowDetails, TaskOrder } from 'ti-framework';
import { FlowService } from '../flow/flow.service';
import { InteractionService } from '../flow/interaction.service';
import * as ti from 'ti-framework'
import { AlertComponent, AlertType } from '../alert/alert.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  code: string = ""
  flow: FlowDetails
  message = ""
  @ViewChild("alert", { static: true }) alertComp: AlertComponent;

  constructor(private flowServ: FlowService, interactServ: InteractionService, private router: Router) {
    /**
   * set debug config <uses local Server instead of cloud>
   */
    this.flowServ.setEnvironment(ti.local_serverUrl, ti.EnvType.DEBUG, ti.interact_local_serverUrl)
  }


  async register() {
    try {
      this.flow = await this.flowServ.startFlow(this.code)
      const taskToNavigate: TaskOrder = await this.flowServ.getCurrentTask()
      const path = taskToNavigate.path
      this.router.navigate([path], { state: { payload: taskToNavigate } })
    } catch (error) {
      this.alertComp.showMessage("Incorrect code, try again", AlertType.DANGER)
      this.message = ""
    }
  }

}
