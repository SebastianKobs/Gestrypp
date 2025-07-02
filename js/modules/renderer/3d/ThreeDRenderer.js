'use strict';

export { ThreeDRenderer };

import { Vector3 } from '../../math/Vector3.js';
import { Color } from '../../utils/Color.js';

class ThreeDRenderer {
    ctx = null;
    backbuffer = null;
    depthBuffer = null;
    width = 0;
    height = 0;
    halfWidth = 0;
    halfHeight = 0;
    fps = 0;
    step = 0;
    //
    constructor(canvas) {
        const offscreen = canvas.transferControlToOffscreen();
        this.ctx = offscreen.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.halfWidth = this.width / 2.0;
        this.halfHeight = this.height / 2.0;
    }
    //
    clear() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.depthBuffer = [];
        this.backbuffer = this.ctx.getImageData(0, 0, this.width, this.height);
    }
    //
    render(camera, meshes) {
        console.time('render');
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        const vpMatrix = viewMatrix.multiply(projectionMatrix);
        //
        this.clear();
        //
        for (const mesh of meshes) {
            const worldMatrix = mesh.getWorldMatrix();
            const mvpMatrix = worldMatrix.multiply(vpMatrix);
            //
            if (mesh.hasFaces()) {
                this._drawMeshTris(mesh, mvpMatrix);
            } else {
                this._drawMeshVertices(mesh, mvpMatrix);
            }
        }
        //
        this.ctx.putImageData(this.backbuffer, 0, 0);
        console.timeEnd('render');
    }
    //
    _drawMeshVertices(mesh, mvpMatrix) {
        for (const vertex of mesh.vertices) {
            const pixel = this._convertToScreenCoordinates(vertex.transformCoordinate(mvpMatrix));
            this._drawVertex(pixel, mesh.color);
        }
    }
    //
    _drawMeshTris(mesh, mvpMatrix) {
        for (const tri of mesh.tris) {
            const vertexA = mesh.vertices[tri.v1];
            const vertexB = mesh.vertices[tri.v2];
            const vertexC = mesh.vertices[tri.v3];
            //
            const pixelA = this._convertToScreenCoordinates(vertexA.transformCoordinate(mvpMatrix));
            const pixelB = this._convertToScreenCoordinates(vertexB.transformCoordinate(mvpMatrix));
            const pixelC = this._convertToScreenCoordinates(vertexC.transformCoordinate(mvpMatrix));
            //
            this._rasterizeTri(pixelA, pixelB, pixelC, mesh.color);
            this._wireframeTri(pixelA, pixelB, pixelC, new Color(255, 255, 255, 1));
        }
    }
    //
    _convertToScreenCoordinates(v) {
        const screenX = v.x * this.width + this.halfWidth;
        const screenY = -v.y * this.height + this.halfHeight;
        //
        return new Vector3(screenX, screenY, v.z);
    }
    //
    _drawVertex(point, color) {
        if (point.x <= 0 || point.y <= 0 || point.x > this.width || point.y > this.height) {
            return;
        }
        //
        this._putPixel(point.x, point.y, color);
    }
    //
    _putPixel(p, color, skipDepthCheck = false) {
        const pixelIndex = Math.floor(p.x) + Math.floor(p.y) * this.width;
        const index = pixelIndex * 4;
        //
        if (!skipDepthCheck && this.depthBuffer[pixelIndex] !== undefined && this.depthBuffer[pixelIndex] > p.z) {
            return;
        }
        this.depthBuffer[pixelIndex] = p.z;
        this.backbuffer.data[index] = color.r;
        this.backbuffer.data[index + 1] = color.g;
        this.backbuffer.data[index + 2] = color.b;
        this.backbuffer.data[index + 3] = color.a * 255;
    }
    //
    _drawBrezenhamLine(p0, p1, color) {
        let x0 = p0.x >> 0;
        let y0 = p0.y >> 0;
        let x1 = p1.x >> 0;
        let y1 = p1.y >> 0;
        //
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        //
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        //
        let err = dx - dy;
        //
        const steps = Math.max(dx, dy) || 1;
        let step = 0;
        //
        while (true) {
            //
            const factor = steps === 0 ? 0 : step / steps;
            //
            const z = p0.z * (1 - factor) + p1.z * factor; // lerp
            //
            this._putPixel(new Vector3(x0, y0, z), color, false);
            //
            if (x0 === x1 && y0 === y1) {
                break;
            }
            //
            const e2 = err * 2;
            //
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            //
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
            step++;
        }
    }
    //
    _wireframeTri(A, B, C, color) {
        this._drawBrezenhamLine(A, B, color);
        this._drawBrezenhamLine(B, C, color);
        this._drawBrezenhamLine(C, A, color);
    }
    //
    _rasterizeTri(A, B, C, color) {
        const ABC = this._edgeFunction(A, B, C);
        //
        if (ABC < 0) {
            return;
        }
        //
        const minX = Math.min(A.x, B.x, C.x);
        const minY = Math.min(A.y, B.y, C.y);
        const maxX = Math.max(A.x, B.x, C.x);
        const maxY = Math.max(A.y, B.y, C.y);
        //
        const P = new Vector3(0, 0, 0);
        //
        for (P.y = minY; P.y < maxY; P.y++) {
            for (P.x = minX; P.x < maxX; P.x++) {
                const ABP = this._edgeFunction(A, B, P);
                const BCP = this._edgeFunction(B, C, P);
                const CAP = this._edgeFunction(C, A, P);
                //
                if (ABP < 0 || BCP < 0 || CAP < 0) {
                    continue;
                }
                const weightA = BCP / ABC;
                const weightB = CAP / ABC;
                const weightC = ABP / ABC;
                //
                P.z = A.z * weightA + B.z * weightB + C.z * weightC;
                //
                this._putPixel(P, color);
            }
        }
    }
    //
    _edgeFunction(a, b, c) {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    }
}
