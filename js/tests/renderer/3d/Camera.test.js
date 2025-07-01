import { expect, test } from 'vitest';
import { Camera } from './js/modules/renderer/3d/Camera.js';
import { Vector3 } from './js/modules/math/Vector3.js';

test('Camera getViewMatrix', () => {
    const position = new Vector3(1, 1, 1);
    const target = new Vector3(0, 0, 0);
    const up = new Vector3(0, 1, 0);
    const camera = new Camera(position, target, up);
    //
    const viewMatrix = camera.getViewMatrix();
    // prettier-ignore
    const result = [
        0.7071067690849304, -0.40824830532073975, 0.5773502588272095, 0, 
        0, 0.8164966106414795, 0.5773502588272095, 0, 
        -0.7071067690849304, -0.40824830532073975, 0.5773502588272095, 0, 
        -0, -0, -1.7320507764816284, 1,
    ];
    //
    viewMatrix.elements.forEach((element, index) => {
        expect(element).toBeCloseTo(result[index], 5);
    });
});
//
test('Camera getProjectionMatrix', () => {
    const position = new Vector3(1, 1, 1);
    const target = new Vector3(0, 0, 0);
    const up = new Vector3(0, 1, 0);
    const camera = new Camera(position, target, up, 1, 70);
    //
    const projectionMatrix = camera.getProjectionMatrix();
    // prettier-ignore
    const result = [
        1.4281480312347412, 0, 0, 0, 
        0, 1.4281480312347412, 0, 0, 
        0, 0, -1.000100010001, 1, 
        0, 0,  0.1000100010001000, 0
    ];
    //
    projectionMatrix.elements.forEach((element, index) => {
        expect(element).toBeCloseTo(result[index], 5);
    });
});
