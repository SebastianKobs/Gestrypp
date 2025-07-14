'use strict';

import { MstGrid } from './MstGrid.js';
import { GridData } from '../../../grid/GridData.js';
import { MSTNode } from '../MSTNode.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    //
    const cellSize = 20;
    //
    const xElements = Math.floor(canvas.width / cellSize);
    const yElements = Math.floor(canvas.height / cellSize);
    //
    const gd = new GridData(xElements, yElements, MSTNode.Construct);
    //
    const g = new MstGrid(gd, canvas, cellSize);
    //
    document.getElementById('reset').addEventListener('pointerup', () => {
        g.reset();
    });
});
