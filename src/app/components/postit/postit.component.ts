import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-postit',
  standalone: true,
  templateUrl: './postit.component.html',
  styleUrls: ['./postit.component.css'],
})
export class PostitComponent {
  private isDragging = false;
  private offset = { x: 0, y: 0 };

  constructor(private el: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.offset.x =
      event.clientX - this.el.nativeElement.getBoundingClientRect().left;
    this.offset.y =
      event.clientY - this.el.nativeElement.getBoundingClientRect().top;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    this.el.nativeElement.style.left = `${event.clientX - this.offset.x}px`;
    this.el.nativeElement.style.top = `${event.clientY - this.offset.y}px`;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }
}
