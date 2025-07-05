'use strict';

export { unityCube };

import { Vector3 } from '../../../../modules/math/Vector3.js';
import { Mesh } from '../../../../modules/renderer/3d/Mesh.js';
import { Face } from '../../../../modules/renderer/3d/Face.js';

const unityCube = function () {
    const cube = new Mesh();
    //
    const vertices = [
        new Vector3(-0.5, -0.5, -0.5),
        new Vector3(-0.5, 0.5, -0.5),
        new Vector3(0.5, 0.5, -0.5),
        new Vector3(0.5, -0.5, -0.5),
        new Vector3(-0.5, -0.5, 0.5),
        new Vector3(-0.5, 0.5, 0.5),
        new Vector3(0.5, 0.5, 0.5),
        new Vector3(0.5, -0.5, 0.5),
    ];
    //
    const normals = [
        new Vector3(1, 0, 0),
        new Vector3(-1, 0, 0),
        new Vector3(0, 1, 0),
        new Vector3(0, -1, 0),
        new Vector3(0, 0, 1),
        new Vector3(0, 0, -1),
    ];
    for (const vertex of vertices) {
        cube.updateBoundingBox(vertex);
    }
    //
    cube.addFace(new Face(vertices[2], vertices[6], vertices[7]).addNormals(normals[0], normals[0], normals[0]));
    cube.addFace(new Face(vertices[2], vertices[7], vertices[3]).addNormals(normals[0], normals[0], normals[0]));
    cube.addFace(new Face(vertices[0], vertices[4], vertices[5]).addNormals(normals[1], normals[1], normals[1]));
    cube.addFace(new Face(vertices[0], vertices[5], vertices[1]).addNormals(normals[1], normals[1], normals[1]));
    cube.addFace(new Face(vertices[6], vertices[2], vertices[1]).addNormals(normals[2], normals[2], normals[2]));
    cube.addFace(new Face(vertices[6], vertices[1], vertices[5]).addNormals(normals[2], normals[2], normals[2]));
    cube.addFace(new Face(vertices[3], vertices[7], vertices[4]).addNormals(normals[3], normals[3], normals[3]));
    cube.addFace(new Face(vertices[3], vertices[4], vertices[0]).addNormals(normals[3], normals[3], normals[3]));
    cube.addFace(new Face(vertices[7], vertices[6], vertices[5]).addNormals(normals[4], normals[4], normals[4]));
    cube.addFace(new Face(vertices[7], vertices[5], vertices[4]).addNormals(normals[4], normals[4], normals[4]));
    cube.addFace(new Face(vertices[2], vertices[3], vertices[0]).addNormals(normals[5], normals[5], normals[5]));
    cube.addFace(new Face(vertices[2], vertices[0], vertices[1]).addNormals(normals[5], normals[5], normals[5]));
    //
    return cube;
};
