import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragSelectComponent } from './grid.component';

describe('DragSelectComponent', () => {
  let component: DragSelectComponent;
  let fixture: ComponentFixture<DragSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DragSelectComponent]
    });
    fixture = TestBed.createComponent(DragSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
