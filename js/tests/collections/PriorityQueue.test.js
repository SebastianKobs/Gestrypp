import { expect, test } from 'vitest';
import { PriorityQueue, PriorityValueObject } from '../../modules/collections/PriorityQueue.js';

test('PriorityQueue insert and extractMin', () => {
    const pq = new PriorityQueue();
    //
    pq.insert(new PriorityValueObject(5));
    pq.insert(new PriorityValueObject(3));
    pq.insert(new PriorityValueObject(8));
    pq.insert(new PriorityValueObject(1));
    pq.insert(new PriorityValueObject(10));
    //
    expect(pq.extractMin()).toBe(1);
    expect(pq.extractMin()).toBe(3);
    expect(pq.extractMin()).toBe(5);
    expect(pq.extractMin()).toBe(8);
    expect(pq.extractMin()).toBe(10);
});
//
test('PriorityQueue insert and extractMin with custom Priorities', () => {
    const pq = new PriorityQueue();
    //
    pq.insert(new PriorityValueObject(5, 1));
    pq.insert(new PriorityValueObject(3, 2));
    pq.insert(new PriorityValueObject(8, 3));
    pq.insert(new PriorityValueObject(1, 4));
    pq.insert(new PriorityValueObject(10, 5));
    //
    expect(pq.extractMin()).toBe(5);
    expect(pq.extractMin()).toBe(3);
    expect(pq.extractMin()).toBe(8);
    expect(pq.extractMin()).toBe(1);
    expect(pq.extractMin()).toBe(10);
});
//
test('PriorityQueue insert and extractMin with custom  non consecutive Priorities', () => {
    const pq = new PriorityQueue();
    //
    pq.insert(new PriorityValueObject(5, 1));
    pq.insert(new PriorityValueObject(3, 12));
    pq.insert(new PriorityValueObject(8, 8));
    pq.insert(new PriorityValueObject(1, 14));
    pq.insert(new PriorityValueObject(10, 17));
    //
    expect(pq.extractMin()).toBe(5);
    expect(pq.extractMin()).toBe(8);
    expect(pq.extractMin()).toBe(3);
    expect(pq.extractMin()).toBe(1);
    expect(pq.extractMin()).toBe(10);
});
//
test('PriorityQueue extractMin on empty pq', () => {
    const pq = new PriorityQueue();
    expect(() => pq.extractMin()).toThrow('PriorityQueue is empty');
});
//
test('PriorityQueue insert and extractMin with duplicates', () => {
    const pq = new PriorityQueue();
    //
    pq.insert(new PriorityValueObject(5));
    pq.insert(new PriorityValueObject(3));
    pq.insert(new PriorityValueObject(5));
    pq.insert(new PriorityValueObject(1));
    pq.insert(new PriorityValueObject(10));
    //
    expect(pq.extractMin()).toBe(1);
    expect(pq.extractMin()).toBe(3);
    expect(pq.extractMin()).toBe(5);
    expect(pq.extractMin()).toBe(5);
    expect(pq.extractMin()).toBe(10);
});
//
test('PriorityQueue insert and extractMin with negative numbers', () => {
    const pq = new PriorityQueue();
    //
    pq.insert(new PriorityValueObject(-5));
    pq.insert(new PriorityValueObject(-3));
    pq.insert(new PriorityValueObject(-8));
    pq.insert(new PriorityValueObject(-1));
    pq.insert(new PriorityValueObject(-10));
    //
    expect(pq.extractMin()).toBe(-10);
    expect(pq.extractMin()).toBe(-8);
    expect(pq.extractMin()).toBe(-5);
    expect(pq.extractMin()).toBe(-3);
    expect(pq.extractMin()).toBe(-1);
});
//
test('PriorityQueue insert and extractMin with mixed numbers', () => {
    const pq = new PriorityQueue();
    //
    pq.insert(new PriorityValueObject(5));
    pq.insert(new PriorityValueObject(-3));
    pq.insert(new PriorityValueObject(8));
    pq.insert(new PriorityValueObject(1));
    pq.insert(new PriorityValueObject(-10));
    //
    expect(pq.extractMin()).toBe(-10);
    expect(pq.extractMin()).toBe(-3);
    expect(pq.extractMin()).toBe(1);
    expect(pq.extractMin()).toBe(5);
    expect(pq.extractMin()).toBe(8);
});
//
test('PriorityQueue insert and extractMin with large numbers', () => {
    const pq = new PriorityQueue();
    //
    pq.insert(new PriorityValueObject(1000000));
    pq.insert(new PriorityValueObject(500000));
    pq.insert(new PriorityValueObject(2000000));
    pq.insert(new PriorityValueObject(100000));
    pq.insert(new PriorityValueObject(3000000));
    //
    expect(pq.extractMin()).toBe(100000);
    expect(pq.extractMin()).toBe(500000);
    expect(pq.extractMin()).toBe(1000000);
    expect(pq.extractMin()).toBe(2000000);
    expect(pq.extractMin()).toBe(3000000);
});
//
test('PriorityQueue insert and extractMin with single element', () => {
    const pq = new PriorityQueue();
    pq.insert(new PriorityValueObject(42));
    //
    expect(pq.extractMin()).toBe(42);
    expect(() => pq.extractMin()).toThrow('PriorityQueue is empty');
});
//
test('PriorityQueue contains', () => {
    const pq = new PriorityQueue();
    //
    const value1 = new PriorityValueObject(5);
    const value2 = new PriorityValueObject(3);
    //
    pq.insert(value1);
    pq.insert(value2);
    //
    expect(pq.contains(value1)).toBe(true);
    expect(pq.contains(value2)).toBe(true);
    expect(pq.contains(new PriorityValueObject(10))).toBe(false);
});
//
test('PriorityQueue decreasePriority', () => {
    const pq = new PriorityQueue();
    //
    const value1 = new PriorityValueObject(5, 10);
    const value2 = new PriorityValueObject(3, 8);
    //
    pq.insert(value1);
    pq.insert(value2);
    //
    pq.decreasePriority(value1.value, 5);
    //
    expect(pq.extractMin()).toBe(5);
    expect(pq.extractMin()).toBe(3);
});
//
test('PriorityQueue decreasePriority with invalid new priority', () => {
    const pq = new PriorityQueue();
    //
    const value1 = new PriorityValueObject(5, 10);
    pq.insert(value1);
    //
    expect(() => pq.decreasePriority(value1.value, 15)).toThrow('New priority 15 must be less than current priority 10');
});
//
test('PriorityQueue decreasePriority with non-existent value', () => {
    const pq = new PriorityQueue();
    //
    expect(() => pq.decreasePriority(999, 5)).toThrow('Value 999 not found in PriorityQueue');
});
//
test('PriorityQueue clear', () => {
    const pq = new PriorityQueue();
    //
    const value1 = new PriorityValueObject(5);
    const value2 = new PriorityValueObject(3);
    //
    pq.insert(value1);
    pq.insert(value2);
    //
    expect(pq.contains(value1)).toBe(true);
    expect(pq.contains(value2)).toBe(true);
    //
    pq.clear();
    //
    expect(pq.contains(new PriorityValueObject(5))).toBe(false);
    expect(pq.contains(new PriorityValueObject(3))).toBe(false);
});
