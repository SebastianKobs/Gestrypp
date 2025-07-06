'use strict';

export { ThreeDRenderer };

import { Vector3 } from '../../math/Vector3.js';
import { Color } from '../../utils/Color.js';

class ThreeDRenderer {
    ctx = null;
    backbuffer = null;
    backbufferData = null;
    depthBuffer = null;
    width = 0;
    height = 0;
    halfWidth = 0;
    halfHeight = 0;
    accumulatedTime = 0;
    fps = 0;
    steps = 0;
    lightPos = new Vector3(20, -20, -40); // Light position in world coordinates
    debug = false;
    showWireframe = false;
    shaded = true;
    //
    constructor(canvas) {
        const offscreen = canvas.transferControlToOffscreen();
        this.ctx = offscreen.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.halfWidth = this.width / 2.0;
        this.halfHeight = this.height / 2.0;
        this.depthBuffer = new Float32Array(this.width * this.height);
        this.backbuffer = this.ctx.getImageData(0, 0, this.width, this.height);
        this.backbufferData = this.backbuffer.data;
    }
    //
    clear() {
        this.depthBuffer.fill(0);
        this.backbuffer.data.fill(0);
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
                this._drawMeshFaces(mesh, mvpMatrix, worldMatrix);
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
        if (this.debug) {
            this._debugMeshes(meshes, vpMatrix);
        }
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
    }
    _debugMeshes(meshes, vpMatrix) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.font = '16px Arial';
        //

        for (const mesh of meshes) {
            const worldMatrix = mesh.getWorldMatrix();
            const mvpMatrix = worldMatrix.multiply(vpMatrix);
            this.ctx.fillText(`Mesh: ${mesh.position}`, this.width - 400, 40);
            for (const face of mesh.faces) {
                const pixelA = this._convertToScreenCoordinates(face.v1.transformCoordinate(mvpMatrix));
                const pixelB = this._convertToScreenCoordinates(face.v2.transformCoordinate(mvpMatrix));
                const pixelC = this._convertToScreenCoordinates(face.v3.transformCoordinate(mvpMatrix));
                //
                const area = this._edgeFunction(pixelC, pixelB, pixelA);
                //
                if (area < 0) {
                    continue;
                }
                this.ctx.fillText('A', pixelA.x, pixelA.y);
                this.ctx.fillText('B', pixelB.x, pixelB.y);
                this.ctx.fillText('C', pixelC.x, pixelC.y);
                //
                const cp = face.v1.addVector3(face.v2).addVector3(face.v3).divideScalar(3);
                const cpp = this._convertToScreenCoordinates(cp.transformCoordinate(mvpMatrix));
                this.ctx.fillText('cp', cpp.x, cpp.y);
                //
                const cn = face.n1.addVector3(face.n2).addVector3(face.n3).divideScalar(3).normalize();
                const cnw = cp.addVector3(cn.multiplyScalar(0.4));
                const np = this._convertToScreenCoordinates(cnw.transformCoordinate(mvpMatrix));
                //
                this.ctx.fillText('cn', np.x, np.y);
                this.ctx.beginPath();
                this.ctx.moveTo(cpp.x, cpp.y);
                this.ctx.lineTo(np.x, np.y);
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.stroke();

                const lwp = this._convertToScreenCoordinates(this.lightPos.transformCoordinate(vpMatrix));
                this.ctx.fillText('L', lwp.x, lwp.y);
            }
        }
    }
    //
    _drawMeshVertices(mesh, mvpMatrix) {
        for (const vertex of mesh.vertices) {
            const pixel = this._convertToScreenCoordinates(vertex.transformCoordinate(mvpMatrix));
            this._drawVertex(pixel, mesh.color);
        }
    }
    //
    _drawMeshFaces(mesh, mvpMatrix, worldMatrix) {
        for (const face of mesh.faces) {
            const pixelA = {
                pixel: this._convertToScreenCoordinates(face.v1.transformCoordinate(mvpMatrix)),
                normal: face.n1.transformCoordinate(worldMatrix),
                world: face.v1.transformCoordinate(worldMatrix),
                uv: face.uv1Color,
            };
            //
            const pixelB = {
                pixel: this._convertToScreenCoordinates(face.v2.transformCoordinate(mvpMatrix)),
                normal: face.n2.transformCoordinate(worldMatrix),
                world: face.v2.transformCoordinate(worldMatrix),
                uv: face.uv2Color,
            };
            //
            const pixelC = {
                pixel: this._convertToScreenCoordinates(face.v3.transformCoordinate(mvpMatrix)),
                normal: face.n3.transformCoordinate(worldMatrix),
                world: face.v3.transformCoordinate(worldMatrix),
                uv: face.uv2Color,
            };
            //
            this._rasterizeFace(pixelA, pixelB, pixelC, mesh);
            if (this.showWireframe) {
                this._wireframeFace(pixelA, pixelB, pixelC, new Color(255, 255, 255, 1));
            }
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
        const index = pixelIndex << 2;
        //
        if (!skipDepthCheck && this.depthBuffer[pixelIndex] !== 0 && this.depthBuffer[pixelIndex] > p.z) {
            return;
        }
        this.depthBuffer[pixelIndex] = p.z;
        //
        this.backbufferData[index] = color.r;
        this.backbufferData[index + 1] = color.g;
        this.backbufferData[index + 2] = color.b;
        this.backbufferData[index + 3] = color.a * 255;
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
    _wireframeFace(A, B, C, color) {
        const pA = A.pixel;
        const pB = B.pixel;
        const pC = C.pixel;
        //
        const area = this._edgeFunction(pC, pB, pA);
        //
        if (area < 0) {
            return;
        }
        this._drawBrezenhamLine(pA, pB, color);
        this._drawBrezenhamLine(pB, pC, color);
        this._drawBrezenhamLine(pC, pA, color);
    }
    /**
     * see https://fgiesen.wordpress.com/2013/02/10/optimizing-the-basic-rasterizer/
     */
    _rasterizeFace(A, B, C) {
        const v0 = A.pixel;
        const v1 = B.pixel;
        const v2 = C.pixel;
        //
        //
        const area = this._edgeFunction(v2, v1, v0);
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
        let w0_row = this._edgeFunction(v1, v0, p);
        let w1_row = this._edgeFunction(v0, v2, p);
        let w2_row = this._edgeFunction(v2, v1, p);
        //
        const A01 = v2.y - v1.y;
        const A12 = v1.y - v0.y;
        const A20 = v0.y - v2.y;
        //
        const B01 = v1.x - v2.x;
        const B12 = v0.x - v1.x;
        const B20 = v2.x - v0.x;
        //
        const nDotLA = this.shaded ? this._computeNDotL(A.world, A.normal, this.lightPos) : 1;
        const nDotLB = this.shaded ? this._computeNDotL(B.world, B.normal, this.lightPos) : 1;
        const nDotLC = this.shaded ? this._computeNDotL(C.world, C.normal, this.lightPos) : 1;
        //
        const uvA = A.uv;
        const uvB = B.uv;
        const uvC = C.uv;
        //
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
                    const weightA = w2 / area;
                    const weightB = w1 / area;
                    const weightC = w0 / area;
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
