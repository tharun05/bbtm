import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-short',
  templateUrl: './app-footer-short.component.html',
  styleUrls: ['./app-footer-short.component.scss']
})
export class AppFooterShortComponent implements OnInit {
  showRegulations = false;
  constructor(private router: Router,
  	private location: Location) {}

  ngOnInit() {
  	this.router.events.subscribe((evt) => {
      this.location.path().includes('/checkout') ? this.showRegulations = true : this.showRegulations = false;
    });
    
  }

}
