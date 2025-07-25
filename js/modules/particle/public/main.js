'use strict';

import { FPSLimiter } from '../../utils/FPSLimiter.js';
import { Draggable } from '../../utils/Draggable.js';
import { Color } from '../../utils/Color.js';

(function () {
    let CANVAS, OFFSCREEN_CANVAS, CTX, C_WIDTH, C_HEIGHT;
    //
    let DEBUG_GRID = false;
    let DEBUG_RANGE = false;
    let DEBUG_LOOP_COUNT = 0;
    //
    const NUM_PARTICLES = 4000;
    const NUM_SPECIES = 6;
    const DT = 0.01;
    //
    const FORCE_FACTOR = 2;
    //
    const MAX_DISTANCE = 0.1;

    const MAX_DISTANCE_SQUARED = MAX_DISTANCE * MAX_DISTANCE;
    const MAX_DISTANCE_FORCE_FACTOR = MAX_DISTANCE * FORCE_FACTOR;
    //
    const GRID_SIZE = 1 / MAX_DISTANCE;
    const FRICTION_HALF_LIFE = 0.04;
    const FRICTION_FACTOR = Math.pow(0.5, DT / FRICTION_HALF_LIFE);
    //
    const BETA = 0.3;
    //
    const TAU = Math.PI * 2;
    //
    const BACKGROUND_COLOR = new Color(20, 20, 20).toString();
    const EQUATION_BACKGROUND_COLOR = new Color(40, 40, 40).toString();
    const EQUATION_AXIS_COLOR = new Color(200, 200, 200).toString();
    //
    const ATTRACTION_COLOR = new Color(20, 200, 50);
    const REPULSION_COLOR = new Color(200, 20, 50);
    //
    const GRID_COLOR = new Color(255, 255, 255, 0.2).toString();
    const DISTANCE_COLOR = new Color(200, 255, 255, 0.1).toString();
    //
    const PARTICE_DISPLAY_SIZE = 1;
    //
    let particles = [];
    //
    let matrix = makeAttractionMatrix();
    //
    let fpsLimiter = new FPSLimiter(60, loop);
    //

    class Particle {
        constructor(x, y, color, forceFunction) {
            this.x = x;
            this.y = y;
            //
            const gridPos = this._mapToGridCell(x, y);
            this.gx = gridPos.gx;
            this.gy = gridPos.gy;
            //
            this.velocityX = 0;
            this.velocityY = 0;
            //
            this.color = color;
            this.fillStyle = `hsl(${(color * 360) / NUM_SPECIES}, 100%, 69%)`;
            //
            this.forceFunction = forceFunction;
        }
        //
        updateVelocity(others) {
            let fX = 0;
            let fY = 0;
            //
            for (let i = 0; i < others.length; i++) {
                const other = others[i];
                //
                if (this === other) {
                    continue;
                }
                //
                let dx = other.x - this.x;
                let dy = other.y - this.y;
                //
                if (dx > 0.5) {
                    dx -= 1;
                } else if (dx < -0.5) {
                    dx += 1;
                }
                if (dy > 0.5) {
                    dy -= 1;
                } else if (dy < -0.5) {
                    dy += 1;
                }
                //
                const lenSquared = dx * dx + dy * dy;
                //
                if (lenSquared > MAX_DISTANCE_SQUARED || lenSquared < 1e-9) {
                    continue;
                }
                //
                const len = Math.sqrt(lenSquared);
                //
                const f = this.forceFunction(len / MAX_DISTANCE, matrix[this.color][other.color]);
                //
                const forceFactor = f / len;
                //
                fX += dx * forceFactor;
                fY += dy * forceFactor;
            }
            //
            this.velocityX = this.velocityX * FRICTION_FACTOR + fX * MAX_DISTANCE_FORCE_FACTOR * DT;
            this.velocityY = this.velocityY * FRICTION_FACTOR + fY * MAX_DISTANCE_FORCE_FACTOR * DT;
            //
        }
        //
        update() {
            this.updatePosition();
            this._draw();
        }
        //
        _draw() {
            const sx = this.x * C_WIDTH;
            const sy = this.y * C_HEIGHT;
            //
            CTX.beginPath();
            CTX.arc(sx, sy, PARTICE_DISPLAY_SIZE, 0, TAU);
            CTX.fillStyle = this.fillStyle;
            CTX.fill();
            CTX.closePath();
            //
            if (DEBUG_RANGE) {
                CTX.strokeStyle = DISTANCE_COLOR;
                CTX.lineWidth = 0.5;
                CTX.beginPath();
                CTX.arc(sx, sy, MAX_DISTANCE * C_WIDTH, 0, TAU);
                CTX.stroke();
            }
        }
        //
        _mapToGridCell(x, y) {
            let gx = Math.floor(x * GRID_SIZE);
            let gy = Math.floor(y * GRID_SIZE);
            //
            gx = ((gx % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
            gy = ((gy % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
            //
            return { gx, gy };
        }
        //
        updatePosition() {
            this.x += this.velocityX * DT;
            this.y += this.velocityY * DT;
            //
            this.x = ((this.x % 1) + 1) % 1;
            this.y = ((this.y % 1) + 1) % 1;
            //
            const gridPos = this._mapToGridCell(this.x, this.y);
            //
            this.gx = gridPos.gx;
            this.gy = gridPos.gy;
        }
    }
    //
    function makeAttractionMatrix() {
        const matrix = [];
        //
        for (let i = 0; i < NUM_SPECIES; i++) {
            const row = [];
            //
            for (let j = 0; j < NUM_SPECIES; j++) {
                row.push(Math.random() * 2 - 1);
            }
            //
            matrix.push(row);
        }
        //
        return matrix;
    }
    //
    function populateParticles() {
        particles.length = 0;
        //
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const color = Math.floor(Math.random() * NUM_SPECIES);
            const x = Math.random();
            const y = Math.random();
            //
            const p = new Particle(x, y, color, force);
            //
            if (particles[p.gy] === undefined) {
                particles[p.gy] = [];
            }
            if (particles[p.gy][p.gx] === undefined) {
                particles[p.gy][p.gx] = [];
            }
            particles[p.gy][p.gx].push(p);
        }
    }
    //
    function force(r, a) {
        if (r <= BETA) {
            return r / BETA - 1;
        } else if (BETA < r && r <= 1) {
            return a * (1 - Math.abs(2 * r - 1 - BETA) / (1 - BETA));
        } else {
            return 0;
        }
    }
    //
    function updateVelocities() {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                updateVelocitiesForGridCell(x, y);
            }
        }
    }
    //
    function loop() {
        DEBUG_LOOP_COUNT = 0;
        const startTime = performance.now();
        CTX.fillStyle = BACKGROUND_COLOR;
        CTX.fillRect(0, 0, C_WIDTH, C_HEIGHT);
        //
        updateVelocities();
        //
        const newParticles = [];
        //
        for (let y = 0; y < GRID_SIZE; y++) {
            if (particles[y] === undefined) {
                continue;
            }
            for (let x = 0; x < GRID_SIZE; x++) {
                if (particles[y][x] === undefined) {
                    continue;
                }
                updateGridCell(x, y, newParticles);
            }
        }
        //
        particles = newParticles;
        //
        if (DEBUG_GRID) {
            drawGrid();
        }
        const endTime = performance.now();
        const fps = 1000 / (endTime - startTime);
        CTX.fillStyle = 'white';
        CTX.font = '12px Arial';
        CTX.fillText(`FPS: ${Math.round(fps)}`, 10, 20);
        CTX.fillText(`Particles: ${NUM_PARTICLES}`, 10, 40);
        //
        CTX.fillText(`Species: ${NUM_SPECIES}`, 10, 60);
        CTX.fillText(`Beta: ${BETA}`, 10, 80);
        if (DEBUG_LOOP_COUNT > 0) {
            CTX.fillText(`DCount: ${DEBUG_LOOP_COUNT}`, 10, 100);
        }
    }
    //
    function updateVelocitiesForGridCell(x, y) {
        if (particles[y] === undefined || particles[y][x] === undefined) {
            return;
        }
        //
        let particlesToUpdate = [];
        //
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                let nx = (((x + dx) % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
                let ny = (((y + dy) % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
                //
                if (particles[ny] !== undefined && particles[ny][nx] !== undefined) {
                    particlesToUpdate.push(...particles[ny][nx]);
                }
            }
        }
        //
        const currentCellParticles = particles[y][x];
        //
        for (let i = 0; i < currentCellParticles.length; i++) {
            currentCellParticles[i].updateVelocity(particlesToUpdate);
        }
    }
    //
    function updateGridCell(x, y, newParticles) {
        const cellParticles = particles[y][x];
        //
        for (let i = 0; i < cellParticles.length; i++) {
            const p = cellParticles[i];
            //
            p.update();
            //
            if (newParticles[p.gy] === undefined) {
                newParticles[p.gy] = [];
            }
            if (newParticles[p.gy][p.gx] === undefined) {
                newParticles[p.gy][p.gx] = [];
            }
            newParticles[p.gy][p.gx].push(p);
        }
    }
    //
    function resizeHandler() {
        OFFSCREEN_CANVAS.width = window.innerWidth;
        OFFSCREEN_CANVAS.height = window.innerHeight;
        //
        C_WIDTH = CANVAS.width;
        C_HEIGHT = CANVAS.height;
        //

        CTX.fillStyle = BACKGROUND_COLOR;
        CTX.fillRect(0, 0, C_WIDTH, C_HEIGHT);
    }
    //
    function clear() {
        matrix = makeAttractionMatrix();
        populateParticles();
        displayMatrix();
        drawEquation(force);
    }
    //
    function displayMatrix() {
        const matrixElement = document.getElementById('matrix');
        //
        matrixElement.innerHTML = '';
        //
        const headerRow = document.createElement('div');
        //
        const cornerCell = document.createElement('span');
        //
        cornerCell.className = 'cell';
        cornerCell.textContent = '';
        //
        headerRow.appendChild(cornerCell);
        //
        for (let j = 0; j < NUM_SPECIES; j++) {
            const colorCell = document.createElement('span');
            //
            colorCell.className = 'cell';
            colorCell.style.backgroundColor = `hsl(${(j * 360) / NUM_SPECIES}, 100%, 69%)`;
            //
            headerRow.appendChild(colorCell);
        }
        //
        matrixElement.appendChild(headerRow);
        //
        for (let i = 0; i < NUM_SPECIES; i++) {
            const row = document.createElement('div');
            const rowColorCell = document.createElement('span');
            //
            rowColorCell.className = 'cell';
            rowColorCell.style.backgroundColor = `hsl(${(i * 360) / NUM_SPECIES}, 100%, 69%)`;
            //
            row.appendChild(rowColorCell);
            //
            for (let j = 0; j < NUM_SPECIES; j++) {
                const dataCell = document.createElement('span');
                dataCell.className = 'cell';
                //
                const value = matrix[i][j];
                //
                dataCell.dataset.attractionValue = value;
                dataCell.dataset.species = i;
                dataCell.dataset.attractedSpecies = j;
                //
                dataCell.addEventListener('click', (event) => {
                    let newAttractionValue = parseFloat(event.target.dataset.attractionValue);
                    //
                    if (event.shiftKey) {
                        newAttractionValue = 0;
                    } else if (event.ctrlKey) {
                        newAttractionValue = 1;
                    } else if (event.altKey) {
                        newAttractionValue = -1;
                    }
                    //
                    const species = event.target.dataset.species;
                    const attractedSpecies = event.target.dataset.attractedSpecies;
                    //
                    matrix[species][attractedSpecies] = newAttractionValue;
                    event.target.dataset.attractionValue = newAttractionValue;
                    //
                    displayMatrix();
                    drawEquation(force, event.target.dataset.attractionValue);
                });
                //
                const alpha = Math.abs(value);
                //
                REPULSION_COLOR.a = alpha;
                ATTRACTION_COLOR.a = alpha;
                //
                dataCell.style.backgroundColor = value < 0 ? REPULSION_COLOR.toString() : ATTRACTION_COLOR.toString();
                //
                row.appendChild(dataCell);
            }
            //
            matrixElement.appendChild(row);
        }
    }

    function drawEquation(func, attractionValue = 1) {
        const equationCanvas = document.getElementById('equation');
        //
        const ctx = equationCanvas.getContext('2d');
        const width = equationCanvas.width;
        const height = equationCanvas.height;
        //
        ctx.fillStyle = EQUATION_BACKGROUND_COLOR;
        ctx.fillRect(0, 0, width, height);
        //
        ctx.strokeStyle = EQUATION_AXIS_COLOR;
        ctx.lineWidth = 1;
        //
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        //
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(50, height);
        ctx.stroke();
        //
        ctx.lineWidth = 2;
        //
        const offsetX = 50;
        const offsetY = height / 2;
        //
        const steps = width - offsetX;
        //
        REPULSION_COLOR.a = 1;
        ATTRACTION_COLOR.a = 1;
        //
        for (let i = 0; i < steps; i++) {
            const r = i / steps;
            //
            const f = func(r, attractionValue);
            //
            const x = offsetX + i;
            const y = offsetY - f * offsetY;
            //
            ctx.strokeStyle = f < 0 ? REPULSION_COLOR.toString() : ATTRACTION_COLOR.toString();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 1, y);
            ctx.stroke();
        }
        //
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText('r', width - 20, offsetY + 15);
        ctx.fillText('f(r)', 55, 15);
        ctx.fillText('1', width - 10, offsetY + 15);
        ctx.fillText(`β=${BETA}`, offsetX + BETA * (width - 50) - 10, offsetY + 30);
    }
    //

    //
    function drawGrid() {
        CTX.strokeStyle = GRID_COLOR;
        CTX.lineWidth = 0.5;
        //
        const gw = C_WIDTH / GRID_SIZE;
        const gh = C_HEIGHT / GRID_SIZE;
        //
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                CTX.beginPath();
                CTX.rect(x * gw, y * gh, gw, gh);
                CTX.stroke();

                if (particles[y] === undefined) {
                    continue;
                }
                if (particles[y][x] === undefined) {
                    continue;
                }
                const count = particles[y][x].length;
                CTX.fillStyle = 'white';
                CTX.font = '12px Arial';
                CTX.fillText(count, x * gw + 5, y * gh + 15);
                DEBUG_LOOP_COUNT += count ** 2;
            }
        }
    }
    //
    document.addEventListener('DOMContentLoaded', () => {
        CANVAS = document.getElementById('canvas');
        CANVAS.width = window.innerWidth;
        CANVAS.height = window.innerHeight;
        //
        OFFSCREEN_CANVAS = CANVAS.transferControlToOffscreen();
        CTX = OFFSCREEN_CANVAS.getContext('2d');
        //
        resizeHandler();
        //
        const draggableControls = new Draggable(document.getElementById('controls')); //eslint-disable-line
        //
        clear();
        fpsLimiter.start();
    });
    //
    document.getElementById('stop').addEventListener('click', (event) => {
        event.target.textContent = fpsLimiter.running ? 'Start' : 'Stop';
        //
        fpsLimiter.running ? fpsLimiter.stop() : fpsLimiter.start();
    });
    //
    document.getElementById('clear').addEventListener('click', () => {
        clear();
    });
    //
    window.addEventListener('resize', resizeHandler);
    //
    window.addEventListener('keydown', (event) => {
        if (event.key === 'G' && event.shiftKey) {
            DEBUG_GRID = !DEBUG_GRID;
        }
        if (event.key === 'R' && event.shiftKey) {
            DEBUG_RANGE = !DEBUG_RANGE;
        }
        if (event.key === 'C' && event.shiftKey) {
            document.getElementById('controls').classList.toggle('hidden');
        }
    });
    //
})();
