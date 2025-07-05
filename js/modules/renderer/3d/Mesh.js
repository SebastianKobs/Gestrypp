'use strict';

import { Matrix4 } from '../../math/Matrix4.js';
import { Vector3 } from '../../math/Vector3.js';
import { Color } from '../../utils/Color.js';
import { BoundingBox } from './BoundingBox.js';
import { Texture } from './Texture.js';
export { Mesh };

class Mesh {
    position = new Vector3(0, 0, 0);
    rotation = new Vector3(0, 0, 0);
    //
    faces = [];
    color = new Color(255, 255, 255);
    texture = null;
    //
    boundingBox = new BoundingBox();
    //
    constructor(position = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0), vertices = []) {
        this.position = position;
        this.rotation = rotation;
        this.vertices = vertices;
    }
    //
    updateBoundingBox(vertex) {
        this.boundingBox.update(vertex);
        //
        return this;
    }
    //
    addFace(face) {
        this.faces.push(face);
        //
        return this;
    }
    //
    unity() {
        const center = this.boundingBox.getCenter();
        const scale = this.boundingBox.getScale();
        //
        for (const face of this.faces) {
            face.unity(center, scale);
        }
        //
        this.boundingBox.unity();
        //
        return this;
    }
    //
    scale(scalar) {
        for (const face of this.faces) {
            face.scale(scalar);
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
        return this.faces.length > 0;
    }
    //
    addTextureFromSrc(src) {
        this.texture = new Texture(src, this._onTextureLoaded.bind(this));
    }
    _onTextureLoaded() {
        for (const face of this.faces) {
            face.addUVColors(this.texture);
        }
    }
}
