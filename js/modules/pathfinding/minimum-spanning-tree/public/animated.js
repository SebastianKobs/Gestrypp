'use strict';
//
import { Animator } from './Animator.js';
//
let animator = null;
//
document.addEventListener('DOMContentLoaded', () => {
    animator = new Animator(document.getElementById('canvas'), 20, 120);
    //
    animator.start();
});
//
document.getElementById('reset').addEventListener('pointerup', () => {
    animator.reset();
});
//
document.getElementById('freeze').addEventListener('pointerup', () => {
    animator._handleFreezeButton();
});
