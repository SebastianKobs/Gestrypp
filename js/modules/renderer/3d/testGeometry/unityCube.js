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
    /**
     * f 2/1/1 3/2/1 4/3/1
f 8/1/2 7/4/2 6/5/2
f 5/6/3 6/7/3 2/8/3
f 6/8/4 7/5/4 3/4/4
f 3/9/5 7/10/5 8/11/5
f 1/12/6 4/13/6 8/11/6
f 1/4/1 2/1/1 4/3/1
f 5/14/2 8/1/2 6/5/2
f 1/12/3 5/6/3 2/8/3
f 2/12/4 6/8/4 3/4/4
f 4/13/5 3/9/5 8/11/5
f 5/6/6 1/12/6 8/11/6
     */
    cube.addTri(new Tri(1, 2, 3));
    cube.addTri(new Tri(7, 6, 5));
    cube.addTri(new Tri(4, 5, 1));
    cube.addTri(new Tri(5, 6, 2));
    cube.addTri(new Tri(2, 6, 7));
    cube.addTri(new Tri(0, 3, 7));
    cube.addTri(new Tri(0, 1, 3));
    cube.addTri(new Tri(4, 7, 5));
    cube.addTri(new Tri(0, 4, 1));
    cube.addTri(new Tri(1, 5, 2));
    cube.addTri(new Tri(3, 2, 7));
    cube.addTri(new Tri(4, 0, 7));
    //
    return cube;
};
