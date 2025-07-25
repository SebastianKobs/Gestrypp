'use strict';

export { HexToColor, EnsureNumberFormat, Clamp, SaveCanvas };
import { Color } from './Color.js';

const HexToColor = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
    return new Color(r, g, b, alpha);
};
//
const EnsureNumberFormat = (value, defaultValue = 0) => {
    return value.replace(/[^\d.,-]/g, '').replace(/,/g, '.') || defaultValue;
};
//
const Clamp = (value, min, max) => {
    if (isNaN(min) || isNaN(max)) {
        console.warn('Invalid min or max value. check input element for min and max');
        return value;
    }
    //
    return Math.max(min, Math.min(max, value));
};
//
const SaveCanvas = (canvas) => {
    canvas.toBlob(
        (blob) => {
            const link = document.createElement('a');
            //
            const date = new Date();
            const filename = 'gestrypp-' + date.toISOString().replace(/[:.]/g, '-') + '.jpg';
            //
            link.download = filename;
            link.href = URL.createObjectURL(blob);
            link.click();
            //
            URL.revokeObjectURL(link.href);
        },
        'image/jpeg',
        0.8
    );
};
