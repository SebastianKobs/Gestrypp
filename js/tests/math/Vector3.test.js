import { expect, test } from 'vitest';
import { Vector3 } from './js/modules/math/Vector3.js';
import { Matrix4 } from './js/modules/math/Matrix4.js';

//test set
test('Vector3 set', () => {
    const v = new Vector3();
    v.set(1, 2, 3);
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
    expect(v.z).toBe(3);
});
//
test('Vector3 add', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = v1.add(v2);
    //
    expect(result.x).toBe(5);
    expect(result.y).toBe(7);
    expect(result.z).toBe(9);
});

//
test('Vector3 addVector3', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = v1.addVector3(v2);
    //
    expect(result.x).toBe(5);
    expect(result.y).toBe(7);
    expect(result.z).toBe(9);
});
//
test('Vector3 subtract', () => {
    const v1 = new Vector3(5, 7, 9);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = v1.subtract(v2);
    //
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
    expect(result.z).toBe(3);
});
//
test('Vector3 subtractVector3', () => {
    const v1 = new Vector3(5, 7, 9);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = v1.subtract(v2);
    //
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
    expect(result.z).toBe(3);
});
//
test('Vector3 multiply', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = v1.multiply(v2);
    //
    expect(result.x).toBe(4);
    expect(result.y).toBe(10);
    expect(result.z).toBe(18);
});

//
test('Vector3 multiplyVector3', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = v1.multiplyVector3(v2);
    //
    expect(result.x).toBe(4);
    expect(result.y).toBe(10);
    expect(result.z).toBe(18);
});
//
test('Vector3 dot product', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = v1.dot(v2);
    //
    expect(result).toBe(32); // 1*4 + 2*5 + 3*6
});
//
test('Vector3 cross product', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = v1.cross(v2);
    //
    expect(result.x).toBe(-3);
    expect(result.y).toBe(6);
    expect(result.z).toBe(-3); // (2*6 - 3*5, 3*4 - 1*6, 1*5 - 2*4)
});
//
test('Vector3 multiplyScalar', () => {
    const v = new Vector3(1, 2, 3);
    const scalar = 2;
    //
    const result = v.multiplyScalar(scalar);
    //
    expect(result.x).toBe(2);
    expect(result.y).toBe(4);
    expect(result.z).toBe(6);
});
//
test('Vector3 divideScalar', () => {
    const v = new Vector3(2, 4, 6);
    const scalar = 2;
    //
    const result = v.divideScalar(scalar);
    //
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
    expect(result.z).toBe(3);
});
//
test('Vector3 length', () => {
    const v = new Vector3(3, 4, 0);
    //
    const result = v.length();
    //
    expect(result).toBe(5); // sqrt(3^2 + 4^2)
});
//
test('Vector3 normalize', () => {
    const v = new Vector3(3, 4, 0);
    //
    const result = v.normalize();
    //
    expect(result.x).toBeCloseTo(0.6, 5); // 3/5
    expect(result.y).toBeCloseTo(0.8, 5); // 4/5
    expect(result.z).toBe(0);
    //
    expect(result.length()).toBe(1);
});
//
test('Vector3 clone', () => {
    const v = new Vector3(1, 2, 3);
    //
    const clone = v.clone();
    //
    expect(clone.x).toBe(1);
    expect(clone.y).toBe(2);
    expect(clone.z).toBe(3);
    //
    expect(clone).not.toBe(v); // Ensure it's a different instance
});
//
test('Vector3 toString', () => {
    const v = new Vector3(1, 2, 3);
    //
    const str = v.toString();
    //
    expect(str).toBe('Vector3(1, 2, 3)');
});
//
test('Vector3 static Subtract', () => {
    const v1 = new Vector3(5, 7, 9);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = Vector3.Subtract(v1, v2);
    //
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
    expect(result.z).toBe(3);
});
//
test('Vector3 static Cross', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = Vector3.Cross(v1, v2);
    //
    expect(result.x).toBe(-3);
    expect(result.y).toBe(6);
    expect(result.z).toBe(-3); // (2*6 - 3*5, 3*4 - 1*6, 1*5 - 2*4)
});
//
test('Vector3 static Dot', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    //
    const result = Vector3.Dot(v1, v2);
    //
    expect(result).toBe(32); // 1*4 + 2*5 + 3*6
});
//
test('Vector3 transformCoordinate', () => {
    const v = new Vector3(1, 2, 3);
    const matrix = new Matrix4();
    //
    const result = v.transformCoordinate(matrix);
    //
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
    expect(result.z).toBe(3);
});
