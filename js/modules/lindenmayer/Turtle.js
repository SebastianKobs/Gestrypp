'use strict';

export { Turtle};

import { Gestrypp } from './Gestrypp.js';
import { Branch } from './Branch.js';

class Turtle {
    branchX = 0;
    branchY = 0;
    //
    currentX = 0;
    currentY = 0;
    //
    minX = Infinity;
    minY = Infinity;
    maxX = 0;
    maxY = 0;
    //
    angle = 270;
    //
    stack = [];
    branches = [];
    currentBranch = 0;
    //
    constructor() {
        this.reset();
    }

    gestrypp() {
        return new Gestrypp(this.branches, {
            t: this.minY,
            l: this.minX,
            b: this.maxY,
            r: this.maxX,
        });
    }
    //
    step(length) {
        if (this.stack.length === 0) {
            length *= 0.5;
        } else if (this.stack.length === 1) {
            length *= 0.7;
        } 
        //
        const rad = (this.angle * Math.PI) / 180;
        //
        const xOffset = length * Math.cos(rad);
        const yOffset = length * Math.sin(rad);
        //
        this.currentX += xOffset;
        this.currentY += yOffset;
        //
        this.branchX += xOffset;
        this.branchY += yOffset;
        //
        if (this.currentY < this.minY) {
            this.minY = this.currentY;
        } else if (this.currentY > this.maxY) {
            this.maxY = this.currentY;
        }
        if (this.currentX < this.minX) {
            this.minX = this.currentX;
        } else if (this.currentX > this.maxX) {
            this.maxX = this.currentX;
        }
        //
        this.branches[this.currentBranch].addVertex(this.branchX, this.branchY);
    }
    //
    turnLeft(angle) {
        this.angle -= angle;
    }
    //
    turnRight(angle) {
        this.angle += angle;
    }
    //
    push() {
        this.stack.push({ x: this.currentX, y: this.currentY, angle: this.angle });
        //
        this._newBranch();
    }
    //
    pop() {
        const state = this.stack.pop();
        //
        if (state) {
            this.currentX = state.x;
            this.currentY = state.y;
            this.angle = state.angle;
        }
        //
        this._newBranch();
    }
    //
    reset() {
        this.currentX = 0;
        this.currentY = 0;
        this.angle = 270;
        this.branches = [new Branch(this.currentX, this.currentY, 0)];
        this.currentBranch = 0;
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = 0;
        this.maxY = 0;
    }
    //
    _newBranch() {
        this.branchX = 0;
        this.branchY = 0;
        //
        this.currentBranch++;
        //
        this.branches[this.currentBranch] = new Branch(this.currentX, this.currentY, this.stack.length);
    }
}