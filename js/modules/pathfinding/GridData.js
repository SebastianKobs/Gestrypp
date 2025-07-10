'use strict';

export { GridData };

import { Node } from './Node.js';

class GridData {
    constructor(xElements, yElements) {
        this.xElements = xElements;
        this.yElements = yElements;
        //
        this.startNode = null;
        this.endNode = null;
        //
        this.reset();
    }
    //
    getNeighbors(node) {
        const neighbors = new Map();
        //
        const directions = [
            {
                direction: 'left',
                x: -1,
                y: 0,
            },
            {
                direction: 'right',
                x: 1,
                y: 0,
            },
            {
                direction: 'up',
                x: 0,
                y: -1,
            },
            {
                direction: 'down',
                x: 0,
                y: 1,
            },
            {
                direction: 'top-left',
                x: -1,
                y: -1,
            },
            {
                direction: 'top-right',
                x: 1,
                y: -1,
            },
            {
                direction: 'bottom-left',
                x: -1,
                y: 1,
            },
            {
                direction: 'bottom-right',
                x: 1,
                y: 1,
            },
        ];
        //
        for (const dir of directions) {
            const newX = node.x + dir.x;
            const newY = node.y + dir.y;
            //
            if (newX < 0 || newX > this.xElements - 1 || newY < 0 || newY > this.yElements - 1) {
                continue;
            }
            //
            const neighborIndex = newY * this.xElements + newX;
            //
            if (!this.nodes[neighborIndex].walkable) {
                continue;
            }
            //
            neighbors.set(dir.direction, this.nodes[neighborIndex]);
        }
        //
        return neighbors;
    }
    //
    getNodeAt(x, y) {
        const index = y * this.xElements + x;
        //
        return this.nodes[index];
    }
    //
    reset() {
        this.nodes = [];
        //
        for (let y = 0; y < this.yElements; y++) {
            for (let x = 0; x < this.xElements; x++) {
                this.nodes[y * this.xElements + x] = new Node(x, y, true, 1);
            }
        }
    }
}
