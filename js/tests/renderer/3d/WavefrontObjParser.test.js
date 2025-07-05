import { expect, test, vi, afterEach } from 'vitest';
import fs from 'node:fs';

import { WavefrontObjParser } from '../../../modules/renderer/3d/WavefrontObjParser.js';
import { unityCube } from './geometry/unityCube.js';
import { Vector3 } from '../../../modules/math/Vector3.js';
import { Face } from '../../../modules/renderer/3d/Face.js';

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
    const quadTestFile = fs.readFileSync('js/tests/renderer/3d/geometry/quadtest.obj', 'utf8');
    const mesh = WavefrontObjParser.parse(quadTestFile, false);
    //
    const expectedVertices = [new Vector3(0, 1, 2), new Vector3(2, 3, 4), new Vector3(5, 6, 7), new Vector3(8, 9, 10)];
    const expectedNormals = [new Vector3(0, 1, 2), new Vector3(2, 3, 4), new Vector3(5, 6, 7), new Vector3(8, 9, 10)];
    const expectedUvs = [new Vector3(1, 1, 0), new Vector3(2, 2, 0), new Vector3(3, 3, 0), new Vector3(4, 4, 0)];
    const expectedFaces = [
        new Face(expectedVertices[0], expectedVertices[1], expectedVertices[2])
            .addNormals(expectedNormals[0], expectedNormals[1], expectedNormals[2])
            .addUVs(expectedUvs[0], expectedUvs[1], expectedUvs[2]),
        new Face(expectedVertices[0], expectedVertices[2], expectedVertices[3])
            .addNormals(expectedNormals[0], expectedNormals[2], expectedNormals[3])
            .addUVs(expectedUvs[0], expectedUvs[2], expectedUvs[3]),
        new Face(expectedVertices[0], expectedVertices[3], expectedVertices[0])
            .addNormals(expectedNormals[0], expectedNormals[3], expectedNormals[0])
            .addUVs(expectedUvs[0], expectedUvs[3], expectedUvs[0]),
    ];
    //
    expect(mesh.faces).toStrictEqual(expectedFaces);
});
