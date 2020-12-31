import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationData } from 'ti-framework';
import { AppInjector } from '../app.module';
import { InteractionService } from '../flow/interaction.service';
import { InteractionComponent } from '../modals/interaction/interaction.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  modalService: NgbModal
  interactionStarted: boolean
  newMessagesUnread: boolean
  config = {
    backdrop: true,
    ignoreBackdropClick: false
  }
  constructor(private interactionService: InteractionService) {
    this.modalService = AppInjector.get(NgbModal)
    this.listenToInteractionStatus()
    this.listenInteractionData()
  }

  listenToInteractionStatus() {
    this.interactionService.interactionAvailability.subscribe(res => {
      this.interactionStarted = res
    })
  }

  ngOnInit(): void {

  }

  /**
   * listens to interaction Data recieved from Client and updates Chat-Icon to Solid White
   */
  listenInteractionData() {
    this.interactionService.commdata$.subscribe((data: CommunicationData[]) => {
      if (data.length > 0) {
        if (!this.modalService.hasOpenModals()) {
          this.newMessagesUnread = true
        }
        else {
          this.newMessagesUnread = false
        }
      }
    })
  }

  /**
   * opens Interaction component, sets Chat- Icon to Empty-White th
   */
  openInteraction() {
    const modalRef = this.modalService.open(InteractionComponent, this.config);
    if (!this.modalService.hasOpenModals()) {
      this.newMessagesUnread = true
    }
    else {
      this.newMessagesUnread = false
    }
    modalRef.componentInstance.complete.subscribe(() => {
      this.interactionService.messagesAreRead = true
      this.modalService.dismissAll()
    })
  }

}
