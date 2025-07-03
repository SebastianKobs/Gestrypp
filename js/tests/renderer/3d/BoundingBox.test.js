import { expect, test } from 'vitest';

import { BoundingBox } from '../../../modules/renderer/3d/BoundingBox.js';
import { Vector3 } from '../../../modules/math/Vector3.js';

test('BoundingBox constructor', () => {
    const min = new Vector3(0, 0, 0);
    const max = new Vector3(1, 1, 1);
    //
    const box = new BoundingBox(min, max);
    //
    expect(box.min).toEqual(min);
    expect(box.max).toEqual(max);
});
//
test('BoundingBox update', () => {
    const vertex = new Vector3(2, 3, 4);
    //
    const box = new BoundingBox();
    box.update(vertex);
    //
    expect(box.min).toEqual(vertex);
    expect(box.max).toEqual(vertex);
});
//
test('BoundingBox getCenter', () => {
    const box = new BoundingBox(new Vector3(0, 0, 0), new Vector3(2, 2, 2));
    //
    const center = box.getCenter();
    //
    expect(center).toEqual(new Vector3(1, 1, 1));
});
//
test('BoundingBox getScale', () => {
    const box = new BoundingBox(new Vector3(0, 0, 0), new Vector3(2, 2, 2));
    //
    const scale = box.getScale();
    //
    expect(scale).toBe(2);
});
//
test('BoundingBox scale', () => {
    const min = new Vector3(0, 0, 0);
    const max = new Vector3(2, 2, 2);
    //
    const box = new BoundingBox(min, max);
    box.scale(2);
    //
    expect(box.min).toEqual(new Vector3(0, 0, 0));
    expect(box.max).toEqual(new Vector3(4, 4, 4));
    expect(box.getScale()).toBe(4);
});
//
test('BoundingBox unity', () => {
    const box = new BoundingBox(new Vector3(0, 0, 0), new Vector3(2, 2, 2));
    box.unity();
    //
    expect(box.min).toEqual(new Vector3(-0.5, -0.5, -0.5));
    expect(box.max).toEqual(new Vector3(0.5, 0.5, 0.5));
    expect(box.getScale()).toBe(1);
    expect(box.getCenter()).toEqual(new Vector3(0, 0, 0));
});
