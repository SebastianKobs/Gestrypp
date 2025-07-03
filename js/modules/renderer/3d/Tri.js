'use strict';

export { Tri };

class Tri {
    constructor(v1, v2, v3, color = 'white') {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        //
        this.n1 = null;
        this.n2 = null;
        this.n3 = null;
        //
        this.color = color;
    }

    addNormals(n1, n2, n3) {
        this.n1 = n1;
        this.n2 = n2;
        this.n3 = n3;
        //
        return this;
    }
    //
    getVertices() {
        return [this.v1, this.v2, this.v3];
    }
    //
    getNormals() {
        return [this.n1, this.n2, this.n3];
    }
}
