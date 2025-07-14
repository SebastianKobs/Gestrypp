'use strict';

export { Animator };

import { MinimumSpanningTree } from '../MinimumSpanningTree.js';
import { Vector3 } from '../../../math/Vector3.js';
import { Color } from '../../../utils/Color.js';
import { Clamp } from '../../../utils/Helper.js';
import { FPSLimiter } from '../../../utils/FPSLimiter.js';
//
const POINT_SIZE = 8;
const PATH_WIDTH = 4;
const POINT_COLOR = new Color(255, 255, 255, 0.5);
const USER_POINT_COLOR = new Color(128, 200, 100, 1);
const USER_POINT_COLORS_STATIC = new Color(240, 120, 60, 0.8);
const EDGE_COLOR = new Color(227, 20, 62, 0.5);
class Animator {
    constructor(canvas, numPoints = 30, fpsLimit = 120) {
        this.canvas = canvas;
        this.numPoints = numPoints;
        this.fpsLimit = fpsLimit;
        //
        this.points = [];
        this.ctx = canvas.transferControlToOffscreen().getContext('2d');
        //
        this.width = canvas.width;
        this.height = canvas.height;
    }
    //
    start() {
        this._resetPoints();
        //
        this.canvas.addEventListener('pointerup', this._canvasOnClick.bind(this));
        //
        this.fpsLimiter = new FPSLimiter(this.fpsLimit, this._update.bind(this));
        this.fpsLimiter.start();
    }
    //
    reset() {
        this._resetPoints();
    }
    //
    _resetPoints() {
        this.points.length = 0;
        //
        for (let i = 0; i < this.numPoints; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const velocity = new Vector3(Math.random() * 2 + 1, Math.random() * 2 + 1, 0);
            // prettier-ignore
            this.points.push({ 
                x: x, 
                y: y, 
                edgeCost: Infinity, 
                v: velocity,
                color: POINT_COLOR
             });
        }
    }
    //
    _drawPoints() {
        for (const point of this.points) {
            this.ctx.fillStyle = point.color.toString();
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, POINT_SIZE, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    //
    _animatePoints() {
        for (const point of this.points) {
            if (Math.random() < 0.05) {
                const angleInRad = Math.random() * 360 * (Math.PI / 180);
                //
                point.v = new Vector3(
                    point.v.x * Math.cos(angleInRad) - point.v.y * Math.sin(angleInRad),
                    point.v.x * Math.sin(angleInRad) + point.v.y * Math.cos(angleInRad)
                );
            }
            //
            point.x += point.v.x;
            point.y += point.v.y;
            point.edgeCost = Infinity;
            //
            const pHalfSize = POINT_SIZE / 2;
            //
            if (point.x < pHalfSize || point.x > this.width - pHalfSize) {
                point.v.x = -point.v.x;
                //
                point.x = Clamp(point.x, pHalfSize, this.width - pHalfSize);
            }
            if (point.y < pHalfSize || point.y > this.height - pHalfSize) {
                point.v.y = -point.v.y;
                //
                point.y = Clamp(point.y, pHalfSize, this.height - pHalfSize);
            }
        }
    }
    //
    _drawEdges(edges) {
        this.ctx.strokeStyle = EDGE_COLOR;
        this.ctx.lineWidth = PATH_WIDTH;
        for (const edge of edges) {
            this.ctx.beginPath();
            this.ctx.moveTo(edge.currentNode.x, edge.currentNode.y);
            this.ctx.lineTo(edge.neighbor.x, edge.neighbor.y);
            this.ctx.stroke();
        }
    }
    //
    _update() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        //
        this._animatePoints();
        this._drawPoints();
        //
        const mst = MinimumSpanningTree.buildMST(this.points);
        this._drawEdges(mst);
    }
    //
    _canvasOnClick(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        //
        const velocity = event.shiftKey ? new Vector3() : new Vector3(Math.random() * 2 + 1, Math.random() * 2 + 1, 0);
        //
        const color = event.shiftKey ? USER_POINT_COLORS_STATIC : USER_POINT_COLOR;
        this.points.push({ x, y, g: Infinity, v: velocity, color: color });
    }
    //
    _handleFreezeButton() {
        if (this.fpsLimiter.running) {
            this.fpsLimiter.stop();
            document.getElementById('freeze').textContent = 'Unfreeze';
        } else {
            this.fpsLimiter.start();
            document.getElementById('freeze').textContent = 'Freeze';
        }
    }
}
