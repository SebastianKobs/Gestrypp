import { expect, test, vi, afterEach } from 'vitest';
import fs from 'node:fs';

import { WavefrontObjParser } from '../../../modules/renderer/3d/WavefrontObjParser.js';
import { unityCube } from './geometry/unityCube.js';
import { Vector3 } from '../../../modules/math/Vector3.js';
import { Tri } from '../../../modules/renderer/3d/Tri.js';

test('WavefrontObjParser with Unity Cube obj', () => {
    const cubeObjFile = fs.readFileSync('js/tests/renderer/3d/geometry/cube.obj', 'utf8');
    const mesh = WavefrontObjParser.parse(cubeObjFile);
    //
    const uc = unityCube();
    //
    expect(mesh).toStrictEqual(uc);
});
//
test('WavefrontObjParser format Warnings', () => {
    const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
    //
    afterEach(() => {
        consoleMock.mockReset();
    });
    //
    const missingVertexObj = 'v 1.0 1.0';
    WavefrontObjParser.parse(missingVertexObj);
    //
    expect(consoleMock).toHaveBeenLastCalledWith(`Invalid vertex on line: ${missingVertexObj}`);
    //
    const missingFaceObj = 'f 1/2/3 4/5/6';
    WavefrontObjParser.parse(missingFaceObj);
    //
    expect(consoleMock).toHaveBeenLastCalledWith(`Invalid face on line: ${missingFaceObj}`);
    //
    const misssingOrInvalidNormalObj = 'f 1/2/3 4/5/a 1/1/2';
    WavefrontObjParser.parse(misssingOrInvalidNormalObj);
    //
    expect(consoleMock).toHaveBeenLastCalledWith(`Invalid normal on line: ${misssingOrInvalidNormalObj}`);
    const nonNumericVertex = 'v 1.0 1.0 a';
    WavefrontObjParser.parse(nonNumericVertex);
    //
    expect(consoleMock).toHaveBeenLastCalledWith(`Invalid vertex on line: ${nonNumericVertex}`);
    //
    const nonNumericFaceIndexObj = 'f 1/2/3 4/5/6 a/1/2';
    WavefrontObjParser.parse(nonNumericFaceIndexObj);
    //
    expect(consoleMock).toHaveBeenLastCalledWith(`Invalid face on line: ${nonNumericFaceIndexObj}`);
});

test('wavefrontObjParser Quads and Polygons', () => {
    const cubeObjFile = fs.readFileSync('js/tests/renderer/3d/geometry/quadtest.obj', 'utf8');
    const mesh = WavefrontObjParser.parse(cubeObjFile, false);
    //
    const expectedVertices = [new Vector3(0, 1, 2), new Vector3(2, 3, 4), new Vector3(5, 6, 7), new Vector3(8, 9, 10)];
    const expectedNormals = [new Vector3(0, 1, 2), new Vector3(2, 3, 4), new Vector3(5, 6, 7), new Vector3(8, 9, 10)];
    const expectedTris = [new Tri(0, 1, 2).addNormals(0, 1, 2), new Tri(0, 2, 3).addNormals(0, 2, 3), new Tri(0, 3, 0).addNormals(0, 3, 0)];
    //
    expect(mesh.tris).toEqual(expectedTris);
    expect(mesh.vertices).toEqual(expectedVertices);
    expect(mesh.normals).toEqual(expectedNormals);
});
