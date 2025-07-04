'use strict';

export { Texture };

import { Color } from '../../utils/Color.js';
class Texture {
    constructor(src) {
        this.src = src;
        this.textureBuffer = null;
        //
        this._loadTexture();
    }
    //
    _loadTexture() {
        const image = new Image();
        image.src = this.src;
        image.onload = () => {
            console.log(`Texture loaded: ${this.src}`);
            const textureCanvas = document.createElement('canvas');
            textureCanvas.width = image.width;
            textureCanvas.height = image.height;
            const ctx = textureCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            this.textureBuffer = ctx.getImageData(0, 0, image.width, image.height);
        };
        image.onerror = (error) => {
            console.error(`Error loading texture: ${this.src}`, error);
        };
    }
    //
    _mapUVToTexture(uv) {
        if (!this.textureBuffer) {
            console.warn('Texture not loaded yet');
            return new Color(255, 0, 255, 1); // Return a default color if texture is not loaded
        }
        //

        const u = ~~(uv.x * (this.textureBuffer.width - 1));
        const v = ~~(uv.y * (this.textureBuffer.height - 1));
        //
        //console.log(u, v, this.textureBuffer.width, this.textureBuffer.height);
        const index = (v * this.textureBuffer.width + u) * 4;

        const c = new Color(
            this.textureBuffer.data[index],
            this.textureBuffer.data[index + 1],
            this.textureBuffer.data[index + 2],
            this.textureBuffer.data[index + 3] / 255 // Convert alpha to [0, 1] range
        );
        //console.log(`Mapping UV (${uv.x}, ${uv.y}) to texture color: ${c}`);
        return c;
    }
}
