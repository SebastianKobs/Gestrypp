'use strict';

import { PriorityQueue, PriorityValueObject } from '../../collections/PriorityQueue';

export { MinimumSpanningTree };

class MinimumSpanningTree {
    static buildMST(vertices) {
        const unexplored = new Set(vertices);
        const cheapestNodes = new PriorityQueue();
        const cheapestEdges = new Map();
        //
        const mst = [];
        //
        for (const node of vertices) {
            node.edgeCost = Infinity;
            //
            cheapestNodes.insert(new PriorityValueObject(node, node.edgeCost));
        }
        //
        cheapestNodes.decreasePriority(vertices[0], 0);
        //
        while (unexplored.size > 0) {
            const currentNode = cheapestNodes.extractMin();
            //
            unexplored.delete(currentNode);
            for (const neighbor of unexplored) {
                const edgeCost = MinimumSpanningTree._edgeCost(currentNode, neighbor);
                //
                if (edgeCost < neighbor.edgeCost) {
                    neighbor.edgeCost = edgeCost;
                    cheapestEdges.set(neighbor, { currentNode, neighbor });
                    cheapestNodes.decreasePriority(neighbor, edgeCost);
                }
            }
        }
        //
        for (const node of vertices) {
            if (cheapestEdges.has(node)) {
                mst.push(cheapestEdges.get(node));
            }
        }
        //
        return mst;
    }
    //
    static _edgeCost(a, b) {
        const dx = (a.x - b.x) ** 2;
        const dy = (a.y - b.y) ** 2;
        //
        const h = Math.sqrt(dx + dy);
        //
        return Math.round(h * 1000);
    }
}
