import { Component, Output, EventEmitter } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
})
export class DragSelectComponent {
  private isDragging: boolean = false;
  gridItems: any[] = [];
  selectedItems: string[] = [];
  gridLayout = {
    rows: 0,
    cols: 0,
  };
  selectedPanel: any = 'undefined';
  selectedString: any = 'undefined';

  panels = [
    { power: 400, model: 'Model 1' },
    { power: 420, model: 'Model 2' },
    { power: 440, model: 'Model 3' },
    { power: 460, model: 'Model 4' },
  ];

  strings = [
    { name: 'String 1', color: '#7FFF00' },
    { name: 'String 2', color: '#00FFFF' },
    { name: 'String 3', color: '#DC143C' },
  ];

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.selectedPanel = 'undefined';
    this.selectedString = 'undefined';
    if (event.shiftKey) {
      this.isDragging = true;
    }
  }

  onMouseMove(event: any) {
    if (this.isDragging) {
      this.onSelectionChanged(event);
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.isDragging) {
      this.isDragging = false;
    }
  }

  onSelectionChanged(item: any) {
    if (!this.selectedItems.includes(item.id)) {
      this.selectedItems.push(item.id);
    }
  }

  onClick(event: any, item: any) {
    if (event.metaKey) {
      if (!this.selectedItems.includes(item.id)) {
        this.selectedItems = [...this.selectedItems, item.id];
      } else {
        this.selectedItems = this.selectedItems.filter(
          (selectedItem) => item.id !== selectedItem
        );
      }
    }
  }

  onGridSave(event: Event) {
    event.preventDefault();
    const cols = this.gridLayout.cols;
    const rows = this.gridLayout.rows;
    if (cols && rows) {
      for (let r: number = 1; r <= rows; r++) {
        for (let c: number = 1; c <= cols; c++) {
          this.gridItems.push({ id: uuid(), row: r, col: c });
        }
      }
    }
  }

  gridLayoutStyle() {
    return `repeat(${String(this.gridLayout.cols)}, 1fr)`;
  }

  addRowAbove(row: number) {
    let movingRows = this.gridItems.filter((item) => item.row >= row);
    const staticRows = this.gridItems.filter((item) => item.row < row);

    movingRows = movingRows.map((item) => ({ ...item, row: item.row + 1 }));

    const newRow = [];

    for (let c: number = 1; c <= this.gridLayout.cols; c++) {
      newRow.push({ id: uuid(), row: row, col: c });
    }

    this.gridItems = [...staticRows, ...newRow, ...movingRows];
  }

  addRowBelow(row: number) {
    let movingRows = this.gridItems.filter((item) => item.row > row);
    const staticRows = this.gridItems.filter((item) => item.row <= row);

    movingRows = movingRows.map((item) => ({ ...item, row: item.row + 1 }));

    const newRow = [];

    for (let c: number = 1; c <= this.gridLayout.cols; c++) {
      newRow.push({ id: uuid(), row: row + 1, col: c });
    }

    this.gridLayout = { ...this.gridLayout, rows: this.gridLayout.rows + 1 };
    this.gridItems = [...staticRows, ...newRow, ...movingRows];
  }

  addColumnRight(col: number) {
    let movingCols = this.gridItems.filter((item) => item.col > col);
    const staticCols = this.gridItems.filter((item) => item.col <= col);

    movingCols = movingCols.map((item) => ({ ...item, col: item.col + 1 }));

    const newCol = [];

    for (let r: number = 1; r <= this.gridLayout.rows; r++) {
      newCol.push({ id: uuid(), row: r, col: col + 1 });
    }

    const newGrid = [...staticCols, ...movingCols, ...newCol];

    newGrid.sort((a, b) => {
      if (a.row !== b.row) {
        return a.row - b.row;
      }
      return a.col - b.col;
    });

    this.gridLayout = { ...this.gridLayout, cols: this.gridLayout.cols + 1 };
    this.gridItems = newGrid;
  }

  addColumnLeft(col: number) {
    let movingCols = this.gridItems.filter((item) => item.col >= col);
    const staticCols = this.gridItems.filter((item) => item.col < col);

    movingCols = movingCols.map((item) => ({ ...item, col: item.col + 1 }));

    const newCol = [];

    for (let r: number = 1; r <= this.gridLayout.rows; r++) {
      newCol.push({ id: uuid(), row: r, col: col });
    }

    const newGrid = [...staticCols, ...movingCols, ...newCol];

    newGrid.sort((a, b) => {
      if (a.row !== b.row) {
        return a.row - b.row;
      }
      return a.col - b.col;
    });

    this.gridLayout = { ...this.gridLayout, cols: this.gridLayout.cols + 1 };
    this.gridItems = newGrid;
  }

  changePanel(event: Event) {
    const target = event.target as HTMLSelectElement;

    console.log(target.value);
    this.gridItems.forEach((item, idx) => {
      if (this.selectedItems.includes(item.id)) {
        this.gridItems[idx] = { ...this.gridItems[idx], panel: JSON.parse(target.value) };
      }
    });
    this.selectedItems = [];
  }

  changeString(event: Event) {
    const target = event.target as HTMLSelectElement;

    console.log(target.value);
    this.gridItems.forEach((item, idx) => {
      if (this.selectedItems.includes(item.id)) {
        this.gridItems[idx] = { ...this.gridItems[idx], string: JSON.parse(target.value) };
      }
    });
    this.selectedItems = [];
  }
}
