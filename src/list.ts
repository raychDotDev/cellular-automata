export default class List<T> {
    private items: T[] = [];
  
    // Добавляет элемент в конец списка
    public add(item: T): void {
      this.items.push(item);
    }
  
    // Удаляет элемент из начала списка и возвращает его
    public remove(): T | undefined {
      return this.items.shift();
    }
  
    // Возвращает количество элементов в списке
    public size(): number {
      return this.items.length;
    }
  
    // Возвращает элемент по индексу
    public get(index: number): T | undefined {
      if (index >= 0 && index < this.items.length) {
        return this.items[index];
      }
      return undefined; // Возвращает undefined, если индекс вне диапазона
    }
    public removeLast(): void {
        if (this.items.length > 0) {
            this.items.pop();
        }
    }
    public getLast(): T | undefined {
        if (this.items.length > 0) {
            return this.items[this.items.length - 1];
        }
        return undefined;
    }
  }