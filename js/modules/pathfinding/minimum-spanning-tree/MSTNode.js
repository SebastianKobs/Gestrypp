'use strict';

export { MSTNode };

import { Node } from '../../grid/Node.js';

class MSTNode extends Node {
    static Construct(x, y, occupied = false, edgeCost = Infinity) {
        return new MSTNode(x, y, occupied, edgeCost);
    }
    //
    constructor(x, y, occupied = false, edgeCost = Infinity) {
        super(x, y, occupied);
        //
        this.edgeCost = edgeCost;
    }
    //
    toString() {
        return super.toString() + `MSTNode edgeCost: ${this.edgeCost}) g: ${this.g}, h: ${this.h}, f: ${this.f})`;
    }
}
