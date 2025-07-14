'use strict';

import { GridData } from '../../../grid/GridData.js';
import { AStarGrid } from './AStarGrid.js';
import { AStarNode } from '../AStarNode.js';
import { AStar } from '../AStar.js';
//

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    //
    const cellSize = 20;
    //
    const xElements = Math.floor(canvas.width / cellSize);
    const yElements = Math.floor(canvas.height / cellSize);
    //

    const gd = new GridData(xElements, yElements, AStarNode.Construct);
    //
    const g = new AStarGrid(gd, canvas, cellSize);
    //
    const aStar = new AStar(gd);
    //
    document.getElementById('find').addEventListener('pointerup', () => {
        try {
            gd.resetState();
            //
            aStar.setStartNode(gd.startCell);
            aStar.setEndNode(gd.endCell);
            //
            console.time('A* Pathfinding');
            //
            const path = aStar.findPath();
            //
            console.timeEnd('A* Pathfinding');
            //
            g.drawPath(path);
        } catch (error) {
            console.error('Error finding path:', error);
        }
    });
    //
    document.getElementById('reset').addEventListener('pointerup', () => {
        g.reset();
    });
});
