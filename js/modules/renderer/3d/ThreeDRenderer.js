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
        for (const mesh of meshes) {
            const worldMatrix = mesh.getWorldMatrix();
            const mvpMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);
            //
            for (const vertex of mesh.vertices) {
                const projectedVertex = vertex.transformCoordinate(mvpMatrix);
                this._drawVertex(this._convertToScreenCoordinates(projectedVertex.x, projectedVertex.y), mesh.color);
            }
        }
        //
        this.ctx.putImageData(this.backbuffer, 0, 0);
        this.ctx.font = '15px sans-serif';
    }
    //
    _convertToScreenCoordinates(x, y) {
        const screenX = x * this.width + this.width / 2.0;
        const screenY = -y * this.height + this.height / 2.0;
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
}
