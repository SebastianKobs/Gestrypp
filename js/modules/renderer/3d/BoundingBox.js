'use strict';

import { Vector3 } from '../../math/Vector3';

export { BoundingBox };

class BoundingBox {
    constructor(min = new Vector3(Infinity, Infinity, Infinity), max = new Vector3(-Infinity, -Infinity, -Infinity)) {
        this.min = min;
        this.max = max;
    }
    //
    update(vertex) {
        this.min.x = Math.min(this.min.x, vertex.x);
        this.min.y = Math.min(this.min.y, vertex.y);
        this.min.z = Math.min(this.min.z, vertex.z);
        //
        this.max.x = Math.max(this.max.x, vertex.x);
        this.max.y = Math.max(this.max.y, vertex.y);
        this.max.z = Math.max(this.max.z, vertex.z);
    }
    //
    getCenter() {
        return new Vector3((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, (this.min.z + this.max.z) / 2);
    }
    //
    getScale() {
        const xdistance = this.max.x - this.min.x;
        const ydistance = this.max.y - this.min.y;
        const zdistance = this.max.z - this.min.z;

        return Math.max(xdistance, ydistance, zdistance);
    }
    //
    scale(scalar) {
        this.min.multiplyScalar(scalar);
        this.max.multiplyScalar(scalar);
        //
        return this;
    }
    //
    unity() {
        const scale = this.getScale();
        //
        if (scale === 0) {
            return this;
        }
        //
        const center = this.getCenter();
        //
        this.min.subtract(center);
        this.max.subtract(center);
        //
        this.min.divideScalar(scale);
        this.max.divideScalar(scale);
        //
        return this;
    }
}
