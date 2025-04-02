  //Define um nó de lista encadeada usando genéricos
class ListNode<T> {
  value: T;
  //Atributo que aponta para o próximo nó da lista, se não houver próximo nó, é nulo	
  next: ListNode<T> | null = null;

  //Construtor que inicializa o nó com um valor
  constructor(value: T) {
    this.value = value;
  }
}

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
