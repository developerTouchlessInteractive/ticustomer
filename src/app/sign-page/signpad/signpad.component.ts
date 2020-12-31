import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-signpad',
  templateUrl: './signpad.component.html',
  styleUrls: ['./signpad.component.css']
})
export class SignpadComponent implements AfterViewInit {

  signatureImage
  @Output() sendSignData = new EventEmitter<{ rawData: string }>();

  constructor() { }

  ngAfterViewInit() {
    console.log('hello')
  }
  showImage(data) {
    this.signatureImage = data;
    console.log(' ims' + this.signatureImage)
    this.sendSignData.emit({ rawData: this.signatureImage })
  }
}
