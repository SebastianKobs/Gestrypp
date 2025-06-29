'use strict';

import { Vector3 } from '../math/Vector3.js';

export {  Gestrypp };

class Gestrypp {
    location = new Vector3();
    //
    branches = [];
    //
    boundingBox = {
        t: 0,
        l: 0,
        b: 0,
        r: 0,
    };
    //
    constructor(branches, boundingBox) {
        this.branches = branches;
        this.boundingBox = boundingBox;
    }
    //
    scale(scalar) {
        for (const branch of this.branches) {
            branch.scale(scalar);
        }
    }
   
}