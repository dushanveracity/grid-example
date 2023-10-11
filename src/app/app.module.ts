import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DragSelectComponent } from './drag-select/grid.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, DragSelectComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
