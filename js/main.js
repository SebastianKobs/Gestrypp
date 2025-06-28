'use strict';

import { Draggable } from './modules/utils/draggable.js';
import { Helper } from './modules/utils/helper.js';
import { LSystem } from './modules/lindenmayer/lsystem.js';
import { LineRenderer } from './modules/renderer/lineRenderer.js';
//
(function () {

    const init = function () {
        const canvas = document.getElementById('stage');
        //
        canvas.width = document.getElementById('container').clientWidth;
        canvas.height = document.getElementById('container').clientHeight;
        //
        const rules = {
            F: 'FF+[+F-F-F]-[-F+F+FF]',
            X: 'F+F+F+[-X][-X]X',
        };
        //
        const axiom = 'X';
        //
        const branchHeight = document.getElementById('length').value;
        //
        renderer = new LineRenderer(canvas);
        //
        sl = new LSystem(
            renderer,
            axiom,
            rules,
            document.getElementById('iterations').value,
            branchHeight,
            document.getElementById('angle').value
        );
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
                //
                switch (e.target.id) {
                    case 'iterations':
                        sl.iterations = Helper.ensureNumberFormat(value, sl.iterations);
                        break;
                    case 'length':
                        sl.length = Helper.ensureNumberFormat(value, sl.length);
                        break;
                    case 'angle':
                        sl.angle = Helper.ensureNumberFormat(value, sl);
                        break;
                    case 'petalProbability':
                        renderer.petalPropability = Helper.ensureNumberFormat(value, renderer.petalPropability);
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
                if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
                    e.preventDefault();
                    Helper.save(canvas);
                }
            },
            false
        );
        //
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
