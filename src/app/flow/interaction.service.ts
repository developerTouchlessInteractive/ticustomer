import { Injectable } from '@angular/core';
import { CommunicationData } from 'ti-framework';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppComponent } from '../app.component';
import { BaseTIService } from './baseTI.service';
import { CustomerDataInterface } from './interaction.listener';

@Injectable({
  providedIn: 'root'
})

/**
 * This is point of entry for all compoenents that want to use Interaction feature
 * 
 */
export class InteractionService {
  private _messagesAreRead: boolean;
  public get messagesAreRead() {
    return this._messagesAreRead;
  }
  public set messagesAreRead(value) {
    this._messagesAreRead = value;
  }

  private _commDatas: CommunicationData[] = [];
  readonly commdata$: Observable<CommunicationData[]>
  private communicationHistorySubject = new BehaviorSubject<CommunicationData[]>([])
  private communicationDataSubject = new Subject<CommunicationData>()

  private interactionAvalabilitySub = new BehaviorSubject<boolean>(false)
  interactionAvailability = this.interactionAvalabilitySub.asObservable()

  constructor(public baseServ: BaseTIService, private appComponent: AppComponent) {
    this.commdata$ = this.communicationHistorySubject.asObservable()
    this.listenToInteraction()
    this.baseServ.setDataInterface(new CustomerDataInterface(this.communicationDataSubject, this.interactionAvalabilitySub))
  }

  listenToInteraction() {
    this.communicationDataSubject.subscribe((data: CommunicationData) => {
      this._commDatas.push(data)
      // if (this.appComponent.routerOutletComponentClassName !== "InteractionComponent") {
      //   this._messagesAreRead = false
      // }
      // else{
      //   this._messagesAreRead = true
      // }
      this.communicationHistorySubject.next(this._commDatas)
    })
  }

  getCommDataHistory() {
    return this._commDatas
  }

  async sendInteraction(data: string) {
    try {
      const communicationData = await this.baseServ.getCommunicationData(data)
      const tiCommData = await this.baseServ.broadcastMessage(communicationData)
      // console.log('ticommdata '+ JSON.stringify(communicationData,null,2))
      this.communicationDataSubject.next(communicationData)
      this._messagesAreRead = true
    } catch (error) {
      throw Error("unable to send message")
    }
  }

  public get hasInteractionStarted() {
    return this.baseServ.hasInteractionStarted
  }

}

