import { Camera } from '../Camera.js';
import { Color } from '../../../utils/Color.js';
import { Vector3 } from '../../../math/Vector3.js';
import { ThreeDRenderer } from '../ThreeDRenderer.js';
import { WavefrontObjParser } from '../WavefrontObjParser.js';
//

window.addEventListener('load', async () => {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const position = new Vector3(0, 0, -10);
    const target = new Vector3(0, 0, 0);
    //
    const camera = new Camera(position, target, new Vector3(0, 1, 0), canvas.width / canvas.height);
    //
    const meshes = [];
    //
    const response = await fetch('/Gestrypp/testGeometry/homer.obj');

    const obj = await response.text();
    //
    const homer = WavefrontObjParser.parse(obj);
    //
    homer.scale(2);
    homer.color = new Color(0, 167, 200, 1);
    //
    homer.position = new Vector3(0, 0, 0);
    homer.rotation.z = (180 * Math.PI) / 180;
    //
    homer.addTextureFromSrc('/Gestrypp/testGeometry/texture_homer.jpg');
    meshes.push(homer);
    //
    const renderer = new ThreeDRenderer(canvas);
    //
    const update = () => {
        renderer.render(camera, meshes);
        requestAnimationFrame(update);
    };
    //
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') {
            homer.rotation.x += 0.1;
        } else if (event.key === 'ArrowDown') {
            homer.rotation.x -= 0.1;
        } else if (event.key === 'ArrowLeft') {
            homer.rotation.y -= 0.1;
        } else if (event.key === 'ArrowRight') {
            homer.rotation.y += 0.1;
        }
    });
    //
    requestAnimationFrame(update);
});
