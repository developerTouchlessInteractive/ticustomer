import { Component, OnInit } from '@angular/core';
import { FlowState, StageState, TaskOrder } from 'ti-framework';
import { FlowService } from '../flow.service';

@Component({
  selector: 'app-flowprogress',
  templateUrl: './flowprogress.component.html'
})
export class FlowprogressComponent implements OnInit {
  private flowState: FlowState
  private stages = []
  private tasks = []
  private taskBar: number
  private stageBar: number
  shouldShowStageBar: boolean
  shouldShowTaskBar: boolean

  constructor(private flowServ: FlowService) {
    this.flowServ.getFlowState().then(res => {
      this.flowState = res
    }).catch(error => {
      console.log('unable to  get update state' + JSON.stringify(error))
    })
  }

  ngOnInit() {
    if (this.flowState) {
      this.updateView(this.flowState)
    }
  }

  /**
   * updates UI to show how many tasks or stages are completed so far in the Flow
   * @param flowState FlowService.flowState
   */
  updateView(flowState: FlowState) {
    /*
    * if flow is completed, dont show taskBar and stageBar
    */
    if (flowState.isCompleted) {
      console.log('flow is completed')
    }
    else {
      /**
       *  if flow has more than one stage, show both taskBar and StageBar
       */
      if (flowState.stageStates.length > 1) {
        this.shouldShowStageBar = true
        this.shouldShowTaskBar = true
        this.updateStageProgress(flowState.stageStates)
        this.updateTaskProgress(flowState.taskLedger)
      }
      else {
        /**
         * if flow has one stage and more than one task in that Stage, show only taskBar
         */
        if (flowState.taskLedger.length > 1) {
          this.shouldShowTaskBar = true
          this.updateTaskProgress(flowState.taskLedger)
        }
      }
    }
  }

  /**
   * updates taskBar UI to show how many tasks are completed so far in the Flow 
   * @param taskLedger 
   */
  updateTaskProgress(taskLedger: TaskOrder[]) {
    taskLedger.forEach((task, index) => {
      if (task.isCompleted) {
        this.tasks[index] = true
        this.taskBar = (this.tasks.filter(value => value === true).length / taskLedger.length)
      }
    })
  }

  /**
   * updates stageBar UI to show how many Stages are completed so far in the Flow 
   * @param stagestates 
   */
  updateStageProgress(stagestates: StageState[]) {
    stagestates.forEach((stage, index) => {
      if (stage.isCompleted) {
        this.stages[index] = true
        this.stageBar = (this.stages.filter(value => value === true).length / stagestates.length)
      }
    })
  }

}
