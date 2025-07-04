'use strict';

import { Draggable } from './modules/utils/Draggable.js';
import { Helper } from './modules/utils/Helper.js';
import { LSystem } from './modules/lindenmayer/LSystem.js';
import { LineRenderer } from './modules/renderer/LineRenderer.js';
//
(function () {
    const init = function () {
        const canvas = document.getElementById('stage');
        //
        const rules = {
            F: 'FF+[+F-F-F]-[-F+F+FF]',
            X: 'F+F?F-[-X][-X]X',
        };
        //
        const axiom = 'X';
        //
        renderer = new LineRenderer(canvas);
        //
        sl = new LSystem(renderer, axiom, rules, document.getElementById('iterations').value, 9, 12);
        //
        document.getElementById('reset').addEventListener('click', () => {
            sl.render();
        });
        //
        document.getElementById('save').addEventListener('click', () => {
            Helper.save(canvas);
        });
        //
        const draggableControls = new Draggable(document.getElementById('controls')); //eslint-disable-line
        //
        document.querySelectorAll('.control').forEach((el) => {
            el.addEventListener('change', (e) => {
                const value = e.target.value;
                const min = e.target.min;
                const max = e.target.max;
                //
                switch (e.target.id) {
                    case 'iterations':
                        sl.iterations = Helper.clamp(Helper.ensureNumberFormat(value, sl.iterations), min, max);
                        break;
                    case 'length':
                        sl.length = Helper.clamp(Helper.ensureNumberFormat(value, sl.length), min, max);
                        break;
                    case 'angle':
                        sl.angle = Helper.clamp(Helper.ensureNumberFormat(value, sl), min, max);
                        break;
                    case 'petalProbability':
                        renderer.petalPropability = Helper.clamp(Helper.ensureNumberFormat(value, renderer.petalPropability), min, max);
                        break;
                    case 'stemColor':
                        renderer.strokeStyleStem = Helper.hexToColor(value, 0.5);
                        break;
                    case 'stemColor2':
                        renderer.strokeStyleStem2 = Helper.hexToColor(value, 0.5);
                        break;
                    case 'branchColor':
                        renderer.strokeStyleBranch = Helper.hexToColor(value, 0.1);
                        break;
                    case 'petalColor':
                        renderer.strokeStylePetal = Helper.hexToColor(value, 0.6);
                        break;
                }
                //
                sl.generateSentence();
                sl.render();
            });
        });
        //
        document.getElementById('toggle').addEventListener('click', () => {
            const controls = document.getElementById('controls');
            //
            controls.classList.toggle('hidden');
            //
            if (controls.classList.contains('hidden')) {
                document.getElementById('toggle').textContent = 'Show Controls';
            } else {
                document.getElementById('toggle').textContent = 'Hide Controls';
            }
        });
        //
        document.addEventListener(
            'keydown',
            function (e) {
                const modifier = window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;
                if (!modifier) {
                    return;
                }
                //
                switch (e.key) {
                    case 'g': 
                        e.preventDefault();
                        sl.render();
                        break;
                    case 'c': 
                        e.preventDefault();
                        document.getElementById('toggle').click();
                        break;
                    case 's': 
                        e.preventDefault();
                        Helper.save(canvas);
                        break;
                    case '+':
                         e.preventDefault();
                        renderer.scale += 0.1;
                        document.getElementById('scale').textContent = renderer.scale.toFixed(1);
                        sl.render();
                        break;
                    case '-': 
                        e.preventDefault();
                        renderer.scale -= 0.1;
                        document.getElementById('scale').textContent = renderer.scale.toFixed(1);
                        sl.render();
                        break;
                    case 'r':
                        e.preventDefault();
                        sl.useRandomAngle = !sl.useRandomAngle;
                        sl.render();
                        break;
                }
            },
            false
        );
        //
        document.getElementById('petalProbability').value = renderer.petalPropability;
        document.getElementById('iterations').value = sl.iterations;
        document.getElementById('length').value = sl.length;
        document.getElementById('angle').value = sl.angle;
        document.getElementById('stemColor').value = renderer.strokeStyleStem.toHexString();
        document.getElementById('stemColor2').value = renderer.strokeStyleStem2.toHexString();
        document.getElementById('branchColor').value = renderer.strokeStyleBranch.toHexString();
        document.getElementById('petalColor').value = renderer.strokeStylePetal.toHexString();
        //
        sl.render();
    };
    //
    let sl = null;
    let renderer = null;
    //
    window.addEventListener('load', init);
    //
    window.addEventListener('resize', () => {
        renderer.resizeCanvas();
        sl.render();
    });
})();
