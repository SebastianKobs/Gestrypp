import { expect, test } from 'vitest';
import { Face } from '../../../modules/renderer/3d/Face.js';
import { Vector3 } from '../../../modules/math/Vector3.js';

const vertices = [new Vector3(1, 2, 3), new Vector3(4, 5, 6), new Vector3(7, 8, 9)];
const normals = [new Vector3(0.1, 0.2, 0.3), new Vector3(0.4, 0.5, 0.6), new Vector3(0.7, 0.8, 0.9)];
test('Face constructor', () => {
    const face = new Face(vertices[0], vertices[1], vertices[2]);
    //
    expect(face.v1).toStrictEqual(vertices[0]);
    expect(face.v2).toStrictEqual(vertices[1]);
    expect(face.v3).toStrictEqual(vertices[2]);
    //
    expect(face.n1).toBeNull();
    expect(face.n2).toBeNull();
    expect(face.n3).toBeNull();
});
//
test('Face addNormals', () => {
    const face = new Face(vertices[0], vertices[1], vertices[2]);
    face.addNormals(...normals);
    //
    expect(face.getNormals()).toStrictEqual(normals);
});
//
test('Face getVertices', () => {
    const face = new Face(vertices[0], vertices[1], vertices[2]);
    //
    expect(face.getVertices()).toEqual(vertices);
});
//
test('Face getNormals without set normals', () => {
    const face = new Face(vertices[0], vertices[1], vertices[2]);
    //
    expect(face.getNormals()).toEqual([null, null, null]);
});
//
