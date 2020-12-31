import { Injectable } from '@angular/core';

@Injectable()
export class TestService {
name :string = ""
  constructor() { 
    this.name =  "DiZZi test Serv"
  }

  getName(){
return this.name
  }
}
