'use strict';

import { Grid } from '../Grid.js';
import { GridData } from '../GridData.js';
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
    const gd = new GridData(xElements, yElements);
    //
    const g = new Grid(gd, cellSize, canvas);
    //
    const aStar = new AStar(gd);
    //
    document.getElementById('find').addEventListener('click', () => {
        try {
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
    document.getElementById('reset').addEventListener('click', () => {
        g.reset();
    });
});
