'use strict';

export { Vector3 };

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    //
    set(x, y, z) {
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
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        //
        return this;
    }
    //
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        //
        return this;
    }
    //
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    //
    cross(v) {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
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
    divideScalar( scalar ) {
		return this.multiplyScalar( 1 / scalar );
	}
    //
    length() {
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
	}
    //
    normalize() {
		return this.divideScalar( this.length() || 1 );
    }
    //
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    //
    toString() {
        return `Vector3(${this.x}, ${this.y}, ${this.z})`;
    }

}
