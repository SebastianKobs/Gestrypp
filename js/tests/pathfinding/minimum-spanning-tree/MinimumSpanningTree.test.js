import { expect, test } from 'vitest';
import { GridData } from '../../../modules/grid/GridData.js';
import { MinimumSpanningTree } from '../../../modules/pathfinding/minimum-spanning-tree/MinimumSpanningTree.js';
import { MSTNode } from '../../../modules/pathfinding/minimum-spanning-tree/MSTNode.js';

/* * 0 1 2 3 4
 * 0 x w w w w
 * 1 . w w w w
 * 2 .  . x w
 * 3 x . w w .
 * 4 w w w w x
 */
test('MinimumSpanningTree findMST', () => {
    const gridData = new GridData(5, 5, MSTNode.Construct);
    //
    gridData.getNodeAt(0, 0).occupied = true;
    gridData.getNodeAt(4, 4).occupied = true;
    gridData.getNodeAt(0, 3).occupied = true;
    gridData.getNodeAt(3, 2).occupied = true;
    //
    const mstPath = MinimumSpanningTree.buildMST(gridData.getOccupiedNodes());
    //
    expect(mstPath.length).toBeGreaterThan(0);
    expect(mstPath[0].currentNode).toBe(gridData.getNodeAt(0, 3));
    expect(mstPath[0].neighbor).toBe(gridData.getNodeAt(3, 2));
    expect(mstPath[1].currentNode).toBe(gridData.getNodeAt(0, 0));
    expect(mstPath[1].neighbor).toBe(gridData.getNodeAt(0, 3));
    expect(mstPath[2].currentNode).toBe(gridData.getNodeAt(3, 2));
    expect(mstPath[2].neighbor).toBe(gridData.getNodeAt(4, 4));
});
