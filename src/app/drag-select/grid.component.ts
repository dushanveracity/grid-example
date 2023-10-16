import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms', style({ opacity: 0 }))]),
    ]),
  ],
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
  hoveringCol: number = 0;
  hoveringRow: number = 0;

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

      const selectedGridItems = this.gridItems.filter((item) =>
        this.selectedItems.includes(item.id)
      );

      const selectionHasPanels = selectedGridItems.every((item) => item.panel);
      const selectionHasStrings = selectedGridItems.every(
        (item) => item.string
      );

      if (selectionHasPanels) {
        const selectionPanelsEqual = selectedGridItems.every(
          (item) =>
            JSON.stringify(item.panel) ===
            JSON.stringify(selectedGridItems[0].panel)
        );

        if (selectionPanelsEqual) {
          this.selectedPanel = selectedGridItems[0].panel;
        } else {
          this.selectedPanel = 'undefined';
        }
      } else {
        this.selectedPanel = 'undefined';
      }

      if (selectionHasStrings) {
        console.log('selection has strings');
        const selectionStringsEqual = selectedGridItems.every(
          (item) =>
            JSON.stringify(item.string) ===
            JSON.stringify(selectedGridItems[0].string)
        );

        if (selectionStringsEqual) {
          this.selectedString = selectedGridItems[0].string;
          console.log(selectedGridItems[0].string);
        } else {
          this.selectedString = 'undefined';
        }
      } else {
        this.selectedString = 'undefined';
      }
    }
  }

  onClick(event: MouseEvent, item: any) {
    if (event.metaKey || event.ctrlKey) {
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

  deleteColumn(col: number) {
    let movingCols = this.gridItems.filter((item) => item.col > col);
    const staticCols = this.gridItems.filter((item) => item.col < col);

    movingCols = movingCols.map((item) => ({ ...item, col: item.col - 1 }));

    const newGrid = [...movingCols, ...staticCols];

    newGrid.sort((a, b) => {
      if (a.row !== b.row) {
        return a.row - b.row;
      }
      return a.col - b.col;
    });

    this.gridLayout = { ...this.gridLayout, cols: this.gridLayout.cols - 1 };
    this.gridItems = newGrid;
  }

  deleteRow(row: number) {
    let movingRows = this.gridItems.filter((item) => item.row > row);
    const staticRows = this.gridItems.filter((item) => item.row < row);

    movingRows = movingRows.map((item) => ({ ...item, row: item.row - 1 }));

    this.gridLayout = { ...this.gridLayout, rows: this.gridLayout.rows - 1 };
    this.gridItems = [...staticRows, ...movingRows];
  }

  changePanel() {
    this.gridItems.forEach((item, idx) => {
      if (this.selectedItems.includes(item.id)) {
        this.gridItems[idx] = {
          ...this.gridItems[idx],
          panel: this.selectedPanel,
        };
      }
    });

    const selectedGridItems = this.gridItems.filter((item) =>
      this.selectedItems.includes(item.id)
    );
    const isBothPropsSet = selectedGridItems.every((item) => item.string);

    if (isBothPropsSet) {
      this.selectedItems = [];
    }
  }

  changeString() {
    this.gridItems.forEach((item, idx) => {
      if (this.selectedItems.includes(item.id)) {
        this.gridItems[idx] = {
          ...this.gridItems[idx],
          string: this.selectedString,
        };
      }
    });

    const selectedGridItems = this.gridItems.filter((item) =>
      this.selectedItems.includes(item.id)
    );
    const isBothPropsSet = selectedGridItems.every((item) => item.panel);

    if (isBothPropsSet) {
      this.selectedItems = [];
    }
  }

  hoverOptions(row: number, col: number) {
    this.hoveringRow = row;
    this.hoveringCol = col;
  }
}
