'use strict';

export { AStarNode };

import { Node } from '../../grid/Node.js';

class AStarNode extends Node {
    static Construct(x, y, occupied = false, g = 0, h = 0) {
        return new AStarNode(x, y, occupied, g, h);
    }
    //
    constructor(x, y, occupied = false, g = 0, h = 0) {
        super(x, y, occupied);
        //
        this.g = g; // Cost from start to this cell
        this.h = h; // Heuristic cost from this cell to end
        //
        this.parent = null;
    }
    //
    get f() {
        return this.g + this.h;
    }
    //
    toString() {
        return super.toString() + `AstarNode g: ${this.g}, h: ${this.h}, f: ${this.f})`;
    }
}
