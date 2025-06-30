'use strict';

export { Vector3 };

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    //
    set(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        //
        return this;
    }
    //
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        //
        return this;
    }
    //
    addVector3(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    //
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        //
        return this;
    }
    //
    subtractVector3(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    //
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        //
        return this;
    }
    multiplyVector3(v) {
        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    }
    //
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    //
    cross(v) {
        return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    //
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        //
        return this;
    }
    //
    divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }
    //
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    //
    normalize() {
        return this.divideScalar(this.length() || 1);
    }
    //
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    //
    toString() {
        return `Vector3(${this.x}, ${this.y}, ${this.z})`;
    }

    static Subtract(v1, v2) {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    static Cross(v1, v2) {
        return new Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    }

    static Dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    transformCoordinate(m) {
        const v = this.clone();
        const te = m.elements;
        //
        const x = v.x * te[0] + v.y * te[4] + v.z * te[8] + te[12];
        const y = v.x * te[1] + v.y * te[5] + v.z * te[9] + te[13];
        const z = v.x * te[2] + v.y * te[6] + v.z * te[10] + te[14];
        const w = v.x * te[3] + v.y * te[7] + v.z * te[11] + te[15];
        //
        return new Vector3(x / w, y / w, z / w);
    }
}
