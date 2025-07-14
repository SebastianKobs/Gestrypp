'use strict';

export { AStar };

import { PriorityQueue, PriorityValueObject } from '../../collections/PriorityQueue.js';

class AStar {
    constructor(gridData) {
        this.gridData = gridData;
        //
        this.openSet = new PriorityQueue();
        this.closedSet = new Set();
    }
    //
    setStartNode(node) {
        this.startNode = node;
    }
    //
    setEndNode(node) {
        this.endNode = node;
    }
    //
    findPath() {
        if (!this.startNode || !this.endNode) {
            throw new Error('Start and end nodes must be set before finding a path.');
        }
        this.openSet.clear();
        //
        this.closedSet.clear();
        //
        this.openSet.insert(new PriorityValueObject(this.startNode, 1));
        //
        while (!this.openSet.isEmpty()) {
            const current = this.openSet.extractMin();
            //
            if (current === this.endNode) {
                return this._reconstructPath(current);
            }
            //
            this.closedSet.add(current);
            //
            const neighbors = this.gridData.getNeighbors(current).values();
            //
            for (const neighbor of neighbors) {
                if (this.closedSet.has(neighbor)) {
                    continue;
                }
                //
                const tentativeCost = current.g + this._heuristic(current, neighbor);
                //
                const known = neighbor.parent !== null;
                //
                if (known && tentativeCost >= neighbor.g) {
                    continue;
                }
                //
                neighbor.g = tentativeCost;
                neighbor.parent = current;
                //
                if (known) {
                    this.openSet.decreasePriority(neighbor, neighbor.f);
                } else {
                    neighbor.h = this._heuristic(neighbor, this.endNode);
                    //
                    this.openSet.insert(new PriorityValueObject(neighbor, neighbor.f));
                }
            }
        }
        //
        return [];
    }
    /**
     *
     * TODO: make that passable to override
     */
    _heuristic(a, b) {
        const dx = (a.x - b.x) ** 2;
        const dy = (a.y - b.y) ** 2;
        const h = Math.sqrt(dx + dy);
        //
        return Math.round(h * 1000);
    }
    //
    _reconstructPath(node) {
        const path = [];
        let current = node;
        //
        while (current) {
            path.push(current);
            current = current.parent;
        }
        //
        return path.reverse();
    }
}
