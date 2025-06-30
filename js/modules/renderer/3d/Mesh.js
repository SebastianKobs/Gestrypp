'use strict';

import { Matrix4 } from '../../math/Matrix4.js';
import { Vector3 } from '../../math/Vector3.js';

export { Mesh };

class Mesh {
    constructor(position = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0), vertices = []) {
        this.position = position;
        this.rotation = rotation;
        this.vertices = vertices;
    }

    addVertex(vertex) {
        this.vertices.push(vertex);
        return this;
    }

    getWorldMatrix() {
        const pitch = Matrix4.RotationX(this.rotation.x);
        const yaw = Matrix4.RotationY(this.rotation.y);
        const roll = Matrix4.RotationZ(this.rotation.z);
        //
        const transformationMatrix = Matrix4.Translate(this.position.x, this.position.y, this.position.z);
        //
        const rotationMatrix = roll.multiply(pitch).multiply(yaw);
        //
        return rotationMatrix.multiply(transformationMatrix);
    }
}
