'use strict';

export { unityCube };

import { Vector3 } from '../../../math/Vector3.js';
import { Mesh } from '../Mesh.js';
import { Tri } from '../Tri.js';

const unityCube = function () {
    const cube = new Mesh();
    //
    cube.addVertex(new Vector3(-0.5, 0.5, 0.5));
    cube.addVertex(new Vector3(0.5, 0.5, 0.5));
    cube.addVertex(new Vector3(-0.5, -0.5, 0.5));
    cube.addVertex(new Vector3(0.5, -0.5, 0.5));
    cube.addVertex(new Vector3(-0.5, 0.5, -0.5));
    cube.addVertex(new Vector3(0.5, 0.5, -0.5));
    cube.addVertex(new Vector3(0.5, -0.5, -0.5));
    cube.addVertex(new Vector3(-0.5, -0.5, -0.5));
    //
    cube.addTri(new Tri(0, 1, 2));
    cube.addTri(new Tri(1, 2, 3));
    cube.addTri(new Tri(1, 3, 6));
    cube.addTri(new Tri(1, 5, 6));
    cube.addTri(new Tri(0, 1, 4));
    cube.addTri(new Tri(1, 4, 5));
    cube.addTri(new Tri(2, 3, 7));
    cube.addTri(new Tri(3, 6, 7));
    cube.addTri(new Tri(0, 2, 7));
    cube.addTri(new Tri(0, 4, 7));
    cube.addTri(new Tri(4, 5, 6));
    cube.addTri(new Tri(4, 6, 7));
    //
    return cube;
};
