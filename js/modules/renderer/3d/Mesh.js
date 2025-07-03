'use strict';

import { Matrix4 } from '../../math/Matrix4.js';
import { Vector3 } from '../../math/Vector3.js';
import { Color } from '../../utils/Color.js';
import { BoundingBox } from './BoundingBox.js';
export { Mesh };

class Mesh {
    position = new Vector3(0, 0, 0);
    rotation = new Vector3(0, 0, 0);
    vertices = [];
    tris = [];
    color = new Color(255, 255, 255);
    //
    boundingBox = new BoundingBox();
    //
    constructor(position = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0), vertices = []) {
        this.position = position;
        this.rotation = rotation;
        this.vertices = vertices;
    }
    //
    addVertex(vertex) {
        this.vertices.push(vertex);
        //
        this.boundingBox.update(vertex);
        //
        return this;
    }
    //
    addTri(tri) {
        this.tris.push(tri);
        //
        return this;
    }
    //
    unity() {
        const center = this.boundingBox.getCenter();
        const scale = this.boundingBox.getScale();
        //
        for (const vertex of this.vertices) {
            vertex.subtract(center);
            vertex.divideScalar(scale);
        }
        //
        this.boundingBox.unity();
        //
        return this;
    }
    //
    scale(scalar) {
        for (const vertex of this.vertices) {
            vertex.multiplyScalar(scalar);
        }
        //
        this.boundingBox.scale(scalar);
        //
        return this;
    }
    //
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
    //
    hasFaces() {
        return this.tris.length > 0;
    }
}
