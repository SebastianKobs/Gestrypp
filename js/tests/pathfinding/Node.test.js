import { expect, test } from 'vitest';
import { Node } from '../../modules/pathfinding/Node.js';

test('Node f value getter', () => {
    const node = new Node(0, 0, true, 1, 5, 10);
    //
    expect(node.f).toBe(15);
});
//
