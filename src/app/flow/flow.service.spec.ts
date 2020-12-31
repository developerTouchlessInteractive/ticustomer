 import { TestBed } from '@angular/core/testing';
import { FlowService } from './flow.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'
 
describe('FlowService', () => {

  // beforeEach(() => {
  //   TestBed.configureTestingModule({ 
  //     providers: [FlowService],
  //     imports: [HttpClientTestingModule],
  //   });
  // });
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [FlowService]
  }));

  it('should be created', () => {
    const service: FlowService = TestBed.get(FlowService);
    expect(service).toBeTruthy();
  });

  it('#createFlowState should complete creating flow',
    (done: DoneFn) => {
      const service: FlowService = TestBed.get(FlowService);
      service.createFlowState(service.testFlowData).then(value => {
        // expect(value).toBe('promise value');
        done();
      });
    });
});