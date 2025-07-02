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
            const parts = line.trim().split(/\s+/);
            //
            if (parts.length === 0 || parts[0].startsWith('#')) continue;
            //
            const values = parts.slice(1);
            //
            let faces = null;
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
                case 'f':
                    if (values.length < 3) {
                        console.warn(`Invalid face on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    //
                    faces = values.map((part) => part.split('/')[0]).map(Number);
                    if (faces.some((value) => isNaN(value) || value <= 0)) {
                        console.warn(`Invalid face on line: ${line}`);
                        hadErrors = true;
                        continue;
                    }
                    mesh.addTri(new Tri(...values.map((part) => part.split('/')[0] - 1)));
                    break;
            }
        }
        //
        mesh.unity();
        return !hadErrors ? mesh : new Mesh();
    }
}
