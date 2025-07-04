import { expect, test } from 'vitest';

import { unityCube } from './geometry/unityCube.js';

test('unityCube', () => {
    const cube = unityCube();
    //
    for (const vertex of cube.vertices) {
        expect(Math.abs(vertex.x)).toBe(0.5);
        expect(Math.abs(vertex.y)).toBe(0.5);
        expect(Math.abs(vertex.z)).toBe(0.5);
    }
});
