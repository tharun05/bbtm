import { Component, OnInit,ViewEncapsulation,Input } from '@angular/core';
import { EmitterService } from '../services/emitter.service'
import * as $ from 'jquery';

@Component({
  selector: 'app-page-loader',
  templateUrl: './app-page-loader.component.html',
  styleUrls: ['./app-page-loader.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AppPageLoaderComponent implements OnInit {
  @Input() percentage_input;
  constructor(private emitterService:EmitterService) { }

  ngOnInit() {

  	var cnt=document.getElementById("count"); 
    var water=document.getElementById("water");
    let percent:number=Number(cnt.innerText);
  var interval;

  this.emitterService.purchaseLoaderEvent$.subscribe(
      value => {
         this.percentage_input = value;
          cnt.innerHTML = JSON.stringify(this.percentage_input); 
          water.style.transform='translate(0'+','+(100-this.percentage_input)+'%)';
      }
  );
 
  this.emitterService.purchaseLoaderEvent$.subscribe(
      value => {
      $("#checkout-loader").show();   
      this.percentage_input = this.percentage_input ? this.percentage_input : 5;
       water.style.transform='translate(0'+','+(100-this.percentage_input)+'%)';
      }
  );
  cnt.innerHTML = JSON.stringify(this.percentage_input); 
          water.style.transform='translate(0'+','+(100-this.percentage_input)+'%)';
/*interval=setInterval(function(){ 
  percent++; 
  cnt.innerHTML = JSON.stringify(percent); 
  water.style.transform='translate(0'+','+(100-percent)+'%)';
  if(percent==100){
    clearInterval(interval);
  }
},60);*/
  }




}
