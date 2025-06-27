class Color {
    r = 0;
    g = 0;
    b = 0;
    a = 1;
    //
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    //
    toHexString() {
        const toHex = (value) => {
            const hex = value.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
    }
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
class Helper {
    static hexToColor(hex, alpha = 1) {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return new Color(r, g, b, alpha);
    }
    //
    static save(canvas) {
        canvas.toBlob(
            (blob) => {
                const link = document.createElement('a');
                //
                const date = new Date();
                const filename = 'lsysten-' + date.toISOString().replace(/[:.]/g, '-') + '.jpg';
                //
                link.download = filename;
                link.href = URL.createObjectURL(blob);
                link.click();
                //
                URL.revokeObjectURL(link.href);
            },
            'image/jpeg',
            0.8
        );
    }
};
class Draggable {
    targetElement = null;
    //
    constructor(element) {
        this.targetElement = element;
        element.addEventListener('mousedown', this.startDrag.bind(this));
        element.addEventListener('touchstart', this.startDrag.bind(this));
    }
    //
    startDrag(event) {
        console.log('startDrag', event)
        if (event.target !== this.targetElement && !event.target.matches('label, p, strong')) {
            return;
        }
        //
        event.preventDefault();
        //
        const element = event.currentTarget;
        //
        const offsetX = event.clientX - element.getBoundingClientRect().left;
        const offsetY = event.clientY - element.getBoundingClientRect().top;
        //
        const moveHandler = (moveEvent) => {
            moveEvent.preventDefault();
            element.style.left = (moveEvent.clientX - offsetX) + 'px';
            element.style.top = (moveEvent.clientY - offsetY) + 'px';
        };

        const upHandler = () => {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('touchend', upHandler);
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
        document.addEventListener('touchmove', moveHandler);
        document.addEventListener('touchend', upHandler);
    }
};
//
class Turtle {
    ctx = null;
    x = 0;
    y = 0;
    angle = 270;
    stack = [];
    strokeStyleBranch = new Color(32, 100, 40, 0.2);
    strokeStyleStem = new Color(61, 46, 43, 0.5);
    strokeStyleStem2 = new Color(61, 46, 43, 0.4);
    strokeStylePetal = new Color(128, 0, 70, 0.6);
    petalPropability = 0.0006;
    petalRadius = 5;
    currentBranchColor = this.strokeStyleBranch;
    branches = [];
    currentBranc = 0;
    marginY = 200;
    marginX = 100;
    constructor(canvas) {
        const offscreen = canvas.transferControlToOffscreen()
        this.ctx = offscreen.getContext('2d');
        //
        this.clear();
        return this
    }
    //
    step(length) {
        let lineWidth = 1;
        let strokeStyle = this.currentBranchColor;
        //
        if (this.stack.length === 0) {
            lineWidth = 10
            length *= 0.5;
            strokeStyle = this.strokeStyleStem
        } else if (this.stack.length === 1) {
            lineWidth = 3;
            length *= 0.7;
            strokeStyle = this.strokeStyleStem2;
        }
        //
        const rad = this.angle * Math.PI / 180;
        const newX = this.x + length * Math.cos(rad);
        const newY = this.y + length * Math.sin(rad);
        //
        if (newY < this.maxHeight) {
            this.maxHeight = newY;
        }
        //
        this.branches[this.currentBranch].push({
            x: this.x,
            y: this.y,
            newX: newX,
            newY: newY,
            length: length,
            lineWidth: lineWidth,
            strokeStyle: strokeStyle,
            alpha: this._getAlpha(newX, newY)
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
        //
        if (this.stack.length > 4) {
            this.currentBranchColor = new Color(Math.max(0, 255 - this.stack.length * 40), this.strokeStyleBranch.g, Math.max(0, this.strokeStyleBranch.b - this.stack.length * 10), 0.3);
        }
    }
    //
    pop() {
        const state = this.stack.pop();
        //
        if (this.stack.length < 4) {
            this.currentBranchColor = this.strokeStyleBranch;
        }
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
    displayBranches() {
        let height = 0;
        for (const branch of this.branches) {
            this.ctx.beginPath();
            for (const point of branch) {
                this.ctx.moveTo(point.x, point.y);
                this.ctx.lineTo(point.newX, point.newY);

                this.ctx.strokeStyle = point.strokeStyle.toString();
                this.ctx.globalAlpha = point.alpha;
                this.ctx.lineWidth = point.lineWidth
            }
            this.ctx.stroke();
            if (Math.random() < this.petalPropability && branch.length > 0) {
                const petalPosition = branch[branch.length - 1];
                this.drawPetal(petalPosition.x, petalPosition.y, this.petalRadius);
            }
        }
    }
    drawPetal(x, y, radius) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        //
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.strokeStylePetal;
        this.ctx.fillStyle = this.strokeStylePetal;
        this.ctx.fill();
        this.ctx.stroke();
    }
    //
    clear() {
        this.ctx.canvas.width = document.getElementById('container').clientWidth;
        this.ctx.canvas.height = document.getElementById('container').clientHeight;
        this.x = this.ctx.canvas.width / 2;
        this.y = this.ctx.canvas.height;
        this.angle = 270;
        this.branches = [
            []
        ];
        this.currentBranch = 0;
        this.currentBranchColor = this.strokeStyleBranch;
        //
        this.ctx.fillStyle = '#cdcdcd';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    //
    _newBranch() {
        if (this.branches[this.currentBranch].length) {
            this.currentBranch++;
            this.branches[this.currentBranch] = [];
        }
    }
    //
    _getAlpha(x, y) {
        let alphaY = 1;
        let alphaX = 1;
        //
        if (y < this.marginY) {
            alphaY = Math.max(0, y) / this.marginY;
        } else if (y > this.ctx.canvas.height - this.marginY && this.stack.length > 0) {
            const bottom = Math.min(y, this.ctx.canvas.height);
            alphaY = (this.ctx.canvas.height - bottom) / this.marginY;
        }
        if (x < this.marginX) {
            alphaX = Math.max(0, x) / this.marginX;
        } else if (x > this.ctx.canvas.width - this.marginX && this.stack.length > 0) {
            const right = Math.min(x, this.ctx.canvas.width);
            alphaX = (this.ctx.canvas.width - right) / this.marginX;
        }
        //
        return Math.min(alphaY, alphaX);
    }
}
//
class LSystem {
    turtle = null;
    axiom = '';
    rules = {};
    iterations = 0;
    length = 0;
    angle = 25;
    sentence = '';
    //
    constructor(canvas, axiom, rules, iterations, length, angle) {
        this.turtle = new Turtle(canvas);
        this.axiom = axiom;
        this.rules = rules;
        this.iterations = iterations;
        this.length = length;
        this.angle = angle;
        //
        this.generateSentence();
        //
        return this;
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
        this.turtle.clear();
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
        this.turtle.displayBranches();
        console.timeEnd('render');
    }
    //
    randomAngle() {
        return Math.floor(Math.random() * this.angle);
    }
}
//   
const init = function () {
    const canvas = document.getElementById('stage');
    //
    canvas.width = document.getElementById('container').clientWidth;
    canvas.height = document.getElementById('container').clientHeight;
    //
    const rules = {
        'F': 'FF+[+F-F-F]-[-F+F+FF]',
        'X': 'F+F+F+[-X][-X]X'
    };
    //
    const axiom = 'X';
    //
    const iterations = 6;
    const branchHeight = document.getElementById('length').value;
    //
    sl = new LSystem(canvas, axiom, rules, document.getElementById('iterations').value, branchHeight, document.getElementById('angle').value);
    //
    document.getElementById('reset').addEventListener('click', () => {
        sl.render();
    });
    //
    document.getElementById('save').addEventListener('click', () => {
        Helper.save(canvas);
    });
    //
    const draggableControls = new Draggable(document.getElementById('controls'));
    //
    document.querySelectorAll('.control').forEach((el) => {
        el.addEventListener('change', (e) => {
            const value = e.target.value;
            switch (e.target.id) {
                case 'iterations':
                    sl.iterations = value;
                    break;
                case 'length':
                    sl.length = value;
                    break;
                case 'angle':
                    sl.angle = value;
                    break;
                case 'petalProbability':
                    sl.turtle.petalPropability = value;
                    break;
                case 'stemColor':
                    sl.turtle.strokeStyleStem = Helper.hexToColor(value, 0.5);
                    break;
                case 'stemColor2':
                    sl.turtle.strokeStyleStem2 = Helper.hexToColor(value, 0.5);
                    break;
                case 'branchColor':
                    console.log('branchColor', value);
                    sl.turtle.strokeStyleBranch = Helper.hexToColor(value, 0.1);
                    break;
                case 'petalColor':
                    sl.turtle.strokeStylePetal = Helper.hexToColor(value, 0.6);
                    break;
            }
            sl.generateSentence();
            sl.render();
        });
    });
    //
    document.getElementById('toggle').addEventListener('click', () => {
        const controls = document.getElementById('controls');
        controls.classList.toggle('hidden');
        //
        if (controls.classList.contains('hidden')) {
            document.getElementById('toggle').textContent = 'Show Controls';
        } else {
            document.getElementById('toggle').textContent = 'Hide Controls';
        }
    });
    document.addEventListener("keydown", function (e) {
        const modifier = window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey;
        if (!modifier) {
            return;
        }
        switch (e.key) {
            case 'g': // 
                e.preventDefault();
                sl.render();
                break;
            case 'c': // C
                e.preventDefault();
                document.getElementById('toggle').click();
                break;
            case 's': // S
                e.preventDefault();
                Helper.save(canvas);
                break;
        }
        if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
            e.preventDefault();
            Helper.save(canvas);
        }
    }, false);
    document.getElementById('stemColor').value = sl.turtle.strokeStyleStem.toHexString();
    document.getElementById('stemColor2').value = sl.turtle.strokeStyleStem2.toHexString();
    document.getElementById('branchColor').value = sl.turtle.strokeStyleBranch.toHexString()
    document.getElementById('petalColor').value = sl.turtle.strokeStylePetal.toHexString();
    //
    sl.render()
};
//
let sl = null
//
window.addEventListener('load', init);
window.addEventListener('resize', () => { sl.render() });
