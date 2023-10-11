import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  grid = [
    {
      row: 1,
      col: 1,
      name: 'tag 1'
    }
  ]
  selectedItems: string[] = [];
  selectedItem = 'Item 1';
}
