"use client";

import React, { useState } from "react";
import styles from "../../styles/list.module.css";

// Define um nó da lista encadeada
class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

// Define a lista encadeada auto-organizável
class SelfOrganizingList<T> {
  private head: ListNode<T> | null = null;

  insert(value: T): void {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
  }

  moveToFront(value: T): void {
    if (!this.head || this.head.value === value) return;

    let prev: ListNode<T> | null = null;
    let current: ListNode<T> | null = this.head;

    while (current && current.value !== value) {
      prev = current;
      current = current.next;
    }

    if (current && prev) {
      prev.next = current.next;
      current.next = this.head;
      this.head = current;
    }
  }

  toArray(): T[] {
    let arr: T[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }
}

export default function SelfOrganizingListComponent() {
  const [list] = useState(new SelfOrganizingList<number>());
  const [values, setValues] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      list.insert(value);
      setValues(list.toArray());
      setInputValue("");
    }
  };

  const handleMoveToFront = (value: number) => {
    list.moveToFront(value);
    setValues(list.toArray());
  };

  return (
    <main className={styles.listContainer}>
      <h1 className={styles.listTitle}>Lista Encadeada Auto-Organizável</h1>

      <div className={styles.controls}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite um número"
          className={styles.input}
        />
        <button className={styles.listButton} onClick={handleInsert}>
          Inserir
        </button>
      </div>

      <ul className={styles.list}>
        {values.map((value, index) => (
          <li key={index} className={styles.listItem}>
            {value}
            <button className={styles.moveButton} onClick={() => handleMoveToFront(value)}>
              Mover para Frente
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
