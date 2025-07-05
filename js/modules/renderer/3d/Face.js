'use strict';

export { Face };

import { Color } from '../../utils/Color.js';

class Face {
    constructor(v1, v2, v3) {
        this.v1 = v1.clone();
        this.v2 = v2.clone();
        this.v3 = v3.clone();
        //
        this.n1 = null;
        this.n2 = null;
        this.n3 = null;
        //
        this.uv1 = null;
        this.uv2 = null;
        this.uv3 = null;
        //
        this.uv1Color = new Color(255, 0, 255);
        this.uv2Color = new Color(255, 0, 255);
        this.uv3Color = new Color(255, 0, 255);
    }
    //
    unity(center = null, scale = 1) {
        if (center) {
            this.v1.subtract(center);
            this.v2.subtract(center);
            this.v3.subtract(center);
        }
        //
        this.v1.divideScalar(scale);
        this.v2.divideScalar(scale);
        this.v3.divideScalar(scale);
        //
        return this;
    }
    //
    scale(scalar) {
        this.v1.multiplyScalar(scalar);
        this.v2.multiplyScalar(scalar);
        this.v3.multiplyScalar(scalar);
        //
        if (this.n1) this.n1.multiplyScalar(scalar);
        if (this.n2) this.n2.multiplyScalar(scalar);
        if (this.n3) this.n3.multiplyScalar(scalar);
        //
        return this;
    }
    //
    addNormals(n1, n2, n3) {
        this.n1 = n1.clone();
        this.n2 = n2.clone();
        this.n3 = n3.clone();
        //
        return this;
    }
    //
    addUVs(uv1, uv2, uv3) {
        this.uv1 = uv1.clone();
        this.uv2 = uv2.clone();
        this.uv3 = uv3.clone();
        //
        return this;
    }
    //
    addUVColors(texture) {
        this.uv1Color = texture._mapUVToTexture(this.uv1);
        this.uv2Color = texture._mapUVToTexture(this.uv2);
        this.uv3Color = texture._mapUVToTexture(this.uv3);
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
