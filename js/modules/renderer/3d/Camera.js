'use strict';

export { Camera };

import { Vector3 } from '../../math/Vector3.js';
import { Matrix4 } from '../../math/Matrix4.js';

class Camera {
    constructor(position = new Vector3(0, 0, 0), target = new Vector3(0, 0, 0), up = new Vector3(0, 1, 0), aspectRatio = 1, fov = 35) {
        this.position = position;
        this.target = target;
        this.up = up;
        this.fov = fov * (Math.PI / 180);
        this.aspectRatio = aspectRatio;
        //
        this.near = 0.1;
        this.far = 1000;
    }
    //
    setPosition(v) {
        this.position = v;
        return this;
    }
    //
    setTarget(v) {
        this.target = v;
        return this;
    }
    //
    setUp(v) {
        this.up = v;
        return this;
    }
    //
    getViewMatrix() {
        return Matrix4.LookAt(this.position, this.target, this.up);
    }
    //
    getProjectionMatrix() {
        return Matrix4.Perspective(this.fov, this.aspectRatio, this.near, this.far);
    }
}
