'use strict';

export { LSystem };

import { Turtle } from './Turtle.js';

class LSystem {
    turtle = null;
    renderer = null;
    axiom = '';
    rules = {};
    iterations = 0;
    length = 0;
    angle = 25;
    sentence = '';
    useRandomAngle = true;
    //
    constructor(renderer, axiom, rules, iterations, length, angle) {
        this.renderer = renderer;
        this.axiom = axiom;
        this.rules = rules;
        this.iterations = iterations;
        this.length = length;
        this.angle = angle;
        //
        this.turtle = new Turtle();
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
                case '?':
                    Math.random() < 0.5 ? this.turtle.turnLeft(this.randomAngle()) : this.turtle.turnRight(this.randomAngle());
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
        this.renderer.render(this.turtle.gestrypp());
        console.timeEnd('render');
    }
    //
    randomAngle() {
        return this.useRandomAngle ? Math.floor(Math.random() * this.angle) : this.angle;
    }
}
