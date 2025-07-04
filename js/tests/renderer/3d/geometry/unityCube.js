'use strict';

export { unityCube };

import { Vector3 } from '../../../../modules/math/Vector3.js';
import { Mesh } from '../../../../modules/renderer/3d/Mesh.js';
import { Tri } from '../../../../modules/renderer/3d/Tri.js';

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
    cube.addTri(new Tri(2, 6, 7).addNormals(0, 0, 0));
    cube.addTri(new Tri(2, 7, 3).addNormals(0, 0, 0));
    cube.addTri(new Tri(0, 4, 5).addNormals(1, 1, 1));
    cube.addTri(new Tri(0, 5, 1).addNormals(1, 1, 1));
    cube.addTri(new Tri(6, 2, 1).addNormals(2, 2, 2));
    cube.addTri(new Tri(6, 1, 5).addNormals(2, 2, 2));
    cube.addTri(new Tri(3, 7, 4).addNormals(3, 3, 3));
    cube.addTri(new Tri(3, 4, 0).addNormals(3, 3, 3));
    cube.addTri(new Tri(7, 6, 5).addNormals(4, 4, 4));
    cube.addTri(new Tri(7, 5, 4).addNormals(4, 4, 4));
    cube.addTri(new Tri(2, 3, 0).addNormals(5, 5, 5));
    cube.addTri(new Tri(2, 0, 1).addNormals(5, 5, 5));

    cube.addNormal(new Vector3(1, 0, 0));
    cube.addNormal(new Vector3(-1, 0, 0));
    cube.addNormal(new Vector3(0, 1, 0));
    cube.addNormal(new Vector3(0, -1, 0));
    cube.addNormal(new Vector3(0, 0, 1));
    cube.addNormal(new Vector3(0, 0, -1));
    //
    return cube;
};
