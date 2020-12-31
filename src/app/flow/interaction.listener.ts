import { CommunicationData } from "ti-framework"
import * as ti from 'ti-framework'
import { BehaviorSubject, Observable, Subject } from 'rxjs';

/**
 * Connection listener , used for getting updates on Interaction
 */
export class CustomerDataInterface implements ti.DataInterface {


    // private commDatas: CommunicationData[] = []

    private interactionStarted = false



    constructor(private communicationDataSubject: Subject<CommunicationData>,
        private interactionAvalabilitySub: BehaviorSubject<boolean>) {
    }
    /**
     * utility method to find out if interaction started
     */
    hasInteractionStarted() {
        return this.interactionStarted
    }

    /**
     * SDK calls this when Interaction Data is received from server/Client
     * @param data refer to ti.CommunicationData
     * this data can be retrieved by subcribing to the Observable 
     */
    receiveData(data: CommunicationData): void {
        console.log(`rece inf: ${JSON.stringify(data)}`)
        this.communicationDataSubject.next(data)
    }

    /**
     * SDK calls this method when Interaction connection has been established with server
     * @param data initial data received when INteractin connection is established
     */
    interactionConnected(data?: any) {
        this.interactionAvalabilitySub.next(true)
        console.log('interaction connected ' + JSON.stringify(data, null, 2))
    }

    /**
     * SDK calls this method when Interaction connection is disconnected with server
     * @param data initial data received when INteractin connection is disconnected with server
     */
    interactionDisConnected(data?: any) {
        this.interactionAvalabilitySub.next(false)
        console.log('interaction cdisonnected ' + JSON.stringify(data, null, 2))
    }
    /****INFORMATIONAL**
     * used for interaction 
     * @param data 
     */
    connectionUpdate(data?: any) {
        console.log(`con update: ${JSON.stringify(data)}`)
    }
}