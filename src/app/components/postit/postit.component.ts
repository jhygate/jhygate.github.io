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
  @Input() fixed: boolean = false;

  private isDragging = false;
  private offset = { x: 0, y: 0 };

  constructor(public el: ElementRef) {}

  ngOnInit() {
    const el = this.el.nativeElement;
    el.style.position = this.fixed ? 'fixed' : 'absolute';
    el.style.top = this.top;
    el.style.left = this.left;
  }

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

  private startDrag(clientX: number, clientY: number) {
    this.isDragging = true;
    const el = this.el.nativeElement;
    const rect = el.getBoundingClientRect();
    this.offset.x = clientX - rect.left;
    this.offset.y = clientY - rect.top;
  }

  private drag(clientX: number, clientY: number) {
    if (!this.isDragging) return;
    const el = this.el.nativeElement;
    el.style.left = `${clientX - this.offset.x}px`;
    el.style.top = `${clientY - this.offset.y}px`;
  }

  private endDrag() {
    this.isDragging = false;
  }
}