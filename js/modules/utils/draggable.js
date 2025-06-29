'use strict';

export { Draggable };
//
class Draggable {
    targetElement = null;
    //
    constructor(element) {
        this.targetElement = element;
        element.addEventListener('mousedown', this.startDrag.bind(this));
        element.addEventListener('touchstart', this.startDrag.bind(this));
    }
    //
    startDrag(event) {
        if (event.target !== this.targetElement && !event.target.matches('label, p, strong')) {
            return;
        }
        //
        event.preventDefault();
        //
        const element = event.currentTarget;
        //
        const offsetX = event.clientX - element.getBoundingClientRect().left;
        const offsetY = event.clientY - element.getBoundingClientRect().top;
        //
        const moveHandler = (moveEvent) => {
            moveEvent.preventDefault();
            element.style.left = moveEvent.clientX - offsetX + 'px';
            element.style.top = moveEvent.clientY - offsetY + 'px';
        };
        //
        const upHandler = () => {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('touchend', upHandler);
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
        document.addEventListener('touchmove', moveHandler);
        document.addEventListener('touchend', upHandler);
    }
}
