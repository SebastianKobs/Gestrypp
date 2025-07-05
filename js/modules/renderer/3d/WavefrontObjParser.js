'use strict';

export { WavefrontObjParser };

import { Mesh } from './Mesh.js';
import { Face } from './Face.js';
import { Vector3 } from '../../math/Vector3.js';
class WavefrontObjParser {
    static parse(objString, unity = true) {
        const lines = objString.split('\n');
        //
        const mesh = new Mesh();
        //
        let hadErrors = false;
        //
        const vertices = [];
        const normals = [];
        const uvCoordinates = [];
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
            let faceIndices = null;
            let normalIndices = null;
            let uvCoordinateIndices = null;
            let face = null;
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
                    mesh.updateBoundingBox(new Vector3(...values.map(Number)));
                    //
                    vertices.push(new Vector3(...values.map(Number)));
                    break;
                case 'vt':
                    if (values.length < 2 || values.some((value) => isNaN(Number(value)))) {
                        console.warn(`Invalid texture coordinate on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    uvCoordinates.push(new Vector3(...values.map(Number)));
                    break;
                case 'vn':
                    if (values.length < 3 || values.some((value) => isNaN(Number(value)))) {
                        console.warn(`Invalid normal on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //

                    normals.push(new Vector3(...values.map(Number)));
                    break;
                case 'f':
                    /**
                     * Faces are defined as: v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3 ...
                     * where v is the vertex index, vt is the texture coordinate index, and vn is the normal index.
                     * vertices, texture coordinates, and normals are 1-indexed in the OBJ file.
                     * The first vertex is v1, the second is v2, and so on.
                     * vt and vn can be omitted. v is always required.
                     */
                    if (values.length < 3) {
                        console.warn(`Invalid face on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    faceIndices = values.map((part) => part.split('/')[0] - 1).map(Number);
                    //
                    uvCoordinateIndices = values
                        .map((part) => {
                            const uvPart = part.split('/')[1];
                            return uvPart === '' ? null : Number(uvPart - 1);
                        })
                        .filter((value) => value !== null);
                    //
                    normalIndices = values
                        .map((part) => {
                            const normalPart = part.split('/')[2];
                            return normalPart === '' ? null : Number(normalPart - 1);
                        })
                        .filter((value) => value !== null);
                    //
                    if (faceIndices.some((value) => isNaN(value) || value < 0)) {
                        console.warn(`Invalid face on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    if (normalIndices.some((value) => isNaN(value) || value < 0)) {
                        console.warn(`Invalid normal on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    if (uvCoordinateIndices.some((value) => isNaN(value) || value < 0)) {
                        console.warn(`Invalid uv on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    for (let i = 1; i < faceIndices.length - 1; i++) {
                        face = new Face(vertices[faceIndices[0]], vertices[faceIndices[i]], vertices[faceIndices[i + 1]]);
                        //
                        if (normalIndices.length) {
                            face.addNormals(normals[normalIndices[0]], normals[normalIndices[i]], normals[normalIndices[i + 1]]);
                        }
                        //
                        if (uvCoordinateIndices.length) {
                            face.addUVs(
                                uvCoordinates[uvCoordinateIndices[0]],
                                uvCoordinates[uvCoordinateIndices[i]],
                                uvCoordinates[uvCoordinateIndices[i + 1]]
                            );
                        }
                        //
                        mesh.addFace(face);
                        //
                    }
                    //
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
