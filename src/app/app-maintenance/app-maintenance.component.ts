import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Utility } from '../utils/utility';
import { Router } from "@angular/router";

@Component({
  selector: 'app-maintenance',
  templateUrl: './app-maintenance.component.html',
  styleUrls: ['./app-maintenance.component.scss'],
      encapsulation: ViewEncapsulation.None

})
export class AppMaintenanceComponent implements OnInit {

  constructor(private utils:Utility,
  private router:Router) { }

  ngOnInit() {
    if(this.utils.isUserLoggedIn()){
      this.router.navigate(["/"]);
    }
  }

}
