'use strict';

export { MstGrid };

import { DrawableGrid, CELL_BASE_COLOR } from '../../../grid/DrawableGrid.js';
import { Color } from '../../../utils/Color.js';
import { MinimumSpanningTree } from '../MinimumSpanningTree.js';

const VERTEX_COLOR = new Color(128, 40, 29);
//
class MstGrid extends DrawableGrid {
    constructor(gridData, canvas, cellSize) {
        super(gridData, canvas, cellSize);
        //
        this._setUpEventListeners(canvas);
        //
        super.reset();
    }
    //
    toggleVertice(event) {
        const node = this.gridData.getNodeAt(...super._getCellCoordinates(event));
        //
        node.occupied = !node.occupied;
        //
        super._drawCell(node, this._getCellColor(node));
    }
    //
    _setUpEventListeners(canvas) {
        canvas.addEventListener('click', (event) => {
            this.toggleVertice(event);
            const mst = MinimumSpanningTree.buildMST(this.gridData.getOccupiedNodes());
            //
            this._clearPathLayer();
            //
            for (const edge of mst) {
                this.drawEdge(edge.currentNode, edge.neighbor);
            }
            this._drawLayers();
        });
    }
    //
    _getCellColor(node) {
        if (node.occupied) {
            return VERTEX_COLOR;
        }
        //
        return new Color(CELL_BASE_COLOR.r, CELL_BASE_COLOR.g, CELL_BASE_COLOR.b).toString();
    }
}
