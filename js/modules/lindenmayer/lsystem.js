'use strict';

import { Vector3 } from '../math/vector3.js';

export { LSystem, Branch };

class Branch {
    location = new Vector3();
    vertices = [];
    depth = 0;
    //
    constructor(x, y, depth) {
        this.location.set(x, y, 0);
        this.depth = depth;
    }
    //
    addVertex(x, y) {
        this.vertices.push(new Vector3(x, y, 0));
    }
    //
    length() {
        return this.vertices.length;
    }
    peak() {
        if (this.length() > 0) {
            return this.vertices[this.length() - 1];
        }
        //
        return new Vector3(0, 0, 0);
    }
}

class Turtle {
    branchX = 0;
    branchY = 0;
    //
    currentX = 0;
    currentY = 0;
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
        this.currentX = document.getElementById('container').clientWidth / 2;
        this.currentY = document.getElementById('container').clientHeight;
        this.angle = 270;
        this.branches = [new Branch(this.currentX, this.currentY, 0)];
        this.currentBranch = 0;
    }
    //
    _newBranch() {
        this.currentBranch++;
        //
        this.branchX = 0;
        this.branchY = 0;
        //
        this.branches[this.currentBranch] = new Branch(this.currentX, this.currentY, this.stack.length);
    }
}
//
class LSystem {
    turtle = null;
    renderer = null;
    axiom = '';
    rules = {};
    iterations = 0;
    length = 0;
    angle = 25;
    sentence = '';
    //
    constructor(renderer, axiom, rules, iterations, length, angle) {
        this.turtle = new Turtle();
        this.renderer = renderer;
        this.axiom = axiom;
        this.rules = rules;
        this.iterations = iterations;
        this.length = length;
        this.angle = angle;
        //
        this.generateSentence();
    }
    //
    generateSentence() {
        let result = [this.axiom];
        //
        for (let i = 0; i < this.iterations; i++) {
            let nextResult = '';
            for (const char of result) {
                nextResult += this.rules[char] || char;
            }
            result = nextResult;
        }
        //
        this.sentence = result;
    }
    //
    render() {
        this.turtle.reset();
        //
        console.time('turtle');
        for (const char of this.sentence) {
            switch (char) {
                case 'F':
                    this.turtle.step(this.length);
                    break;
                case '+':
                    this.turtle.turnRight(this.randomAngle());
                    break;
                case '-':
                    this.turtle.turnLeft(this.randomAngle());
                    break;
                case '[':
                    this.turtle.push();
                    break;
                case ']':
                    this.turtle.pop();
                    break;
            }
        }
        console.timeEnd('turtle');
        //
        console.time('render');
        this.renderer.render(this.turtle.branches);
        console.timeEnd('render');
    }
    //
    randomAngle() {
        return Math.floor(Math.random() * this.angle);
    }
}
