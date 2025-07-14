'use strict';

export { AStarGrid };

import { DrawableGrid } from '../../../grid/DrawableGrid.js';
//
const START_COLOR = 'green';
const END_COLOR = 'red';
//
class AStarGrid extends DrawableGrid {
    constructor(gridData, canvas, cellSize) {
        super(gridData, canvas, cellSize);
        //
        this.cellSize = cellSize;
        this.gridData = gridData;
        //
        this._setUpEventListeners(canvas);
        //
        this.reset();
    }
    //
    reset() {
        super.reset();
        //
        this.lastVisited = null;
        this.startCell = null;
        this.endCell = null;
    }
    //
    toggleStartPosition(event) {
        const node = this.gridData.getNodeAt(...this._getCellCoordinates(event));
        //
        if (node.occupied) {
            return;
        }
        //
        if (this.gridData.startCell) {
            this._drawCell(this.gridData.startCell, this._getCellColor(node));
        }
        //
        this.gridData.startCell = node;
        //
        this.lastVisited = null;
        //

        super._drawCell(node, START_COLOR);
        //
        super._clearPathLayer();
        //
        super._drawLayers();
    }
    //
    toggleEndPosition(event) {
        const node = this.gridData.getNodeAt(...this._getCellCoordinates(event));
        //
        if (node.occupied) {
            return;
        }
        //
        if (this.gridData.endCell) {
            this._drawCell(this.gridData.endCell, this._getCellColor(node));
        }
        //
        this.gridData.endCell = node;
        //
        this.lastVisited = null;
        //
        super._drawCell(node, END_COLOR);
        super._clearPathLayer();
        //
        super._drawLayers();
    }
    //
    toggleOccupied = (event) => {
        const node = this.gridData.getNodeAt(...this._getCellCoordinates(event));
        //
        if (node === this.lastVisited) {
            return;
        }
        //
        node.occupied = !node.occupied;
        //
        super._drawCell(node, this._getCellColor(node));
        //
        super._clearPathLayer();
        //
        super._drawLayers();
        //
        this.lastVisited = node;
        //
        this._clearPathLayer();
        //
        this._drawLayers();
    };
    //
    _setUpEventListeners() {
        this.canvas.addEventListener('pointerdown', (event) => {
            if (event.shiftKey) {
                this.toggleStartPosition(event);
            } else if (event.ctrlKey) {
                this.toggleEndPosition(event);
            } else {
                this.toggleOccupied(event);
                this.canvas.addEventListener('pointermove', this.toggleOccupied);
                this.canvas.addEventListener('pointerup', () => {
                    this.canvas.removeEventListener('pointermove', this.toggleOccupied);
                });
            }
        });
    }
}
