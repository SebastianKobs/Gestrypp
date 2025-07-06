'use strict';

export { Matrix4 };

import { Vector3 } from './Vector3.js';

class Matrix4 {
    constructor() {
        this.elements = [];
        this.setIdentity();
    }

    setIdentity() {
        this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

        return this;
    }
    //
    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        const te = this.elements;
        //
        te[0] = n11;
        te[1] = n12;
        te[2] = n13;
        te[3] = n14;
        te[4] = n21;
        te[5] = n22;
        te[6] = n23;
        te[7] = n24;
        te[8] = n31;
        te[9] = n32;
        te[10] = n33;
        te[11] = n34;
        te[12] = n41;
        te[13] = n42;
        te[14] = n43;
        te[15] = n44;
        //
        return this;
    }
    //
    static RotationX(rad) {
        const m = new Matrix4();
        //
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        // prettier-ignore
        m.set(
            1.0, 0.0, 0.0, 0.0, 
            0.0, c, s, 0.0, 
            0.0, -s, c, 0.0, 
            0.0, 0.0, 0.0, 1.0
        );
        return m;
    }
    //
    static RotationY(rad) {
        const m = new Matrix4();
        //
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        // prettier-ignore
        m.set(
            c, 0.0, s, 0.0, 
            0.0, 1.0, 0.0, 0.0, 
            -s, 0.0, c, 0.0, 
            0.0, 0.0, 0.0, 1.0
        );
        return m;
    }
    //
    static RotationZ(rad) {
        const m = new Matrix4();
        //
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        // prettier-ignore
        m.set(
            c, -s, 0.0, 0.0, 
            s, c, 0.0, 0.0, 
            0.0, 0.0, 1.0, 0.0, 
            0.0, 0.0, 0.0, 1.0
        );
        //
        return m;
    }
    //
    static Translate(x, y, z) {
        const m = new Matrix4();
        // prettier-ignore
        m.set(
            1, 0, 0, 0, 
            0, 1, 0, 0, 
            0, 0, 1, 0, 
            x, y, z, 1
        );
        //
        return m;
    }
    //
    /**
     * _forward is z axis, _right is x axis, _up is y axis
     */
    static LookAt(eye, target, up) {
        const _forward = Vector3.Subtract(target, eye).normalize(); //forward
        const _right = Vector3.Cross(up, _forward).normalize(); //side
        const _up = Vector3.Cross(_forward, _right); //up
        //
        const translationX = _right.dot(eye);
        const translationY = _up.dot(eye);
        const translationZ = _forward.dot(eye);
        //
        const m = new Matrix4();
        // prettier-ignore
        m.set(
            _right.x, _up.x, -_forward.x, 0,
            _right.y, _up.y, -_forward.y, 0,
            _right.z, _up.z, -_forward.z, 0,
            translationX, translationY, translationZ, 1
        );
        //
        return m;
    }
    //
    static Perspective(fov, aspect, znear, zfar) {
        var m = new Matrix4();
        var me = m.elements;
        var tan = 1.0 / Math.tan(fov * 0.5);
        me[0] = tan / aspect;
        me[1] = me[2] = me[3] = 0.0;
        me[5] = tan;
        me[4] = me[6] = me[7] = 0.0;
        me[8] = me[9] = 0.0;
        me[10] = -zfar / (zfar - znear);
        me[11] = 1.0;
        me[12] = me[13] = me[15] = 0.0;
        me[14] = -(znear * zfar) / (znear - zfar);
        //
        return m;
    }
    //
    multiply(m) {
        const result = new Matrix4();
        const te = this.elements;
        const re = result.elements;
        const me = m.elements;
        re[0] = te[0] * me[0] + te[1] * me[4] + te[2] * me[8] + te[3] * me[12];
        re[1] = te[0] * me[1] + te[1] * me[5] + te[2] * me[9] + te[3] * me[13];
        re[2] = te[0] * me[2] + te[1] * me[6] + te[2] * me[10] + te[3] * me[14];
        re[3] = te[0] * me[3] + te[1] * me[7] + te[2] * me[11] + te[3] * me[15];
        re[4] = te[4] * me[0] + te[5] * me[4] + te[6] * me[8] + te[7] * me[12];
        re[5] = te[4] * me[1] + te[5] * me[5] + te[6] * me[9] + te[7] * me[13];
        re[6] = te[4] * me[2] + te[5] * me[6] + te[6] * me[10] + te[7] * me[14];
        re[7] = te[4] * me[3] + te[5] * me[7] + te[6] * me[11] + te[7] * me[15];
        re[8] = te[8] * me[0] + te[9] * me[4] + te[10] * me[8] + te[11] * me[12];
        re[9] = te[8] * me[1] + te[9] * me[5] + te[10] * me[9] + te[11] * me[13];
        re[10] = te[8] * me[2] + te[9] * me[6] + te[10] * me[10] + te[11] * me[14];
        re[11] = te[8] * me[3] + te[9] * me[7] + te[10] * me[11] + te[11] * me[15];
        re[12] = te[12] * me[0] + te[13] * me[4] + te[14] * me[8] + te[15] * me[12];
        re[13] = te[12] * me[1] + te[13] * me[5] + te[14] * me[9] + te[15] * me[13];
        re[14] = te[12] * me[2] + te[13] * me[6] + te[14] * me[10] + te[15] * me[14];
        re[15] = te[12] * me[3] + te[13] * me[7] + te[14] * me[11] + te[15] * me[15];
        //
        return result;
    }
}
