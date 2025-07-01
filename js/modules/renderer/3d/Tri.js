'use strict';

export { Tri };

class Tri {
    constructor(v1, v2, v3, color = 'white') {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.color = color;
    }

    getVertices() {
        return [this.v1, this.v2, this.v3];
    }
}
