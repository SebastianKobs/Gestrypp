import { expect, test } from 'vitest';
import { Mesh } from '../../../modules/renderer/3d/Mesh.js';
import { Vector3 } from '../../../modules/math/Vector3.js';
import { Matrix4 } from '../../../modules/math/Matrix4.js';
import { unityCube } from '../../../modules/renderer/3d/testGeometry/unityCube';

test('Mesh getWorldMatrix', () => {
    const position = new Vector3(0, 0, 0);
    const rotation = new Vector3(0.5, 0.5, 0.5);
    const mesh = new Mesh(position, rotation);
    //
    const pitch = Matrix4.RotationX(rotation.x);
    const yaw = Matrix4.RotationY(rotation.y);
    const roll = Matrix4.RotationZ(rotation.z);
    //
    const translation = Matrix4.Translate(position.x, position.y, position.z);
    //
    const result = roll.multiply(pitch).multiply(yaw).multiply(translation);
    //
    const worldMatrix = mesh.getWorldMatrix();
    //
    expect(worldMatrix).toEqual(result);
});

test('unity', () => {
    const cube = unityCube();
    const cubeScaled = unityCube().scale(2);
    //
    cubeScaled.unity();
    //
    expect(cubeScaled.boundingBox.getScale()).toBe(cube.boundingBox.getScale());
    //
    expect(cubeScaled.boundingBox.getCenter()).toEqual(cube.boundingBox.getCenter());
    //
    for (const vertex of cube.vertices) {
        expect(Math.abs(vertex.x)).toBe(0.5);
        expect(Math.abs(vertex.y)).toBe(0.5);
        expect(Math.abs(vertex.z)).toBe(0.5);
    }
});
//
test('Mesh scale', () => {
    const cube = unityCube();
    cube.scale(2);
    expect(cube.boundingBox.getScale()).toEqual(2);
    //
    expect(cube.boundingBox.getCenter()).toEqual(new Vector3(0, 0, 0));
    //
    for (const vertex of cube.vertices) {
        expect(Math.abs(vertex.x)).toBe(1);
        expect(Math.abs(vertex.y)).toBe(1);
        expect(Math.abs(vertex.z)).toBe(1);
    }
});
