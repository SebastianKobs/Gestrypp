'use strict';

export { Node };

class Node {
    constructor(x, y, walkable = true, costFactor = 1, g = 0, h = 0) {
        this.walkable = walkable;
        this.costFactor = costFactor;
        this.x = x;
        this.y = y;
        this.g = g; // Cost from start to this cell
        this.h = h; // Heuristic cost from this cell to end
        this.parent = null;
    }
    //
    get f() {
        return this.g + this.h;
    }
    //
    toString() {
        return `Cell(${this.x}, ${this.y}, walkable: ${this.walkable}, costFactor: ${this.costFactor}) g: ${this.g}, h: ${this.h}, f: ${this.f})`;
    }
}
