import { expect, test } from 'vitest';
import { GridData } from '../../modules/pathfinding/GridData.js';
import { Node } from '../../modules/pathfinding/Node.js';

test('GridData getNeighbors', () => {
    const grid = new GridData(3, 3);
    //
    const node = grid.getNodeAt(1, 1);
    //
    const neighbors = grid.getNeighbors(node);
    //
    expect(neighbors.size).toBe(8);
    //
    expect(neighbors.has('left')).toBe(true);
    expect(neighbors.has('right')).toBe(true);
    expect(neighbors.has('up')).toBe(true);
    expect(neighbors.has('down')).toBe(true);
    expect(neighbors.has('top-left')).toBe(true);
    expect(neighbors.has('top-right')).toBe(true);
    expect(neighbors.has('bottom-left')).toBe(true);
    expect(neighbors.has('bottom-right')).toBe(true);
});
//
test('GridData getNeighbors with out of bounds', () => {
    const grid = new GridData(3, 3);
    //
    const node = grid.getNodeAt(0, 0);
    //
    const neighbors = grid.getNeighbors(node);
    //
    expect(neighbors.size).toBe(3);
    //
    expect(neighbors.has('right')).toBe(true);
    expect(neighbors.has('down')).toBe(true);
    expect(neighbors.has('bottom-right')).toBe(true);
});
//
test('GridData getNeighbors without neighbors', () => {
    const grid = new GridData(1, 1);
    //
    const node = grid.getNodeAt(0, 0);
    //
    const neighbors = grid.getNeighbors(node);
    //
    expect(neighbors.size).toBe(0);
});
//
test('GridData getNeighbors with Node not in Grid', () => {
    const grid = new GridData(1, 1);
    //
    const node = new Node(10, 10, 1, 1);
    //
    const neighbors = grid.getNeighbors(node);
    //
    expect(neighbors.size).toBe(0);
});
