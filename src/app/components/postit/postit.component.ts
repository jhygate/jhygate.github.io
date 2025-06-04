import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { NgClass } from '@angular/common'; 
@Component({
  selector: 'app-postit',
  standalone: true,
  templateUrl: './postit.component.html',
  styleUrls: ['./postit.component.css'],
  imports: [NgClass], 
})
export class PostitComponent {
  @Input() text: string = 'J H';
  @Input() bgColor: string = 'bg-yellow-200';
  @Input() textColor: string = 'text-gray-700';
  @Input() textSize: string = 'text-[70px]';
  @Input() size: string = 'w-32 h-32';
  @Input() rotation: string = 'rotate-[-6deg]';
  @Input() top: string = '0px';
  @Input() left: string = '0px';

  
  private isDragging = false;
  private offset = { x: 0, y: 0 };

  constructor(public el: ElementRef) {}

  ngOnInit() {
    const el = this.el.nativeElement;
    el.style.position = 'absolute'; // ensure it's positioned
    el.style.top = this.top;
    el.style.left = this.left;
  }

  // Drag logic omitted for brevity (unchanged)
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
