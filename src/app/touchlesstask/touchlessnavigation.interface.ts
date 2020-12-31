import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FlowService } from '../flow/flow.service';
import { InteractionService } from '../flow/interaction.service';

import { TaskOutput, TaskPayload, TaskStatus } from '../flowdata.interface';
import { CustomerEvent, TaskOrder } from 'ti-framework'

/**
 * Base Class for all the tasks in the app
 * implements updateTaskStatus()
 */
export abstract class BaseTouchlessTask {

    currentTask: TaskOrder
    constructor(protected interactServ: InteractionService, protected flowServ: FlowService, router: Router) {
    }

    /**
     * can be called to send task updates to Server/Client
     * @param status used to update when Task has started/completed
     * @param output  data that can be sent from each child component along with TaskStatus
     */
    async updateTaskStatus(status: TaskStatus, output?: TaskOutput) {
        const currentTask = await this.flowServ.getCurrentTask()
        const payload: TaskPayload = {
            status: status,
            payload: output ? output : undefined,
            taskState: currentTask ? currentTask : undefined
        }
        await this.sendPayloadToServer(payload)
    }

    /**
     * sends data to Server
     * @param payload is the data sent from each Task during Task-Updates, but formatted into ti.TaskPayload
     */
    async sendPayloadToServer(payload: TaskPayload) {
        switch (payload.status) {
            case TaskStatus.STARTED:
                await this.flowServ.sendTaskUpdateToServer(payload, CustomerEvent.TASK_STARTED)
                break;
            case TaskStatus.FINISHED:
                await this.flowServ.sendTaskUpdateToServer(payload, CustomerEvent.TASK_COMPLETE)
                break;
            case TaskStatus.SUBMIT:
                await this.flowServ.sendTaskUpdateToServer(payload, CustomerEvent.TASK_COMPLETE_REQUEST)
                break;
        }
    }
}

export interface TouchlessInteract {
    /**
     * send data on interact channel of this session
     * @param data data to be passed to client
     */
    sendData(data: any)
    /**
     * broadcast data to all eligible receivers in the session including client
     * @param data data to be broadcasted
     */
    broadcastData?(data: any)
    /**
     * listens to any incoming interact data for this session
     * @returns observable of data  
     */
    receiveData(): Observable<any>
}

export interface TouchlessFlowListeners {
    listenToTaskStatus()
    updateTaskStatus(status: TaskStatus, output?: TaskOutput)
}