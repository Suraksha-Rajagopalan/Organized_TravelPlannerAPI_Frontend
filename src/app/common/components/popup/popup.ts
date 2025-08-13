import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.html'
})
export class Popup {
  @Input() message: string = '';
  visible: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.visible = false;
    }, 3000); // hide after 3s
  }

  close() {
    this.visible = false;
  }
}
