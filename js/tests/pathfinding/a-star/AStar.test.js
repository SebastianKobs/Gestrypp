import { expect, test } from 'vitest';
import { GridData } from '../../../modules/grid/GridData.js';
import { AStar } from '../../../modules/pathfinding/a-star/AStar.js';
import { AStarNode } from '../../../modules/pathfinding/a-star/AStarNode.js';

test('AStar findPath', () => {
    const grid = new GridData(3, 3, AStarNode.Construct);
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
    const grid = new GridData(3, 3, AStarNode.Construct);
    //
    grid.getNodeAt(0, 1).occupied = true;
    grid.getNodeAt(1, 0).occupied = true;
    grid.getNodeAt(1, 1).occupied = true;
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
    const grid = new GridData(5, 5, AStarNode.Construct);
    //
    grid.getNodeAt(1, 0).occupied = true;
    grid.getNodeAt(1, 1).occupied = true;
    grid.getNodeAt(1, 2).occupied = true;
    grid.getNodeAt(1, 3).occupied = true;
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

test('Node f value getter', () => {
    const node = new AStarNode(0, 0, true, 5, 10);
    //
    expect(node.f).toBe(15);
});
//
