import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { PostitComponent } from './components/postit/postit.component';

@Component({
  selector: 'app-root',
  imports: [PostitComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit() {}
}
