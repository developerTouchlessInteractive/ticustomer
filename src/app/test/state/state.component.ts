import { Component, OnInit } from '@angular/core';
import { FlowService } from 'src/app/flow/flow.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {

  constructor(private flowServ:FlowService) { }

  async ngOnInit() {
    // this.flowServ.getJSON().subscribe(data => console.log('data: ' + JSON.stringify(data)))
    // await this.flowServ.createFlowState(this.flowServ.testFlowData)
  }


}
