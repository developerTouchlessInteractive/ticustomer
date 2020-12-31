import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  routerOutletComponent: object;
  routerOutletComponentClassName: string;

  onActivate(event: any): void {
    this.routerOutletComponent = event;
    this.routerOutletComponentClassName = event.constructor.name;
  }
}
