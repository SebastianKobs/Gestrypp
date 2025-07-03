import { expect, test } from 'vitest';
import { Vector3 } from './js/modules/math/Vector3.js';
import { Matrix4 } from './js/modules/math/Matrix4.js';

test('Matrix4 Identity', () => {
    const matrix = new Matrix4();
    //
    matrix.setIdentity();
    // prettier-ignore
    const identity = [
        1, 0, 0, 0, 
        0, 1, 0, 0, 
        0, 0, 1, 0, 
        0, 0, 0, 1
    ];
    //
    expect(matrix.elements).toEqual(identity);
});
//
test('Matrix4 Set', () => {
    const matrix = new Matrix4();
    //
    matrix.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
    //
    const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    //
    expect(matrix.elements).toEqual(result);
});
//
test('Matrix4 RotationX', () => {
    const rad = 0.5;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    //
    const matrix = Matrix4.RotationX(rad);
    // prettier-ignore
    const result =  [
        1, 0, 0, 0, 
        0, cos, sin, 0, 
        0, -sin, cos, 0, 
        0, 0, 0, 1
    ];
    //
    expect(matrix.elements).toEqual(result);
});
//
test('Matrix4 RotationY', () => {
    const rad = 0.5;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    //
    const matrix = Matrix4.RotationY(rad);
    // prettier-ignore
    const result = [
        cos, 0, sin, 0, 
        0, 1, 0, 0, 
        -sin, 0, cos, 0, 
        0, 0, 0, 1
    ];
    //
    expect(matrix.elements).toEqual(result);
});
//
test('Matrix4 RotationZ', () => {
    const rad = 0.5;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    //
    const matrix = Matrix4.RotationZ(rad);
    // prettier-ignore
    const result = [
        cos, -sin, 0, 0, 
        sin, cos, 0, 0, 
        0, 0, 1, 0, 
        0, 0, 0, 1
    ];
    //
    expect(matrix.elements).toEqual(result);
});
//
test('Matrix4 Translate', () => {
    const x = 1;
    const y = 2;
    const z = 3;
    //
    const matrix = Matrix4.Translate(x, y, z);
    // prettier-ignore
    const result = [
        1, 0, 0, 0, 
        0, 1, 0, 0, 
        0, 0, 1, 0, 
        x, y, z, 1
    ];
    //
    expect(matrix.elements).toEqual(result);
});
//
test('Matrix4 Multiply', () => {
    const a = new Matrix4();
    const b = new Matrix4();
    // prettier-ignore
    a.set(
        1, 2, 3, 4, 
        5, 6, 7, 8, 
        9, 10, 11, 12, 
        13, 14, 15, 16
    );
    // prettier-ignore
    b.set(
        16, 15, 14, 13, 
        12, 11, 10, 9, 
        8, 7, 6, 5, 
        4, 3, 2, 1
    );
    //
    const matrix = a.multiply(b);
    // prettier-ignore
    const result = [
            80, 70, 60, 50,
            240, 214, 188, 162,
            400, 358, 316, 274,
            560, 502, 444, 386
    ];
    //
    expect(matrix.elements).toEqual(result);
});
//
test('Matrix4 LookAt', () => {
    const eye = new Vector3(1, 1, 1);
    const target = new Vector3(0, 0, 0);
    const up = new Vector3(0, 1, 0);
    //
    const matrix = Matrix4.LookAt(eye, target, up);
    // prettier-ignore
    const result = [
        0.7071067690849304, -0.40824830532073975, 0.5773502588272095, 0, 
        0, 0.8164966106414795, 0.5773502588272095, 0, 
        -0.7071067690849304, -0.40824830532073975, 0.5773502588272095, 0, 
        -0, -0, -1.7320507764816284, 1,
    ];
    //
    matrix.elements.forEach((element, index) => {
        expect(element).toBeCloseTo(result[index], 5);
    });
});
//
test('Matrix4 Perspective', () => {
    const fov = 70 * (Math.PI / 180);
    const aspect = 1;
    const znear = 0.1;
    const zfar = 1000;
    //
    const matrix = Matrix4.Perspective(fov, aspect, znear, zfar);
    // prettier-ignore
    const result = [
        1.4281480312347412, 0, 0, 0, 
        0, 1.4281480312347412, 0, 0, 
        0, 0, -1.000100010001, 1, 
        0, 0,  0.1000100010001000, 0
    ];
    //
    matrix.elements.forEach((element, index) => {
        expect(element).toBeCloseTo(result[index], 5);
    });
});
