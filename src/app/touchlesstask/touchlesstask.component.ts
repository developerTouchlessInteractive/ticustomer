import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TaskState, CommunicationData, ResponseData, handler } from 'ti-framework';
import { Observable } from 'rxjs';
import { FlowService } from '../flow/flow.service';
import { InteractionService } from '../flow/interaction.service';
import { TaskStatus, TaskOutput, TaskProgressListener } from '../flowdata.interface';
import { BaseTouchlessTask, TouchlessFlowListeners, TouchlessInteract } from './touchlessnavigation.interface';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppInjector } from '../app.module';
import { FlowcompleteComponent } from '../modals/flowcomplete/flowcomplete.component';
import { InteractionComponent } from '../modals/interaction/interaction.component';

@Component({
  selector: 'app-touchlesstask',
  template: ''
})

/**
 * This is a parent comonent that every Task Component MUST extend.
 */
export class TouchlessTaskComponent extends BaseTouchlessTask implements handler.TaskPathHandler,
  AfterViewInit, OnDestroy, TouchlessInteract, TouchlessFlowListeners, TaskProgressListener {
  uniqueId: string;
  showAlert: boolean;
  alertType: string;
  alertMessage: string;
  flowState: any;
  modalService: NgbModal
  config: NgbModalConfig

  constructor(flowServ: FlowService,
    interactServ: InteractionService,
    private router: Router) {
    super(interactServ, flowServ, router)
    this.config = AppInjector.get(NgbModalConfig)
    this.modalService = AppInjector.get(NgbModal)

    this.init()
  }

  /**
   * sets current task and flowState. During init(), Tasks will start listening to
   *  TaskStatus, InteractionData and Path to next task
   */
  async init() {
    this.currentTask = await this.flowServ.getCurrentTask()
    this.flowState = await this.flowServ.getFlowState()
    if (this.currentTask) {
      this.uniqueId = this.currentTask.uniqueReference
      this.listenToTaskStatus()
      this.listenToInteractionData()
      this.listenToNextTaskPath()
    }
  }

  open() {
    const modalRef = this.modalService.open(FlowcompleteComponent);
    modalRef.componentInstance.complete.subscribe(() => {
      this.gotoLanding()
    })
  }



  /************ Register Listeners for Task Status, Interaction Data & Task Path ************* */

  listenToTaskStatus() {
    this.flowServ.registerTaskListener(this)
  }

  listenToInteractionData() {
    this.interactServ.commdata$.subscribe((data) => {
      // this.communicationdata = data
      // this.dataAlertComp.show()
      console.log('comm data received ' + JSON.stringify(data))
    })
  }

  listenToNextTaskPath() {
    this.flowServ.registerPathHandler(this)
  }

  /**
  * sends an update that Task has Started
  */
  ngAfterViewInit(): void {
    this.taskStarted()
  }

  /**
   * Before navgating from the current task, we must dereigster PathHandler and 
   * send an update that Task is Complete
   */
  ngOnDestroy() {
    this.deRegisterPathHandler()
    this.taskComplete()
  }


  getTaskPayloadFromExtras(): TaskState {
    var currNav = this.router.getCurrentNavigation()
    return currNav.extras.state.payload
  }

  /***
   * Each Task Component will 
   */
  async getTaskConfiguration() {
    return await this.currentTask ? await this.currentTask : undefined
  }

  /**INFORMATIONAL***
   * used to navigate to previous Task, instead of next Task
   */
  navigateToPreviousTask?(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**INFORMATIONAL**
   * sends interaction data
   * @param data 
   */
  sendData(data: any) {
    throw new Error('Method not implemented.');
  }

  /**INFORMATIONAL**
   * sends interaction data to every client connected to flow
   * @param data 
   */
  broadcastData?(data: any) {
    throw new Error('Method not implemented.');
  }

  /**INFORMATIONAL**
   * TODO when INteraction is recieved
   */
  receiveData(): Observable<CommunicationData> {
    throw new Error('Method not implemented.   ');
  }

  /**
   * sends update that task has Started. This is the first update from any Task to the server
   * MUST call this method in ngAfterViewInit() in custom task components
   */
  async taskStarted() {
    await this.updateTaskStatus(TaskStatus.STARTED)
  }

  /**
   * sends update to submit Data/Ouput on current task to Server
   * @param output check ti.TaskOutput
   */
  async taskSubmit(output?: TaskOutput) {
    await this.updateTaskStatus(TaskStatus.SUBMIT, output ? output : undefined)
  }

  /**
   * sends update to submit Data/Ouput on current task to Server.
   * This method should be used when this is the last data submitted by current task to server.
   * @param output 
   */
  async taskSubmitAndFinish(output?: TaskOutput) {
    await this.updateTaskStatus(TaskStatus.SUBMIT, output ? output : undefined)
  }

  /**
   * sends update to server/client that current task is complete.
   * MUST call this method in ngOnDestroy() in custom task components
   */
  async taskComplete() {
    await this.updateTaskStatus(TaskStatus.FINISHED)
  }

  /**INFORMATIONAL**
   * Can be used to process any operations for /send when task is Completed
   * @param event 
   */
  async taskFinish(event: ResponseData) {
    console.log(`received task finish from server`)
  }

  /**INFORMATIONAL**
   * Can be used to process any operations for /send every task update
   * @param event 
   */
  taskUpdate(event: ResponseData) {
    console.log(`received task update from server`)
  }

  /**
   * navigates to next task for a given path
   * If any modal exists, it will be dismissed before navigation
   * @param path 
   */
  async nextTaskPath(path: string) {
    if (this.modalService) this.modalService.dismissAll()
    this.router.navigate([path], { state: { payload: await this.currentTask } })
  }

  /**
   * no longer updates Path in flow Service
   * MUST be called in ngOnDestroy() in custom task components
   */
  deRegisterPathHandler(): void {
    this.flowServ.deRegisterPathHandler(this)
  }

  /**
   * throws UI alert that flow is completed
   * ONLY to be used when FLOW is complete 
   */
  flowFinish() {
    if (this.flowServ.isCurrentTask(this.uniqueId)) {
      this.alertType = "success"
      this.alertMessage = "FLOW is complete"
      this.showAlert = true
      this.open()
    } else {
      //flow is complete if this is not current task release any resources consumed, and change tast state accordingly as
      //flow is completed
    }
  }

  /**
   * ONly to be used when FLOW is complete and Customer is no longer connected to Flow/Interatction
   * goHome() navigates app to register page to connect to a new flow
   */
  gotoLanding() {
    this.modalService.dismissAll()
    this.router.navigate(['register'])
  }
}