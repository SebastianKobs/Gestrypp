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
    accumulatedTime = 0;
    fps = 0;
    steps = 0;
    lightPos = new Vector3(20, 40, -20);
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
        let start = performance.now();
        //
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
                this._drawMeshTris(mesh, mvpMatrix, worldMatrix);
            } else {
                this._drawMeshVertices(mesh, mvpMatrix);
            }
        }
        //
        this.ctx.putImageData(this.backbuffer, 0, 0);
        //
        let end = performance.now();
        //
        this.accumulatedTime += end - start;
        this.steps++;
        //
        if (this.accumulatedTime >= 1000) {
            this.fps = 1000 / Math.round(this.accumulatedTime / this.steps);
            this.accumulatedTime = 0;
            this.steps = 0;
        }
        //
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
    }
    //
    _drawMeshVertices(mesh, mvpMatrix) {
        for (const vertex of mesh.vertices) {
            const pixel = this._convertToScreenCoordinates(vertex.transformCoordinate(mvpMatrix));
            this._drawVertex(pixel, mesh.color);
        }
    }
    //
    _drawMeshTris(mesh, mvpMatrix, worldMatrix) {
        for (const tri of mesh.tris) {
            const vertexA = mesh.vertices[tri.v1];
            const vertexB = mesh.vertices[tri.v2];
            const vertexC = mesh.vertices[tri.v3];
            //
            const n1 = mesh.normals[tri.n1];
            const n2 = mesh.normals[tri.n2];
            const n3 = mesh.normals[tri.n3];
            //
            const uv1 = mesh.uvCoordinate[tri.uv1];
            const uv2 = mesh.uvCoordinate[tri.uv2];
            const uv3 = mesh.uvCoordinate[tri.uv3];
            //
            const pixelA = {
                pixel: this._convertToScreenCoordinates(vertexA.transformCoordinate(mvpMatrix)),
                normal: n1.transformCoordinate(worldMatrix),
                world: vertexA.transformCoordinate(worldMatrix),
                uv: uv1,
            };
            //
            const pixelB = {
                pixel: this._convertToScreenCoordinates(vertexB.transformCoordinate(mvpMatrix)),
                normal: n2.transformCoordinate(worldMatrix),
                world: vertexB.transformCoordinate(worldMatrix),
                uv: uv2,
            };
            //
            const pixelC = {
                pixel: this._convertToScreenCoordinates(vertexC.transformCoordinate(mvpMatrix)),
                normal: n3.transformCoordinate(worldMatrix),
                world: vertexC.transformCoordinate(worldMatrix),
                uv: uv3,
            };
            //
            this._rasterizeTri(pixelA, pixelB, pixelC, mesh);
            //this._wireframeTri(pixelA, pixelB, pixelC, new Color(255, 255, 255, 1));
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
        const pixelIndex = ~~p.x + ~~p.y * this.width; // ~~ fast Math.floor
        const index = pixelIndex * 4;
        //
        if (!skipDepthCheck && this.depthBuffer[pixelIndex] !== undefined && this.depthBuffer[pixelIndex] > p.z) {
            return;
        }
        this.depthBuffer[pixelIndex] = p.z;
        //
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
            if (x0 < 0 || x0 >= this.width || y0 < 0 || y0 >= this.height) {
                break;
            }
            const factor = steps === 0 ? 0 : step / steps;
            //
            const z = p0.z * (1 - factor) + p1.z * factor; // lerp
            //
            this._putPixel(new Vector3(x0, y0, z), color);
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
        const pA = A.pixel;
        const pB = B.pixel;
        const pC = C.pixel;
        this._drawBrezenhamLine(pA, pB, color);
        this._drawBrezenhamLine(pB, pC, color);
        this._drawBrezenhamLine(pC, pA, color);
    }
    /**
     * see https://fgiesen.wordpress.com/2013/02/10/optimizing-the-basic-rasterizer/
     */
    _rasterizeTri(A, B, C, mesh) {
        const v0 = A.pixel;
        const v1 = B.pixel;
        const v2 = C.pixel;
        //
        if ((A.normal.z | B.normal.z | C.normal.z) < 0) {
            return;
        }
        //
        const area = this._edgeFunction(v0, v1, v2);
        //
        if (area < 0) {
            return;
        }
        //
        const minX = Math.max(~~Math.min(v0.x, v1.x, v2.x), 0);
        const minY = Math.max(~~Math.min(v0.y, v1.y, v2.y), 0);
        const maxX = Math.min(~~Math.max(v0.x, v1.x, v2.x), this.width - 1);
        const maxY = Math.min(~~Math.max(v0.y, v1.y, v2.y), this.height - 1);
        //

        const p = new Vector3(minX, minY, 0);
        //
        let w0_row = this._edgeFunction(v1, v2, p);
        let w1_row = this._edgeFunction(v2, v0, p);
        let w2_row = this._edgeFunction(v0, v1, p);
        //
        const A01 = v0.y - v1.y;
        const A12 = v1.y - v2.y;
        const A20 = v2.y - v0.y;
        //
        const B01 = v1.x - v0.x;
        const B12 = v2.x - v1.x;
        const B20 = v0.x - v2.x;
        //
        const nDotLA = this._computeNDotL(A.world, A.normal, this.lightPos);
        const nDotLB = this._computeNDotL(B.world, B.normal, this.lightPos);
        const nDotLC = this._computeNDotL(C.world, C.normal, this.lightPos);
        //
        const uvA = mesh.texture._mapUVToTexture(A.uv);
        const uvB = mesh.texture._mapUVToTexture(B.uv);
        const uvC = mesh.texture._mapUVToTexture(C.uv);
        //console.log(`UV A: ${uvA}, UV B: ${uvB}, UV C: ${uvC}`);
        const colorA = new Color(uvA.r * nDotLA, uvA.g * nDotLA, uvA.b * nDotLA);
        const colorB = new Color(uvB.r * nDotLB, uvB.g * nDotLB, uvB.b * nDotLB);
        const colorC = new Color(uvC.r * nDotLC, uvC.g * nDotLC, uvC.b * nDotLC);
        //
        for (p.y = minY; p.y <= maxY; p.y++) {
            let w0 = w0_row;
            let w1 = w1_row;
            let w2 = w2_row;
            for (p.x = minX; p.x <= maxX; p.x++) {
                //
                if ((w0 | w1 | w2) >= 0) {
                    //
                    const weightA = w0 / area;
                    const weightB = w1 / area;
                    const weightC = w2 / area;
                    //
                    const r = weightA * colorA.r + weightB * colorB.r + weightC * colorC.r;
                    const g = weightA * colorA.g + weightB * colorB.g + weightC * colorC.g;
                    const b = weightA * colorA.b + weightB * colorB.b + weightC * colorC.b;
                    //
                    const colorShaded = new Color(r, g, b, 1);
                    //
                    p.z = v0.z * weightA + v1.z * weightB + v2.z * weightC;
                    //
                    this._putPixel(p, colorShaded);
                }
                //
                w0 += A12;
                w1 += A20;
                w2 += A01;
            }
            //
            w0_row += B12;
            w1_row += B20;
            w2_row += B01;
        }
    }
    //
    _computeNDotL = function (vertex, normal, lightPosition) {
        const lightDirection = vertex.subtract(lightPosition);
        //
        normal.normalize();
        lightDirection.normalize();
        //
        return Math.max(0, normal.dot(lightDirection));
    };
    //
    _edgeFunction(a, b, c) {
        return (a.y - b.y) * c.x + (b.x - a.x) * c.y + (a.x * b.y - a.y * b.x);
    }
}
