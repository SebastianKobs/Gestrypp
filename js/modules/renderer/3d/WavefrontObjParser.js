'use strict';

export { WavefrontObjParser };

import { Mesh } from './Mesh.js';
import { Tri } from './Tri.js';
import { Vector3 } from '../../math/Vector3.js';

class WavefrontObjParser {
    static parse(objString) {
        const lines = objString.split('\n');
        //
        const mesh = new Mesh();
        //
        let hadErrors = false;
        //
        for (const line of lines) {
            if (line.startsWith('#') || line.trim() === '') {
                continue;
            }
            //
            const parts = line.trim().replace(/#.*/, '').split(/\s+/);
            //
            const values = parts.slice(1);
            //
            let faces = null;
            let normals = null;
            let tri = null;
            //
            switch (parts[0]) {
                case 'v':
                    if (values.length < 3 || values.some((value) => isNaN(Number(value)))) {
                        console.warn(`Invalid vertex on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    mesh.addVertex(new Vector3(...values.map(Number)));
                    break;
                case 'vn':
                    if (values.length < 3 || values.some((value) => isNaN(Number(value)))) {
                        console.warn(`Invalid normal on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    mesh.addNormal(new Vector3(...values.map(Number)));
                    break;
                case 'f':
                    if (values.length < 3) {
                        console.warn(`Invalid face on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    faces = values.map((part) => part.split('/')[0] - 1).map(Number);
                    //
                    normals = values.map((part) => part.split('/')[2] - 1).map(Number);
                    //
                    if (faces.some((value) => isNaN(value) || value < 0)) {
                        console.warn(`Invalid face on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    if (normals.some((value) => isNaN(value) || value < 0)) {
                        console.warn(`Invalid normal on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    tri = new Tri(...faces);
                    tri.addNormals(...normals);
                    mesh.addTri(tri);
                    break;
            }
        }
        //
        mesh.unity();
        return !hadErrors ? mesh : new Mesh();
    }
}
