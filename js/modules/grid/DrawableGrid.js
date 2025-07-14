'use strict';

export { DrawableGrid, CELL_BASE_COLOR };
import { Color } from '../utils/Color.js';

const BORDER_COLOR = 'white';
const OCCUPIED_COLOR = 'grey';
const PATH_COLOR = new Color(227, 199, 62);
const CELL_BASE_COLOR = new Color(30, 40, 29);
//
const PATH_SIZE = 2;
//
class DrawableGrid {
    constructor(gridData, canvas, cellSize = 20) {
        this.canvas = canvas;
        this.gridData = gridData;
        this.cellSize = cellSize;
        //
        const pathLayer = document.createElement('canvas');
        pathLayer.width = canvas.width;
        pathLayer.height = canvas.height;
        //
        this.pathLayerCtx = pathLayer.transferControlToOffscreen().getContext('2d');
        //
        this.pathLayerCtx.strokeStyle = PATH_COLOR.toString();
        this.pathLayerCtx.lineWidth = PATH_SIZE;
        //
        const gridLayer = document.createElement('canvas');
        gridLayer.width = canvas.width;
        gridLayer.height = canvas.height;
        //
        this.gridLayerCtx = gridLayer.transferControlToOffscreen().getContext('2d');
        //
        this.ctx = canvas.transferControlToOffscreen().getContext('2d');
    }
    //
    drawEdge(nodeA, nodeB) {
        if (!nodeA || !nodeB) {
            return;
        }
        //
        const x1 = nodeA.x * this.cellSize + this.cellSize / 2;
        const y1 = nodeA.y * this.cellSize + this.cellSize / 2;
        const x2 = nodeB.x * this.cellSize + this.cellSize / 2;
        const y2 = nodeB.y * this.cellSize + this.cellSize / 2;
        //
        this.pathLayerCtx.strokeStyle = PATH_COLOR.toString();
        this.pathLayerCtx.lineWidth = PATH_SIZE;
        //
        this.pathLayerCtx.beginPath();
        this.pathLayerCtx.moveTo(x1, y1);
        this.pathLayerCtx.lineTo(x2, y2);
        this.pathLayerCtx.stroke();
    }
    //
    drawPath(path) {
        if (!path || path.length === 0) {
            return;
        }
        this._clearPathLayer();
        //
        this.pathLayerCtx.beginPath();
        //
        for (const node of path) {
            const x = node.x * this.cellSize + this.cellSize / 2;
            const y = node.y * this.cellSize + this.cellSize / 2;
            this.pathLayerCtx.lineTo(x, y);
        }
        //
        this.pathLayerCtx.stroke();
        //
        this._drawLayers();
    }
    reset() {
        this.gridData.reset();
        this._drawGrid();
        this._clearPathLayer();
        this._drawLayers();
    }
    //
    _drawGrid() {
        this.gridLayerCtx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
    _clearPathLayer() {
        this.pathLayerCtx.clearRect(0, 0, this.pathLayerCtx.canvas.width, this.pathLayerCtx.canvas.height);
    }
    //
    _drawCell(node, color) {
        const x = node.x * this.cellSize;
        const y = node.y * this.cellSize;
        //
        this.gridLayerCtx.clearRect(x, y, this.cellSize, this.cellSize);
        //
        this.gridLayerCtx.fillStyle = color.toString();
        this.gridLayerCtx.strokeStyle = BORDER_COLOR;
        this.gridLayerCtx.lineWidth = 1;
        //
        this.gridLayerCtx.strokeRect(x, y, this.cellSize, this.cellSize);
        this.gridLayerCtx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
    }
    //
    _drawLayers() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.drawImage(this.gridLayerCtx.canvas, 0, 0);
        this.ctx.drawImage(this.pathLayerCtx.canvas, 0, 0);
    }
    //
    _getCellColor(node) {
        if (node.occupied) {
            return OCCUPIED_COLOR;
        }
        //
        return new Color(CELL_BASE_COLOR.r, CELL_BASE_COLOR.g, CELL_BASE_COLOR.b, node.costFactor).toString();
    }
    //
    _getCellCoordinates(event) {
        const x = Math.floor(event.offsetX / this.cellSize);
        const y = Math.floor(event.offsetY / this.cellSize);
        //
        return [x, y];
    }
}
