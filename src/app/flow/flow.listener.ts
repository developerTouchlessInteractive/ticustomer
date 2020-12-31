import { ResponseData, SdkNotificationData } from 'ti-framework'
import { TaskProgressListener } from '../flowdata.interface'
import { FlowService } from './flow.service'
import * as ti from 'ti-framework'

/**
 * Customer specific implementation for ti.FlowListener
 * FlowListener is passed to SDK to receive updates on flow. Eg: Flow connected, disconnected, updated etc.
 * refer to ti.FlowListener<Interface> in SDK for more info
 */
export class CustomerFlowListener implements ti.FlowListener {
    flowService: FlowService
    constructor(fs: FlowService) {
        this.flowService = fs
    }
    /**
     * STAGE is complete. 
     * @param event payload received form server  when stage is completed.
     */
    stageIsComplete(event?: ResponseData): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                resolve()
            } catch (error) {
                console.log('error while resolving promise' + error)
                reject(error)
            }
        })

    }

    /**
     * called by SDK when FLOW is complete. all tasks will be informed about flow completion
     * @param event payload received form server  when Flow is completed. 
     */
    flowIsComplete(event?: ResponseData): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                this.flowService.taskListeners.forEach(listener => {
                    listener.flowFinish()
                });
                resolve()
            } catch (error) {
                console.log('error while resolving promise' + JSON.stringify(error))
                reject(error)
            }
        })

    }

    /**
     * called by SDK when there is a FLOW Update. Eg: when task/stage has finished etc
     * @param event payload received form server  when FLOW is updated. 
     */
    flowUpdate(event: ResponseData | SdkNotificationData): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                if (ti.ServerEvent.ACK_CONNECTION === event.type) {
                    await this.flowService.startInteraction()
                    console.log(' received Server ACK for flow connection')
                }
                resolve()
            } catch (error) {
                reject()
            }
        })

    }

    /*** **INFORMATIONAL***
     * called by SDK when there is a error in FLOW.
     * @param event payload received form server  when FLOW operations run into error
     */
    flowOperationError(event: ResponseData | SdkNotificationData): void {
        console.log('flow Operation Error' + JSON.stringify(event, null, 2))
    }

    /** ***INFORMATIONAL***
     * called by SDK when FLOW has exited with error.
     * @param event payload received form server  when FLOW operations run into error
     */
    flowExitedWithError(event: ResponseData): void {
        console.log('flow Exited with Error' + JSON.stringify(event, null, 2))
    }

    /**
     * called by SDK when task is completed. 
     * @param event payload received form server when task is completed
     * Tasks will be updated about completion via TaskProgressListeners
     */
    taskIsComplete(event?: ResponseData): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const listner: TaskProgressListener = this.flowService.taskListeners.find(x => x.uniqueId === event.data.uniqueReference)
                if (listner) {
                    listner.taskFinish(event)
                }
                resolve()
            } catch (error) {
                reject()
            }
        })
    }

    /**
     * called by SDK when task has an update. 
     * @param event payload received form server when task has an update. 
     * Eg: ACK from Server when Custmoer initiated a Task Update <TouchlessTaskComponent.taskStarted()>
     * Tasks will be informed about update via TaskProgressListeners
     */
    taskUpdate(event: ResponseData): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // this.flowEventSubject.next(event)
                const listner: TaskProgressListener = this.flowService.taskListeners.find(x => x.uniqueId === event.data.taskState!.uniqueReference)
                if (listner) {
                    listner.taskUpdate(event)
                }
                resolve()
            } catch (error) {
                reject()
            }
        })

    }
    /** ***INFORMATIONAL***
     * called by SDK when cusotomer app connects to FLOW.
     */
    flowConnected(): void {
        console.log('flow is connected')
    }
    /** ***INFORMATIONAL***
     * called by SDK when cusotomer app is disconnected from FLOW.
     */
    flowDisconnected(): void {
        console.log('flow is disconnected')
    }

    /**
     * 
     * @param path 
     * @param uniqueReference 
     */
    nextTaskPath(path: string, uniqueReference: string): void {
        this.flowService.routePathHandlers.forEach(handler => {
            handler.nextTaskPath(path)
        });
    }
}
