'use strict';

export { Node };

class Node {
    static Construct(x, y, occupied = false) {
        return new Node(x, y, occupied);
    }
    //
    constructor(x, y, occupied = false) {
        this.x = x;
        this.y = y;
        this.occupied = occupied;
    }
    //
    toString() {
        return `Node(${this.x}, ${this.y} occupied: ${this.occupied})`;
    }
}
