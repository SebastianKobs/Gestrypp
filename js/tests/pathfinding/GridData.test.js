import { expect, test } from 'vitest';
import { GridData } from '../../modules/grid/GridData.js';
import { Node } from '../../modules/grid/Node.js';

test('GridData getNeighbors', () => {
    const grid = new GridData(3, 3, Node.Construct);
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
    const grid = new GridData(3, 3, Node.Construct);
    //
    const node = grid.getNodeAt(0, 0);
    //
    const neighbors = grid.getNeighbors(node);
    //
    expect(neighbors.size).toBe(3);
    //
    expect(neighbors.has('right')).toBe(true);
    expect(neighbors.has('bottom-right')).toBe(true);
    expect(neighbors.has('down')).toBe(true);
});
//
test('GridData getNeighbors without neighbors', () => {
    const grid = new GridData(1, 1, Node.Construct);
    //
    const node = grid.getNodeAt(0, 0);
    //
    const neighbors = grid.getNeighbors(node);
    //
    expect(neighbors.size).toBe(0);
});
//
test('GridData getNeighbors with Node not in Grid', () => {
    const grid = new GridData(1, 1, Node.Construct);
    //
    const node = new Node(10, 10, 1, 1);
    //
    const neighbors = grid.getNeighbors(node);
    //
    expect(neighbors.size).toBe(0);
});
//
test('GridData getNodeAt', () => {
    const grid = new GridData(3, 3, Node.Construct);
    //
    const node = grid.getNodeAt(1, 1);
    //
    expect(node).toBeInstanceOf(Node);
    expect(node.x).toBe(1);
    expect(node.y).toBe(1);
});
//
test('GridData getNodeAt out of bounds', () => {
    const grid = new GridData(3, 3, Node.Construct);
    //
    const node = grid.getNodeAt(-1, -1);
    //
    expect(node).toBeNull();
});
//
test('GridData getOccupiedNodes', () => {
    const grid = new GridData(3, 3, Node.Construct);
    //
    const occupiedNodes = grid.getOccupiedNodes();
    //
    expect(occupiedNodes.length).toBe(0);
    //
    grid.getNodeAt(1, 1).occupied = true;
    //
    const occupiedNodesAfter = grid.getOccupiedNodes();
    //
    expect(occupiedNodesAfter.length).toBe(1);
    expect(occupiedNodesAfter[0]).toBe(grid.getNodeAt(1, 1));
});

test('GridData reset', () => {
    const grid = new GridData(3, 3, Node.Construct);
    //
    grid.getNodeAt(1, 1).occupied = true;
    //
    const occupiedNodesBefore = grid.getOccupiedNodes();
    //
    expect(occupiedNodesBefore.length).toBe(1);
    expect(occupiedNodesBefore[0]).toBe(grid.getNodeAt(1, 1));
    //
    grid.reset();
    //
    const occupiedNodesAfter = grid.getOccupiedNodes();
    //
    expect(occupiedNodesAfter.length).toBe(0);
});
