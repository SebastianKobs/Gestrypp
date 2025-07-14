'use strict';

export { Draggable };
//
class Draggable {
    targetElement = null;
    //
    constructor(element) {
        this.targetElement = element;
        element.addEventListener('pointerdown', this.startDrag.bind(this));
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
            document.removeEventListener('pointermove', moveHandler);
            document.removeEventListener('pointerup', upHandler);
        };
        //
        document.addEventListener('pointermove', moveHandler);
        document.addEventListener('pointerup', upHandler);
    }
}
