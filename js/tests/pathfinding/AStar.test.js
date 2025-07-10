import { expect, test } from 'vitest';
import { GridData } from '../../modules/pathfinding/GridData.js';
import { AStar } from '../../modules/pathfinding/AStar.js';

test('AStar findPath', () => {
    const grid = new GridData(3, 3);
    //
    const startNode = grid.getNodeAt(0, 0);
    const endNode = grid.getNodeAt(2, 2);
    //
    const astar = new AStar(grid);
    //
    astar.setStartNode(startNode);
    astar.setEndNode(endNode);
    //
    const path = astar.findPath();
    //
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toBe(startNode);
    expect(path[path.length - 1]).toBe(endNode);
});
/**
 *  s x w
 *  x x w
 *  w w e
 */
test('AStar findPath with no path', () => {
    const grid = new GridData(3, 3);
    //
    grid.getNodeAt(0, 1).walkable = false;
    grid.getNodeAt(1, 0).walkable = false;
    grid.getNodeAt(1, 1).walkable = false;
    //
    const startNode = grid.getNodeAt(0, 0);
    const endNode = grid.getNodeAt(1, 1);
    //
    const astar = new AStar(grid);
    astar.setStartNode(startNode);
    astar.setEndNode(endNode);
    const path = astar.findPath();
    //
    console.log(path);
    expect(path.length).toBe(0);
});
/**
 * s x w w w
 * w x w w w
 * w x w w w
 * w x w w w
 * w w w w e
 */
test('AStar findPath with non trivial path', () => {
    const grid = new GridData(5, 5);
    //
    grid.getNodeAt(1, 0).walkable = false;
    grid.getNodeAt(1, 1).walkable = false;
    grid.getNodeAt(1, 2).walkable = false;
    grid.getNodeAt(1, 3).walkable = false;
    //
    const startNode = grid.getNodeAt(0, 0);
    const endNode = grid.getNodeAt(4, 4);
    //
    const astar = new AStar(grid);
    //
    astar.setStartNode(startNode);
    astar.setEndNode(endNode);
    //
    const path = astar.findPath();
    //
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toBe(startNode);
    expect(path[path.length - 1]).toBe(endNode);
    //
    path.shift();
    path.pop();
    //
    expect(path.length).toBe(6);
    //
    expect(path[0].x).toBe(0);
    expect(path[0].y).toBe(1);
    //
    expect(path[1].x).toBe(0);
    expect(path[1].y).toBe(2);
    //
    expect(path[2].x).toBe(0);
    expect(path[2].y).toBe(3);
    //
    expect(path[3].x).toBe(1);
    expect(path[3].y).toBe(4);
    //
    expect(path[4].x).toBe(2);
    expect(path[4].y).toBe(4);
    //
    expect(path[5].x).toBe(3);
    expect(path[5].y).toBe(4);
});
