'use strict';

export { LineRenderer };
//
import { Color } from '../utils/Color.js';
//
class LineRenderer {
    strokeStyleStem = new Color(61, 46, 43, 0.5);
    strokeStyleStem2 = new Color(79, 77, 57, 0.3);
    strokeStyleBranch = new Color(46, 86, 51, 0.2);
    strokeStylePetal = new Color(235, 235, 235, 0.6);
    currentBranchColor = this.strokeStyleBranch;
    //
    petalPropability = 0.004;
    petalRadius = 5;
    //
    scale = 1;
    //
    marginY = 200;
    marginX = 100;
    //
    constructor(canvas) {
        const offscreen = canvas.transferControlToOffscreen();
        this.ctx = offscreen.getContext('2d');
        //
        this.resizeCanvas();
    }
    //
  
    render(gestrypp) {
        let lineWidth = 1;
        let strokeStyle = (this.currentBranchColor = this.strokeStyleBranch);
        //
        this.ctx.globalAlpha = 1;
        //
        this.ctx.fillStyle = '#cdcdcd';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        //
        gestrypp.location.set(this.ctx.canvas.width / 2, this.ctx.canvas.height);
        gestrypp.scale(this.scale);
        //
        for (const branch of gestrypp.branches) {
            this.ctx.beginPath();
            //
            strokeStyle = this.currentBranchColor;
            lineWidth = 1;
            //
            if (branch.depth === 0) {
                lineWidth = 10;
                strokeStyle = this.strokeStyleStem;
            } else if (branch.depth === 1) {
                lineWidth = 3;
                strokeStyle = this.strokeStyleStem2;
            } else if (branch.depth > 4) {
                strokeStyle = new Color(
                    Math.max(0, 255 - branch.depth * 40),
                    this.strokeStyleBranch.g,
                    Math.max(0, this.strokeStyleBranch.b - branch.depth * 10),
                    0.3
                );
            }
            //
            const start = branch.location.addVector3(gestrypp.location);

            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineWidth = lineWidth;
            this.ctx.strokeStyle = strokeStyle.toString();
            //
            for (const vertex of branch.vertices) {
                const p = vertex.addVector3(branch.location).addVector3(gestrypp.location);
                this.ctx.lineTo(p.x, p.y);
            }
            //
            const peak = branch.peak().addVector3(branch.location).addVector3(gestrypp.location);
            //
            this.ctx.globalAlpha = this._getAlpha(peak, branch.depth);
            this.ctx.stroke();
            //
            if (Math.random() < this.petalPropability && branch.depth > 0) {
                this._drawPetal(peak, this.petalRadius);
            }
        }
    }
    //
    _drawPetal(position, radius) {
        this.ctx.beginPath();
        this.ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
        //
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.strokeStylePetal;
        this.ctx.fillStyle = this.strokeStylePetal;
        this.ctx.fill();
        this.ctx.stroke();
    }
    //
    _getAlpha(position, depth) {
        let alphaY = 1;
        let alphaX = 1;
        //
        const x = position.x;
        const y = position.y;
        //
        if (y < this.marginY) {
            alphaY = Math.max(0, y) / this.marginY;
        } else if (y > this.ctx.canvas.height - this.marginY && depth > 0) {
            const bottom = Math.min(y, this.ctx.canvas.height);
            alphaY = (this.ctx.canvas.height - bottom) / this.marginY;
        }
        if (x < this.marginX) {
            alphaX = Math.max(0, x) / this.marginX;
        } else if (x > this.ctx.canvas.width - this.marginX) {
            const right = Math.min(x, this.ctx.canvas.width);
            alphaX = (this.ctx.canvas.width - right) / this.marginX;
        }
        //
        return Math.min(alphaY, alphaX);
    }
    resizeCanvas() {
        this.ctx.canvas.width = document.getElementById('container').clientWidth;
        this.ctx.canvas.height = document.getElementById('container').clientHeight;
    }
}
