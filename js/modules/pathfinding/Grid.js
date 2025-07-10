'use strict';

import { Color } from '../utils/Color.js';

export { Grid };

const BORDER_COLOR = 'white';
const START_COLOR = 'green';
const END_COLOR = 'red';
const OCCUPIED_COLOR = 'grey';
const PATH_COLOR = new Color(227, 199, 62);
const CELL_BASE_COLOR = new Color(30, 40, 29);
//
class Grid {
    constructor(gridData, cellSize, canvas) {
        this.canvas = canvas;
        this.ctx = canvas.transferControlToOffscreen().getContext('2d');
        //
        this.cellSize = cellSize;
        this.gridData = gridData;

        this.reset();
        //
        this._setUpEventListeners(canvas);
    }
    //
    reset() {
        this.lastVisited = null;
        this.startCell = null;
        this.endCell = null;
        //
        this.gridData.reset();
        this._drawGrid();
    }
    //
    toggleStartPosition(event) {
        const node = this.gridData.getNodeAt(...this._getCellCoordinates(event));
        //
        if (node.walkable === false) {
            return;
        }
        //
        if (this.gridData.startCell) {
            this._drawCell(this.gridData.startCell, this._getCellColor(node));
        }
        //
        this.gridData.startCell = node;
        //
        this._drawCell(node, START_COLOR);
        //
        this.lastVisited = -1;
    }
    //
    toggleEndPosition(event) {
        const node = this.gridData.getNodeAt(...this._getCellCoordinates(event));
        //
        if (node.walkable === false) {
            return;
        }
        //
        if (this.gridData.endCell) {
            this._drawCell(this.gridData.endCell, this._getCellColor(node));
        }
        //
        this.gridData.endCell = node;
        this._drawCell(node, END_COLOR);
        //
        this.lastVisited = null;
    }
    //
    toggleWalkable = (event) => {
        const node = this.gridData.getNodeAt(...this._getCellCoordinates(event));
        //
        if (node === this.lastVisited) {
            return;
        }
        //
        node.walkable = !node.walkable;
        //
        this._drawCell(node, this._getCellColor(node));
        //
        this.lastVisited = node;
    };
    //
    drawPath(path) {
        if (!path || path.length === 0) {
            return;
        }
        //
        this.ctx.strokeStyle = PATH_COLOR.toString();
        this.ctx.lineWidth = 2;
        //
        this.ctx.beginPath();
        //
        for (const node of path) {
            const x = node.x * this.cellSize + this.cellSize / 2;
            const y = node.y * this.cellSize + this.cellSize / 2;
            this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        //
    }
    _drawGrid() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        //
        const nodes = this.gridData.nodes;
        //
        for (const node of nodes) {
            const alpha = node.costFactor;
            const color = new Color(CELL_BASE_COLOR.r, CELL_BASE_COLOR.g, CELL_BASE_COLOR.b, alpha);
            //
            this._drawCell(node, color);
        }
    }
    //
    _drawCell(node, color) {
        const x = node.x * this.cellSize;
        const y = node.y * this.cellSize;
        //
        this.ctx.clearRect(x, y, this.cellSize, this.cellSize);
        //
        this.ctx.fillStyle = color.toString();
        this.ctx.strokeStyle = BORDER_COLOR;
        this.ctx.lineWidth = 1;
        //
        this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
        this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
    }
    //
    _setUpEventListeners() {
        this.canvas.addEventListener('mousedown', (event) => {
            if (event.shiftKey) {
                this.toggleStartPosition(event);
            } else if (event.ctrlKey) {
                this.toggleEndPosition(event);
            } else {
                this.toggleWalkable(event);
                this.canvas.addEventListener('mousemove', this.toggleWalkable);
                this.canvas.addEventListener('mouseup', () => {
                    this.canvas.removeEventListener('mousemove', this.toggleWalkable);
                });
            }
        });
    }
    _getCellColor(node) {
        if (node.walkable) {
            return new Color(CELL_BASE_COLOR.r, CELL_BASE_COLOR.g, CELL_BASE_COLOR.b, node.costFactor).toString();
        } else {
            return OCCUPIED_COLOR;
        }
    }
    _getCellCoordinates(event) {
        const x = Math.floor(event.offsetX / this.cellSize);
        const y = Math.floor(event.offsetY / this.cellSize);
        //
        return [x, y];
    }
}
