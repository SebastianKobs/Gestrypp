export { Helper };
import { Color } from './color.js';

class Helper {
    static hexToColor(hex, alpha = 1) {
        const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
        return new Color(r, g, b, alpha);
    }
    //
    static save(canvas) {
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
    }
}