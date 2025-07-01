'use strict';

export { unityCube };

import { Vector3 } from '../../../math/Vector3.js';
import { Mesh } from '../Mesh.js';

const unityCube = function () {
    const cube = new Mesh();
    //
    cube.addVertex(new Vector3(-0.5, -0.5, -0.5));
    cube.addVertex(new Vector3(0.5, -0.5, -0.5));
    cube.addVertex(new Vector3(0.5, 0.5, -0.5));
    cube.addVertex(new Vector3(-0.5, 0.5, -0.5));
    cube.addVertex(new Vector3(-0.5, -0.5, 0.5));
    cube.addVertex(new Vector3(0.5, -0.5, 0.5));
    cube.addVertex(new Vector3(0.5, 0.5, 0.5));
    cube.addVertex(new Vector3(-0.5, 0.5, 0.5));
    //
    return cube;
};
