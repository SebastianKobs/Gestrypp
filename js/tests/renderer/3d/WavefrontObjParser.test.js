import { expect, test, vi, afterEach } from 'vitest';
import fs from 'node:fs';

import { WavefrontObjParser } from '../../../modules/renderer/3d/WavefrontObjParser.js';
import { unityCube } from '../../../modules/renderer/3d/testGeometry/unityCube.js';

test('WavefrontObjParser with Unity Cube obj', () => {
    const cubeObjFile = fs.readFileSync('js/modules/renderer/3d/testGeometry/cube.obj', 'utf8');
    const mesh = WavefrontObjParser.parse(cubeObjFile);
    const uc = unityCube();
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
