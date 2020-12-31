import { Injectable } from '@angular/core';
import { TaskPayload, TaskProgressListener } from '../flowdata.interface';
import { BaseTIService } from './baseTI.service';
import * as ti from 'ti-framework'
import { FlowDetails, FlowState, TaskOrder, CustomerEvent } from 'ti-framework';
import { CustomerFlowListener } from './flow.listener';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

/**
 * base task<TouchLessTaskComponent> and child tasks <Terms> use FlowService to talk to SDK/Server/Client
 *  for every Flow Operation like connect, taskupdate, broadcast ineraction data etc
 */
export class FlowService {
  /**
   * an array of task progress listeners,
   * on update these listeners will be used by FlowListener to update respective Task Components
   */
  taskListeners: TaskProgressListener[] = []
  routePathHandlers: ti.handler.TaskPathHandler[] = []
  private flowState: FlowState

  constructor(public baseServ: BaseTIService, private router: Router) {
  }

  /**
  * Adds the new TaskProgresslistener to existing list of FlowService's taskListeners 
  * @param taskListener used to register and recieve updates on Task Progress. All Task Components use this
  */
  registerTaskListener(taskListener: TaskProgressListener) {
    const index = this.taskListeners.findIndex(x => x.uniqueId === taskListener.uniqueId)
    if (index === -1) {
      this.taskListeners.push(taskListener)
    }
  }

  /**
   * Adds the new TaskPathHandler to existing list of FlowService's routePathHandlers 
   * @param handler used to obtain next-task-path. <Knowledge of next-task-path helps when navgating b/w tasks>
   */
  registerPathHandler(handler: ti.handler.TaskPathHandler): void {
    const index = this.routePathHandlers.findIndex(x => x.uniqueId === handler.uniqueId)
    if (index === -1) {
      this.routePathHandlers.push(handler)
    }
  }

  /**
   * Removes existing TaskPathHandler from list of FlowService's routePathHandlers 
   * @param handler has uniqueId. It is helpful in finding / removing the requested handler 
   */
  deRegisterPathHandler(handler: ti.handler.TaskPathHandler): void {
    const index = this.routePathHandlers.findIndex(x => x.uniqueId === handler.uniqueId)
    if (index > -1) {
      this.routePathHandlers.splice(index, 1)
    }
  }

  /**
   * Requests base service to start INteraction.
   * Usage: After succesful Flow Connection Establishment
   */
  async startInteraction() {
    await this.baseServ.startInteraction()
  }


  /**
   * Utilty to determine the current task among all Tasks in Stages/Flow. 
   * Determing current task helps in UI updates and more
   */
  async getCurrentTask() {
    return new Promise<TaskOrder>(async (resolve, reject) => {
      try {
        const curTask = await ti.handler.getCurrentTask(this.baseServ.sessionId)
        resolve(curTask)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Utilty to determine if given task with a uniqueReference is the "currentTask" 
   * Determing current task helps in UI updates and more
   * @param reference each Task has UniqueReference
   */
  async isCurrentTask(reference) {
    const isCurrentTask = await ti.handler.isCurrentTask(this.baseServ.sessionId, reference)
    return isCurrentTask
  }

  /**
   * Utiltiy to get latest snapshot of ti.FlowState at any given stage of the Flow.
   * Eg: Used in FLowProgressComponent determine and display current progress on UI as a progressbar
   */
  async getFlowState() {
    return new Promise<FlowState>(async (resolve, reject) => {
      try {
        const flowState = await ti.handler.getFlowState(this.baseServ.sessionId)
        resolve(flowState)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * utility to send Task Updates to Server. 
   * Eg: Each TaskComponent uses this utility to send updates like TASK_STARTED/TASK_COMPLETION_REQUEST etc
   * @param taskPayload may contain UserAction or Signature64 Data etc
   * @param event Refer to ti.CustomerEvent
   */
  async sendTaskUpdateToServer(taskPayload: TaskPayload, event: CustomerEvent) {
    await ti.sendTaskPayloadToServer(this.baseServ.sessionId, taskPayload, event)
  }

  /**
   * Utility to configure local server Vs Cloud for a given setup
   * @param env DEBUG or PROD. Refer to ti.EnvType
   */
  setEnvironment(url: string, env: ti.EnvType, interacturl: string) {
    const serverConfig: ti.ServerConfig = {
      serverUrl: url,
      envType: env,
      interactServerUrl: interacturl
    }
    try {
      ti.setServerEndpoint(serverConfig)
    } catch (error) {
      console.log('unable to set server url ' + JSON.stringify(error, null, 2))
    }
  }

  /**
   * sets server URL(eg: a localhost or remote) 
   * @param url 
   * @param env 
   */
  setEnv(url, env) {


  }

  /**
   * register and fetches the flow details and then 
   * connects to the flow and passes in a flow state
   * listener for flow updates
   * 
   * @param inviteCode invite code of the flow
   */
  async startFlow(inviteCode: string): Promise<FlowDetails> {
    return new Promise(async (resolve, reject) => {
      try {
        const registerResult = await this.baseServ.registerByCode(inviteCode)
        const flow: FlowDetails = registerResult.data.flow
        this.flowState = registerResult.data.flowState
        /**
        * constructs TiRouteConfig based on angular routes
        * implement your custom TiRouteConfig construction in here
        */
        const tiRouteConfig: ti.handler.TiRouteConfig = ti.getTiRouteConfig(this.router.config, ti.handler.Platform.ANGULAR)

        await this.baseServ.connectToSession(registerResult.data, tiRouteConfig, this.flowState, new CustomerFlowListener(this))
        resolve(flow)
      } catch (error) {
        reject(error)
      }
    })
  }
}
