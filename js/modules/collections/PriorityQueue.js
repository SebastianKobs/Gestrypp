'use strict';

export { PriorityQueue, PriorityValueObject };

class PriorityValueObject {
    constructor(value, priority) {
        this.value = value;
        this.priority = priority || value;
        this.index = -1;
    }
    //
    toString() {
        return `ValueObject(value: ${this.value}, priority: ${this.priority})`;
    }
}
class PriorityQueue {
    constructor() {
        this.data = [];
    }
    //
    clear() {
        this.data = [];
    }
    //
    insert(value) {
        value.index = this.data.length;
        //
        this.data.push(value);
        //
        this._siftUp(this.data.length - 1);
    }
    //
    contains(value) {
        return this.data.includes(value);
    }
    //
    decreasePriority(value, newPriority) {
        const index = this.data.findIndex((item) => item.value === value);

        //
        if (index === -1) {
            throw new Error(`Value ${value} not found in PriorityQueue`);
        }
        //
        if (newPriority >= this.data[index].priority) {
            throw new Error(`New priority ${newPriority} must be less than current priority ${this.data[index].priority}`);
        }
        //
        this.data[index].priority = newPriority;
        //
        this._siftUp(index);
    }
    //
    extractMin() {
        if (this.data.length === 0) {
            throw new Error('PriorityQueue is empty');
        }
        if (this.data.length === 1) {
            return this.data.pop().value;
        }
        //
        const first = this.data[0];
        //
        this.data[0] = this.data.pop();
        //
        this._siftDown(0);
        //
        return first.value;
    }
    //
    isEmpty() {
        return this.data.length === 0;
    }
    //
    _siftUp(index) {
        if (index === 0) {
            return;
        }
        const parentIndex = this._getParentIndex(index);
        //
        if (this.data[index].priority >= this.data[parentIndex].priority) {
            return;
        }
        //
        this._swap(index, parentIndex);
        //
        this._siftUp(parentIndex);
    }
    //
    _siftDown(index) {
        if (this._isLeaf(index)) {
            return;
        }
        //
        const leftChildIndex = this._getLeftChildIndex(index);
        const rightChildIndex = this._getRightChildIndex(index);
        //
        let smallestIndex = index;
        //
        if (this.data[leftChildIndex] && this.data[leftChildIndex].priority < this.data[smallestIndex].priority) {
            smallestIndex = leftChildIndex;
        }
        if (this.data[rightChildIndex] && this.data[rightChildIndex].priority < this.data[smallestIndex].priority) {
            smallestIndex = rightChildIndex;
        }
        //
        if (smallestIndex === index) {
            return;
        }
        //
        this._swap(index, smallestIndex);
        //
        this._siftDown(smallestIndex);
    }
    //
    _isLeaf(index) {
        return index >= Math.floor(this.data.length / 2);
    }
    //
    _getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    //
    _getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    //
    _getRightChildIndex(index) {
        return 2 * index + 2;
    }
    //
    _swap(index1, index2) {
        this.data[index1].index = index2;
        this.data[index2].index = index1;
        //
        [this.data[index1], this.data[index2]] = [this.data[index2], this.data[index1]];
    }
}
