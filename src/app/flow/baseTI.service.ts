import { Injectable } from '@angular/core';
import * as ti from 'ti-framework'
import { FlowDetails, FlowState, EndPoint } from 'ti-framework';

@Injectable({
  providedIn: 'root'
})
/**
 * Base Service for all TI App. Important parameters and utilities are implemented here.
 * 
 */
export class BaseTIService {
  flow: FlowDetails
  flowState: FlowState
  sessionId: string
  channelId: string
  dataInterface: ti.DataInterface

  setDataInterface(dataInterface: ti.DataInterface) {
    this.dataInterface = dataInterface
  }

  private inviteCode: string

  private _isDeviceRegistered: boolean

  private _hasInteractionStarted: boolean
  public set interactionStarted(value) {
    this._hasInteractionStarted = value
  }
  public get hasInteractionStarted() {
    return this._hasInteractionStarted
  }


  /**
  * First method called by Customer to connect to the flow. sends code to server and receives details 
  * about the session like FlowDetails, channels for Flow and Interaction etc.
  * @param code string
  */
  async registerByCode(code) {
    try {
      this.inviteCode = code
      const result: any = await ti.ticustomer.registerCustomerByCode(ti.local_serverUrl, this.inviteCode)
      if (result) {
        this._isDeviceRegistered = true
        this.flow = result.data.flow
        this.flowState = result.data.flowState
        this.sessionId = result.data.sessionId
        this.channelId = result.data.customerChannel
      }
      return result
    } catch (error) {
      this._isDeviceRegistered = false
      console.log(`error ${JSON.stringify(error)}`)
    }
  }

  /**
   * EndPoint.CUSTOMER connects to existing flow/session in server
   * @param responseData 
   * @param tiRouteConfig 
   * @param flowState 
   * @param listener 
   */
  connectToSession(responseData: any, tiRouteConfig: ti.handler.TiRouteConfig, flowState: FlowState, listener: ti.FlowListener) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await ti.createFlowManagerForCustomer(responseData, tiRouteConfig, flowState, listener)
        await this.startInteraction()
        resolve()
      } catch (error) {
        reject('unable to connect to server')
      }
    })
  }

  /**
   * opens interaction for the Active session
   */
  async startInteraction() {
    await ti.startInteraction(this.sessionId, EndPoint.CUSTOMER, this.dataInterface)
    this.interactionStarted = true
  }

  /**
   * get communicaiton data from ti-sdk
   * ta
   */
  async getCommunicationData(data: string) {
    return await ti.util.getCommunicationData(data, this.sessionId)
  }
  /**
   * sends InteractionData on Interaction Channel <This Data will be converted to ti.CommunicationData by SDK 
   * and forwarded to EndPoint.CLIENT from Server>
   * @param data 
   */
  async broadcastMessage(data: ti.CommunicationData) {
    return await ti.sendInteractionData(this.sessionId, data)
  }
}
