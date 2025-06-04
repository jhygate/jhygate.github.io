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
    this.startDrag(event.pageX, event.pageY);
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.drag(event.pageX, event.pageY);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.endDrag();
  }

  // Touch Events
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.startDrag(touch.pageX, touch.pageY);
    event.preventDefault();
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    this.drag(touch.pageX, touch.pageY);
  }

  @HostListener('document:touchend')
  onTouchEnd() {
    this.endDrag();
  }

  private startDrag(pageX: number, pageY: number) {
    this.isDragging = true;
    const el = this.el.nativeElement;
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset;
    const scrollTop = window.pageYOffset;
    this.offset.x = pageX - (rect.left + scrollLeft);
    this.offset.y = pageY - (rect.top + scrollTop);
  }

  private drag(pageX: number, pageY: number) {
    if (!this.isDragging) return;
    const el = this.el.nativeElement;
    el.style.left = `${pageX - this.offset.x}px`;
    el.style.top = `${pageY - this.offset.y}px`;
  }

  private endDrag() {
    this.isDragging = false;
  }
}
