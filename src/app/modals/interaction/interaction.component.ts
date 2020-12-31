import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InteractionService } from 'src/app/flow/interaction.service';
import * as moment from 'moment'

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.css']
})
export class InteractionComponent implements OnInit {
  interaction
  message = ""
  @Output() complete = new EventEmitter()

  constructor(private interactServ: InteractionService) { 
    this.getConversation()
  }

  ngOnInit() {
    
    this.interactServ.messagesAreRead = true
  }

  getConversation() {
    this.interactServ.commdata$.subscribe(chat => {
      this.interaction = chat
      console.log('conversation' + JSON.stringify(this.interaction, null, 2))
      //TODO update UI about new message
    })
  }

  async sendMessage() {
    try {
      await this.interactServ.sendInteraction(this.message)
      this.message = ""
    } catch (error) {
      console.log('unable to send message' + JSON.stringify(error, null, 2))
    }
  }

  getMomentTime(time) {
    return moment(time).format('MMMM Do , h:mm:ss a')
  }

  goHome() {
    this.complete.emit()
  }
}
