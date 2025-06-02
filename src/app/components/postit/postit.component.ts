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

  // Mouse Events
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.startDrag(event.clientX, event.clientY);
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.drag(event.clientX, event.clientY);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.endDrag();
  }

  // Touch Events
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.startDrag(touch.clientX, touch.clientY);
    event.preventDefault();
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    this.drag(touch.clientX, touch.clientY);
  }

  @HostListener('document:touchend')
  onTouchEnd() {
    this.endDrag();
  }

  // Shared Methods
  private startDrag(clientX: number, clientY: number) {
    this.isDragging = true;
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.offset.x = clientX - rect.left;
    this.offset.y = clientY - rect.top;
  }

  private drag(clientX: number, clientY: number) {
    if (!this.isDragging) return;
    this.el.nativeElement.style.left = `${clientX - this.offset.x}px`;
    this.el.nativeElement.style.top = `${clientY - this.offset.y}px`;
  }

  private endDrag() {
    this.isDragging = false;
  }
}
