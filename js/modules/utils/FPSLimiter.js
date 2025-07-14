'use strict';

export { FPSLimiter };

class FPSLimiter {
    constructor(fps = 60, callback = null) {
        this.fps = fps;
        this.callback = callback;
        //
        this.interval = 1000 / fps;

        this.then = 0;
        this.animationFrameId = null;
    }
    //
    get running() {
        return this.animationFrameId !== null;
    }
    //
    start() {
        this.then = performance.now();
        //
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        //
        this._update();
    }
    //
    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        //
        this.then = 0;
    }
    //
    _update() {
        this.animationFrameId = requestAnimationFrame(() => this._update());
        //
        const now = performance.now();
        const delta = now - this.then;
        //
        if (delta < this.interval) {
            return;
        }
        //
        this.then = now - (delta % this.interval);
        this.callback?.(delta);
    }
}
