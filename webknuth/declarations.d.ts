// TypeScript declaration file for the Fibonacci Heap library
declare module 'fibonacci-heap' {
    export default class FibonacciHeap<K, V> {
      insert(key: K, value: V): void;
      findMinimum(): { key: K; value: V } | null;
      extractMinimum(): { key: K; value: V } | null;
      isEmpty(): boolean;
      size(): number;
    }
  }
  