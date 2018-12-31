import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, AfterViewChecked, Renderer2 } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit {
  @ViewChild('dropdownlist') private dropdown: ElementRef; 
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  onToggle(){
    if(!this.dropdown.nativeElement.classList.contains("show")){
      this.renderer.setStyle(this.dropdown.nativeElement.firstChild, "color", "white");
    }else{
      this.renderer.setStyle(this.dropdown.nativeElement.firstChild, "color", "rgba(255, 255, 255, 0.5)");
    }
  }

}
