'use strict';

export { Color };

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
        //
        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
    }
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}