'use strict';

export { Branch };

import { Vector3 } from '../math/Vector3.js';

class Branch {
    location = new Vector3();
    vertices = [];
    depth = 0;
    //
    constructor(x, y, depth) {
        this.location.set(x, y, 0);
        this.depth = depth;
    }
    //
    addVertex(x, y) {
        this.vertices.push(new Vector3(x, y, 0));
    }
    //
    length() {
        return this.vertices.length;
    }
    peak() {
        if (this.length() > 0) {
            return this.vertices[this.length() - 1];
        }
        //
        return new Vector3(0, 0, 0);
    }
    scale(scalar) {
        for (const vertex of this.vertices) {
            vertex.multiplyScalar(scalar);
        }
        //
        this.location.multiplyScalar(scalar);
    }
}
