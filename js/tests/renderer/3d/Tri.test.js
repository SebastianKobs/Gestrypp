import { expect, test } from 'vitest';
import { Tri } from '../../../modules/renderer/3d/Tri.js';

test('Tri constructor', () => {
    const tri = new Tri(1, 2, 3);
    //
    expect(tri.v1).toBe(1);
    expect(tri.v2).toBe(2);
    expect(tri.v3).toBe(3);
    //
    expect(tri.n1).toBeNull();
    expect(tri.n2).toBeNull();
    expect(tri.n3).toBeNull();
});
//
test('Tri addNormals', () => {
    const tri = new Tri(1, 2, 3);
    tri.addNormals(0.1, 0.2, 0.3);
    //
    expect(tri.n1).toBe(0.1);
    expect(tri.n2).toBe(0.2);
    expect(tri.n3).toBe(0.3);
});
//
test('Tri getVertices', () => {
    const tri = new Tri(1, 2, 3);
    //
    expect(tri.getVertices()).toEqual([1, 2, 3]);
});
//
test('Tri getNormals with set normals', () => {
    const tri = new Tri(1, 2, 3);
    tri.addNormals(0.1, 0.2, 0.3);
    //
    expect(tri.getNormals()).toEqual([0.1, 0.2, 0.3]);
});
//
test('Tri getNormals without set normals', () => {
    const tri = new Tri(1, 2, 3);
    //
    expect(tri.getNormals()).toEqual([null, null, null]);
});
//
