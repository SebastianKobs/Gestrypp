'use strict';

export { unityCube };

import { Vector3 } from '../../../math/Vector3.js';
import { Mesh } from '../Mesh.js';
import { Tri } from '../Tri.js';

const unityCube = function () {
    const cube = new Mesh();
    //
    cube.addVertex(new Vector3(-0.5, -0.5, -0.5));
    cube.addVertex(new Vector3(-0.5, 0.5, -0.5));
    cube.addVertex(new Vector3(0.5, 0.5, -0.5));
    cube.addVertex(new Vector3(0.5, -0.5, -0.5));
    cube.addVertex(new Vector3(-0.5, -0.5, 0.5));
    cube.addVertex(new Vector3(-0.5, 0.5, 0.5));
    cube.addVertex(new Vector3(0.5, 0.5, 0.5));
    cube.addVertex(new Vector3(0.5, -0.5, 0.5));
    //
    cube.addTri(new Tri(2, 6, 7));
    cube.addTri(new Tri(2, 7, 3));
    cube.addTri(new Tri(0, 4, 5));
    cube.addTri(new Tri(0, 5, 1));
    cube.addTri(new Tri(6, 2, 1));
    cube.addTri(new Tri(6, 1, 5));
    cube.addTri(new Tri(3, 7, 4));
    cube.addTri(new Tri(3, 4, 0));
    cube.addTri(new Tri(7, 6, 5));
    cube.addTri(new Tri(7, 5, 4));
    cube.addTri(new Tri(2, 3, 0));
    cube.addTri(new Tri(2, 0, 1));
    //
    return cube;
};
