
export { LSystem };

class Turtle {
    x = 0;
    y = 0;
    angle = 270;
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
            length *= 0.1;
        } else if (this.stack.length === 1) {
            length *= 0.7;
        }
        //
        const rad = (this.angle * Math.PI) / 180;
        const newX = this.x + length * Math.cos(rad);
        const newY = this.y + length * Math.sin(rad);
        //
        this.branches[this.currentBranch].push({
            x: this.x,
            y: this.y,
            newX: newX,
            newY: newY,
            length: length,
            rad: rad,
            depth: this.stack.length,
        });
        //
        this.x = newX;
        this.y = newY;
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
        this.stack.push({ x: this.x, y: this.y, angle: this.angle });
        //
        this._newBranch();
    }
    //
    pop() {
        const state = this.stack.pop();
        //
        this._newBranch();
        //
        if (state) {
            this.x = state.x;
            this.y = state.y;
            this.angle = state.angle;
        }
    }
    //
    reset() {
        this.x = document.getElementById('container').clientWidth / 2;
        this.y = document.getElementById('container').clientHeight;
        this.angle = 270;
        this.branches = [[]];
        this.currentBranch = 0;
    }
    //
    _newBranch() {
        if (this.branches[this.currentBranch].length) {
            this.currentBranch++;
            this.branches[this.currentBranch] = [];
        }
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