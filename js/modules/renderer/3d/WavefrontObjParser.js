'use strict';

export { WavefrontObjParser };

import { Mesh } from './Mesh.js';
import { Tri } from './Tri.js';
import { Vector3 } from '../../math/Vector3.js';

/** TODO: handle files without normals */
class WavefrontObjParser {
    static parse(objString, unity = true) {
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
            let values = parts.slice(1);
            //
            let faces = null;
            let normals = null;
            let uv = null;
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
                    if (values.length === 4 && values[3] !== '') {
                        values = values.map((value) => value / Number(values[3]));
                    }
                    mesh.addVertex(new Vector3(...values.map(Number)));
                    break;
                case 'vt':
                    if (values.length < 2 || values.some((value) => isNaN(Number(value)))) {
                        console.warn(`Invalid texture coordinate on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    mesh.addUv(new Vector3(...values.map(Number)));
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
                    uv = values.map((part) => {
                        const uvPart = part.split('/')[1];
                        return uvPart === '' ? null : Number(uvPart - 1);
                    });

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
                    if (uv.every((value) => value !== '') && uv.some((value) => isNaN(value) || value < 0)) {
                        console.warn(`Invalid uv on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    if (faces.length === 3) {
                        tri = new Tri(...faces);
                        tri.addNormals(...normals);
                        tri.addUVs(...uv);
                        mesh.addTri(tri);
                    } else {
                        // TIL: QUADS or POLYGONS are a thing in obj files
                        for (let i = 1; i < faces.length - 1; i++) {
                            tri = new Tri(faces[0], faces[i], faces[i + 1]);
                            tri.addNormals(normals[0], normals[i], normals[i + 1]);
                            tri.addUVs(uv[0], uv[i], uv[i + 1]);

                            mesh.addTri(tri);
                        }
                    }
                    break;
            }
        }
        //
        if (unity) {
            mesh.unity();
        }
        //
        return !hadErrors ? mesh : new Mesh();
    }
}
