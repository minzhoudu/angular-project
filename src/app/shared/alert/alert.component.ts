import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() massage: string;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
