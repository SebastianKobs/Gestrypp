'use strict';

export { ThreeDRenderer };

class ThreeDRenderer {
    ctx = null;
    backbuffer = null;
    width = 0;
    height = 0;
    fps = 0;
    step = 0;
    //
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }
    //
    clear() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.backbuffer = this.ctx.getImageData(0, 0, this.width, this.height);
    }
    //
    render(camera, meshes) {
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        //
        this.clear();
        //
        console.time('render');
        for (const mesh of meshes) {
            const worldMatrix = mesh.getWorldMatrix();
            const mvpMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
            //
            if (mesh.hasFaces()) {
                this._drawMeshTris(mesh, mvpMatrix);
            } else {
                this._drawMeshVertices(mesh, mvpMatrix);
            }
        }
        //
        this.ctx.putImageData(this.backbuffer, 0, 0);
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
            this._drawBrezenhamLine(pixelA, pixelB, mesh.color);
            this._drawBrezenhamLine(pixelB, pixelC, mesh.color);
            this._drawBrezenhamLine(pixelC, pixelA, mesh.color);
        }
    }
    //
    _convertToScreenCoordinates(v) {
        const screenX = v.x * this.width + this.width / 2.0;
        const screenY = -v.y * this.height + this.height / 2.0;
        //
        return { x: screenX, y: screenY };
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
    _putPixel(x, y, color) {
        const index = (Math.floor(x) + Math.floor(y) * this.width) * 4;
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
        while (true) {
            this._putPixel(x0, y0, color);
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
        }
    }
}
