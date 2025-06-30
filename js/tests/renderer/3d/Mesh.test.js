import { expect, test } from 'vitest';
import { Mesh } from '../../../modules/renderer/3d/Mesh.js';
import { Vector3 } from '../../../modules/math/Vector3.js';
import { Matrix4 } from '../../../modules/math/Matrix4.js';

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
